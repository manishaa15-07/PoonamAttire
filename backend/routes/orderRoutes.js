const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { auth, adminAuth } = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod, phone } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'No items in cart' });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ error: `Product ${item.product} not found` });
            }
            if (!item.size) {
                return res.status(400).json({ error: `Size not specified for ${product.name}` });
            }
            if (product.price !== item.price) {
                return res.status(400).json({ error: `Price for ${product.name} has changed. Please review your cart.` });
            }

            if (!product.isSizeInStock(item.size, item.quantity)) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name} in size ${item.size}` });
            }

            totalAmount += item.price * item.quantity;
            orderItems.push({
                product: item.product,
                quantity: item.quantity,
                size: item.size,
                price: item.price,
                name: product.name,
                image: product.images[0]
            });
        }

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            phone,
            totalAmount
        });

        for (const item of order.items) {
            const product = await Product.findById(item.product);
            product.updateStock(item.size, -item.quantity);
            await product.save();
        }

        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [], totalAmount: 0 } }
        );

        const newOrder = await order.save();
        res.status(201).json(newOrder);

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(500).json({ error: 'Error creating order', details: error.message });
    }
});

router.get('/ad', adminAuth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) {
            query.status = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('items.product');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching order' });
    }
});

// Update order status (admin only)
router.patch('/:id/status', adminAuth, async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;
        if (trackingNumber) {
            order.trackingNumber = trackingNumber;
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all orders (admin only)

// router.get('/my-orders', auth, async (req, res) => {
//     try {
//         const orders = await Order.find({ user: req.user._id })
//             .populate('items.product')
//             .sort({ createdAt: -1 });
//         res.json(orders);
//     } catch (error) {
//         console.error('Error fetching my orders:', error);
//         res.status(500).json({ error: 'Error fetching orders', details: error.message });
//     }
// });

router.get('/my-orders', auth, async (req, res) => {
    console.log('Request headers:', req.headers);
    try {
        console.log('Fetching orders for user:', req.user._id);
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        console.log('Orders fetched:', orders.length);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching my orders:', error);
        res.status(500).json({ error: 'Error fetching orders', details: error.message });
    }
});

module.exports = router; 