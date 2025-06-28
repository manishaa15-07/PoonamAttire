const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');

// Get all products (with better filtering and pagination)
router.get('/', async (req, res) => {
    try {
        const { category, sort, search, page = 1, limit = 10 } = req.query;
        let query = { isActive: true };

        if (category) {
            query.category = { $regex: new RegExp(category, 'i') };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortObj = { createdAt: -1 };
        if (sort === 'price-asc') sortObj = { price: 1 };
        if (sort === 'price-desc') sortObj = { price: -1 };
        if (sort === 'popular') sortObj = { 'ratings.average': -1 };

        const products = await Product.find(query)
            .sort(sortObj)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const count = await Product.countDocuments(query);

        // Add inStock field to each product based on stock data
        const productsWithStock = products.map(product => {
            const productObj = product.toObject();
            // Check if any size has stock > 0
            let hasStock = false;
            if (productObj.stock && productObj.stock instanceof Map) {
                for (const [size, quantity] of productObj.stock) {
                    if (quantity > 0) {
                        hasStock = true;
                        break;
                    }
                }
            }
            productObj.inStock = hasStock;
            return productObj;
        });

        if (productsWithStock.length === 0) {
            return res.status(200).json({
                message: 'No products found matching your criteria',
                products: [],
                total: 0,
                page: parseInt(page),
                pages: Math.ceil(count / limit)
            });
        }

        res.json({
            products: productsWithStock,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / limit)
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error while fetching products',
            details: error.message
        });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            isActive: true
        });

        if (!product) {
            return res.status(404).json({
                error: 'Product not found or may have been removed'
            });
        }

        // Add inStock field based on stock data
        const productObj = product.toObject();
        let hasStock = false;
        if (productObj.stock && productObj.stock instanceof Map) {
            for (const [size, quantity] of productObj.stock) {
                if (quantity > 0) {
                    hasStock = true;
                    break;
                }
            }
        }
        productObj.inStock = hasStock;

        res.json(productObj);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            error: 'Server error while fetching product',
            details: error.message
        });
    }
});

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const requiredFields = ['name', 'description', 'price', 'images', 'category', 'sizes'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields
            });
        }

        if (req.body.stock && typeof req.body.stock !== 'object') {
            return res.status(400).json({
                error: 'Stock must be an object with size quantities'
            });
        }

        const product = new Product({ ...req.body, isActive: true });
        await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }
        res.status(500).json({
            error: 'Server error while creating product',
            details: error.message
        });
    }
});

// Update product (admin only)
router.patch('/:id', adminAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'description', 'price', 'images', 'category', 'sizes', 'stock', 'isActive', 'details'];
    const invalidUpdates = updates.filter(update => !allowedUpdates.includes(update));

    if (invalidUpdates.length > 0) {
        return res.status(400).json({
            error: 'Invalid updates attempted',
            invalidUpdates,
            allowedUpdates
        });
    }

    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Validation failed during update',
                details: errors
            });
        }
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            error: 'Server error while updating product',
            details: error.message
        });
    }
});

// Delete product (admin only - soft delete)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        if (!product.isActive) {
            return res.status(400).json({
                error: 'Product is already inactive'
            });
        }

        product.isActive = false;
        await product.save();

        res.json({
            message: 'Product deactivated successfully',
            productId: product._id
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid product ID format'
            });
        }
        res.status(500).json({
            error: 'Server error while deleting product',
            details: error.message
        });
    }
});

module.exports = router;