const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    size: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'India'
        }
    },
    phone: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'ONLINE']
    },
    totalAmount: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true,
        default: () => Math.random().toString(36).substr(2, 9).toUpperCase()
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', async function (next) {
    if (this.isModified('items')) {
        let total = 0;
        for (const item of this.items) {
            total += item.price * item.quantity;
        }
        this.totalAmount = total;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 