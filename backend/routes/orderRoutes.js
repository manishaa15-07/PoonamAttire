const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { auth, adminAuth } = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    try {
        console.log('=== ORDER CREATION REQUEST ===');
        console.log('User ID:', req.user._id);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('Request headers:', req.headers);

        const { items, shippingAddress, paymentMethod, subtotal, shipping, total } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            console.log('❌ Error: No items in cart');
            return res.status(400).json({ error: 'No items in cart' });
        }

        if (!shippingAddress) {
            console.log('❌ Error: Shipping address is required');
            return res.status(400).json({ error: 'Shipping address is required' });
        }

        // Validate shipping address fields
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
        for (const field of requiredFields) {
            if (!shippingAddress[field]) {
                console.log(`❌ Error: Missing shipping address field: ${field}`);
                return res.status(400).json({ error: `Missing shipping address field: ${field}` });
            }
        }

        console.log('✅ Shipping address validation passed');

        // Validate items and calculate totals
        let calculatedSubtotal = 0;
        const orderItems = [];

        for (const item of items) {
            console.log('Processing item:', JSON.stringify(item, null, 2));

            const productId = item.productId || item.product;
            if (!productId) {
                console.log('❌ Error: Product ID is missing for item:', item);
                return res.status(400).json({ error: 'Product ID is missing for an item' });
            }

            console.log('Looking for product with ID:', productId);
            const product = await Product.findById(productId);
            if (!product) {
                console.log(`❌ Error: Product not found: ${productId}`);
                return res.status(404).json({ error: `Product ${productId} not found` });
            }

            console.log('✅ Product found:', product.name);

            // Check if product has stock for the requested size
            let hasStock = false;
            let availableStock = 0;

            if (product.stock && product.stock instanceof Map) {
                availableStock = product.stock.get(item.size) || 0;
                hasStock = availableStock > 0;
                console.log(`Stock check for size ${item.size}: ${availableStock} available`);
            } else {
                console.log('❌ Error: Product has no stock data');
                return res.status(400).json({ error: `Product ${product.name} has no stock data` });
            }

            if (!hasStock) {
                console.log(`❌ Error: Product out of stock for size ${item.size}: ${product.name}`);
                return res.status(400).json({ error: `Product ${product.name} is out of stock for size ${item.size}` });
            }

            if (availableStock < item.quantity) {
                console.log(`❌ Error: Insufficient stock for ${product.name} size ${item.size}. Requested: ${item.quantity}, Available: ${availableStock}`);
                return res.status(400).json({ error: `Insufficient stock for ${product.name} size ${item.size}. Available: ${availableStock}` });
            }

            const itemPrice = item.price || product.price;
            const itemTotal = itemPrice * item.quantity;
            calculatedSubtotal += itemTotal;

            console.log(`✅ Item processed: ${product.name} - Qty: ${item.quantity}, Price: ${itemPrice}, Total: ${itemTotal}`);

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                size: item.size,
                price: itemPrice,
                name: item.name || product.name,
                image: item.image || product.images[0]
            });

            // Update product stock
            const newStockQuantity = availableStock - item.quantity;
            product.stock.set(item.size, newStockQuantity);

            // Check if this size is now out of stock
            if (newStockQuantity <= 0) {
                console.log(`Size ${item.size} is now out of stock for ${product.name}`);
            }

            await product.save();
            console.log(`✅ Stock updated for ${product.name} size ${item.size}: ${newStockQuantity} remaining`);
        }

        // Use provided totals or calculate them
        const finalSubtotal = subtotal || calculatedSubtotal;
        const finalShipping = shipping || 0;
        const finalTotal = total || (finalSubtotal + finalShipping);

        console.log('📊 Order totals:');
        console.log('- Calculated subtotal:', calculatedSubtotal);
        console.log('- Provided subtotal:', subtotal);
        console.log('- Final subtotal:', finalSubtotal);
        console.log('- Shipping:', finalShipping);
        console.log('- Total:', finalTotal);

        console.log('Creating order with:', {
            user: req.user._id,
            itemsCount: orderItems.length,
            subtotal: finalSubtotal,
            shipping: finalShipping,
            total: finalTotal
        });

        const order = new Order({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal: finalSubtotal,
            shipping: finalShipping,
            total: finalTotal,
            orderStatus: 'pending'
        });

        console.log('Saving order...');
        const newOrder = await order.save();
        console.log('✅ Order created successfully:', newOrder._id);
        console.log('Order number:', newOrder.orderNumber);

        // Clear user's cart after successful order
        try {
            await Cart.findOneAndUpdate(
                { user: req.user._id },
                { $set: { items: [] } }
            );
            console.log('✅ Cart cleared successfully');
        } catch (cartError) {
            console.error('❌ Error clearing cart:', cartError);
            // Don't fail the order if cart clearing fails
        }

        res.status(201).json(newOrder);

    } catch (error) {
        console.error('❌ Order creation error:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);

        // Check for validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            console.error('Validation errors:', validationErrors);
            return res.status(400).json({ error: 'Validation error', details: validationErrors });
        }

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

// Get user's orders (alternative route)
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

module.exports = router; 