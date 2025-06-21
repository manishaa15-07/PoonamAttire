const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cart' });
    }
});

// Add item to cart
router.post('/', auth, async (req, res) => {
    const { productId, quantity, size, cartItemId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = new Cart({ user: req.user._id, items: [] });

        const existingItem = cart.items.id(cartItemId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ _id: cartItemId, product: productId, quantity, size });
        }

        await cart.save();
        await cart.populate('items.product');
        res.status(200).json(cart);
    } catch (error) {
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