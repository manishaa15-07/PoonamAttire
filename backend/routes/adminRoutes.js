const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');

// Admin Signup
router.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        console.log('📝 Admin signup request body:', req.body);
        console.log('📝 Extracted fields:', { firstname, lastname, email, password: password ? '[HIDDEN]' : 'MISSING' });

        // Validate required fields
        if (!firstname || !lastname || !email || !password) {
            console.log('❌ Missing required fields');
            return res.status(400).json({
                error: 'Missing required fields',
                details: {
                    firstname: !firstname ? 'First name is required' : null,
                    lastname: !lastname ? 'Last name is required' : null,
                    email: !email ? 'Email is required' : null,
                    password: !password ? 'Password is required' : null
                }
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ Email already registered:', email);
            return res.status(400).json({ error: 'Email already registered' });
        }

        console.log('✅ Validation passed, creating admin user...');

        // Create new admin user with proper field mapping
        const user = new User({
            firstName: firstname,
            lastName: lastname,
            email,
            password,
            role: 'admin'
        });

        console.log('📝 Creating user with data:', {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        });

        await user.save();
        console.log('✅ Admin user saved successfully:', user._id);

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('🔑 Token generated for admin user:', user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Admin signup error:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);

        if (error.name === 'ValidationError') {
            console.error('❌ Validation errors:', error.errors);
            return res.status(400).json({
                error: 'Validation error',
                details: error.errors
            });
        }

        res.status(400).json({ error: error.message });
    }
});

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Admin login request:', { email, password: password ? '[HIDDEN]' : 'MISSING' });

        // Find user
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            console.log('Admin user not found for email:', email);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Admin user found:', user._id);

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password mismatch for admin user:', user._id);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('Password verified for admin user:', user._id);

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        console.log('Admin login successful:', user._id);

        res.json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Get Admin Profile
router.get('/profile', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get admin profile error:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Update Admin Profile
router.patch('/profile', adminAuth, async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, email },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Update admin profile error:', error);
        res.status(500).json({ error: 'Error updating profile' });
    }
});

// Admin Products Routes
router.get('/products', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', category = '' } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        const products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            products,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
});

router.get('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get admin product error:', error);
        res.status(500).json({ error: 'Error fetching product' });
    }
});

router.post('/products', adminAuth, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Create admin product error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.patch('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Update admin product error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete admin product error:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
});

// Admin Orders Routes
router.get('/orders', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '' } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('user', 'firstName lastName email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

router.get('/orders/:id', adminAuth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email');
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Get admin order error:', error);
        res.status(500).json({ error: 'Error fetching order' });
    }
});

router.patch('/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus: status },
            { new: true }
        ).populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Error updating order status' });
    }
});

// Admin Users Routes
router.get('/users', adminAuth, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        let query = { role: { $ne: 'admin' } }; // Exclude admins
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(query);

        res.json({
            users,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('Get admin users error:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
});

router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get admin user error:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
});

router.patch('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Update admin user error:', error);
        res.status(400).json({ error: error.message });
    }
});

router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete admin user error:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

// Admin Dashboard Routes
router.get('/dashboard/stats', adminAuth, async (req, res) => {
    try {
        console.log('📊 Dashboard stats requested by admin:', req.user._id);

        const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const totalRevenue = await Order.aggregate([
            { $match: { orderStatus: 'delivered' } },
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);

        const recentOrders = await Order.find()
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(5);

        const topProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const stats = {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0
        };

        console.log('📊 Dashboard stats calculated:', stats);
        console.log('📦 Recent orders count:', recentOrders.length);
        console.log('📦 Top products count:', topProducts.length);

        res.json({
            stats,
            recentOrders,
            topProducts
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
});

module.exports = router; 