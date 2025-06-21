const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

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
router.post('/add', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error adding item to cart' });
    }
});

// Update cart item quantity
router.patch('/update', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        const cartItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        cartItem.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error updating cart' });
    }
});

// Remove item from cart
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error removing item from cart' });
    }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();

        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error clearing cart' });
    }
});

module.exports = router; 