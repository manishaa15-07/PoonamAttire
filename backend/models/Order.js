const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        size: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        image: String
    }],
    shippingAddress: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
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
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'India'
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'online', 'card', 'upi']
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    subtotal: {
        type: Number,
        required: true
    },
    shipping: {
        type: Number,
        required: true,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cancellationReason: String,
    notes: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Combined pre-save middleware
orderSchema.pre('save', function (next) {
    // Generate order number if not exists
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderNumber = `PLW${year}${month}${day}${random}`;
    }

    // Calculate total if not provided
    if (!this.total || this.isModified('items') || this.isModified('subtotal') || this.isModified('shipping')) {
        this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.total = this.subtotal + this.shipping + this.tax - this.discount;
    }

    next();
});

// Calculate total method
orderSchema.methods.calculateTotal = function () {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.total = this.subtotal + this.shipping + this.tax - this.discount;
    return this.total;
};

module.exports = mongoose.model('Order', orderSchema); 