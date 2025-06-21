// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     images: [{
//         type: String,
//         required: true
//     }],
//     category: {
//         type: String,
//         required: true,
//         enum: ['Sarees', 'Lehengas', 'Gowns', 'Suits', 'Kurtis']
//     },
//     sizes: [{
//         type: String,
//         required: true
//     }],
//     stock: {
//         type: Map,
//         of: Number,
//         default: new Map()
//     },
//     details: [{
//         type: String
//     }],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// // Update the updatedAt timestamp before saving
// productSchema.pre('save', function (next) {
//     this.updatedAt = Date.now();
//     next();
// });

// // Method to check if a specific size is in stock
// productSchema.methods.isSizeInStock = function (size, quantity = 1) {
//     return (this.stock.get(size) || 0) >= quantity;
// };

// // Method to update stock for a specific size
// productSchema.methods.updateStock = function (size, quantity) {
//     const currentStock = this.stock.get(size) || 0;
//     this.stock.set(size, currentStock + quantity);
// };

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product; 






const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String,
        required: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['Sarees', 'Lehengas', 'Gowns', 'Suits', 'Kurtis']
    },
    sizes: [{
        type: String,
        required: true
    }],
    stock: {
        type: Map,
        of: Number,
        default: new Map()
    },
    details: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Method to check if a specific size is in stock
productSchema.methods.isSizeInStock = function (size, quantity = 1) {
    return (this.stock.get(size) || 0) >= quantity;
};

// Method to update stock for a specific size
productSchema.methods.updateStock = function (size, quantity) {
    const currentStock = this.stock.get(size) || 0;
    this.stock.set(size, currentStock + quantity);
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
