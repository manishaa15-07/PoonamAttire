const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        console.log('=== FETCHING CART ===');
        console.log('User ID:', req.user._id);

        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            console.log('No cart found, creating new cart');
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }

        console.log('Cart items after populate:', cart.items.map(item => ({
            _id: item._id,
            product: item.product,
            productType: typeof item.product,
            productId: item.product?._id,
            size: item.size,
            quantity: item.quantity
        })));

        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Error fetching cart' });
    }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
    const { productId, quantity, size, cartItemId } = req.body;
    try {
        console.log('=== ADDING TO CART ===');
        console.log('Request body:', { productId, quantity, size, cartItemId });

        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product not found:', productId);
            return res.status(404).json({ error: 'Product not found' });
        }

        console.log('Product found:', { _id: product._id, name: product.name });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            console.log('Creating new cart for user:', req.user._id);
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.id(cartItemId);

        if (existingItem) {
            console.log('Updating existing item quantity');
            existingItem.quantity += quantity;
        } else {
            console.log('Adding new item to cart');
            cart.items.push({ _id: cartItemId, product: productId, quantity, size });
        }

        await cart.save();
        console.log('Cart saved, populating items...');
        await cart.populate('items.product');

        console.log('Final cart items:', cart.items.map(item => ({
            _id: item._id,
            product: item.product,
            productType: typeof item.product,
            productId: item.product?._id,
            size: item.size,
            quantity: item.quantity
        })));

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ error: 'Error adding to cart', details: error.message });
    }
});

// Update item quantity
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user._id });
        const item = cart.items.id(id);

        if (item) {
            item.quantity = quantity;
            await cart.save();
            await cart.populate('items.product');
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating quantity', details: error.message });
    }
});

// Remove item from cart
router.delete('/:id', auth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { _id: req.params.id } } },
            { new: true }
        ).populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error removing from cart', details: error.message });
    }
});

// Clear cart
router.post('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [] } },
            { new: true }
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error clearing cart' });
    }
});

module.exports = router; 