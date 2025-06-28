import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'cod'
    });

    const [loading, setLoading] = useState(false);

    // Get cart items safely
    const cartItems = cart?.items || [];

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
        const price = item.product?.price || item.price || 0;
        return sum + (price * item.quantity);
    }, 0);
    const shipping = subtotal > 1000 ? 0 : 100; // Free shipping over ₹1000
    const total = subtotal + shipping;

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to checkout');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            navigate('/cart');
            return;
        }

        console.log('=== CHECKOUT DEBUG ===');
        console.log('Cart object:', cart);
        console.log('Cart items:', cartItems);
        console.log('Number of cart items:', cartItems.length);

        // Log each cart item individually
        cartItems.forEach((item, index) => {
            console.log(`Cart item ${index}:`, {
                item: item,
                keys: Object.keys(item),
                product: item.product,
                productType: typeof item.product,
                productId: item.product?._id,
                size: item.size,
                quantity: item.quantity
            });
        });

        setLoading(true);

        try {
            console.log('Cart items before mapping:', JSON.stringify(cartItems, null, 2));

            // First, let's validate that all cart items have the required data
            const validCartItems = cartItems.filter(item => {
                const hasProductId = item.product?._id || (typeof item.product === 'string' && item.product);
                const hasRequiredFields = item.size && item.quantity;

                if (!hasProductId) {
                    console.error('Cart item missing product ID:', item);
                    return false;
                }
                if (!hasRequiredFields) {
                    console.error('Cart item missing required fields:', item);
                    return false;
                }
                return true;
            });

            if (validCartItems.length === 0) {
                toast.error('No valid items in cart. Please add items to cart first.');
                navigate('/cart');
                return;
            }

            const orderData = {
                items: validCartItems.map(item => {
                    console.log('Processing cart item:', {
                        item: item,
                        itemKeys: Object.keys(item),
                        productField: item.product,
                        productType: typeof item.product,
                        hasProduct: !!item.product
                    });

                    // Handle the new cart structure
                    let productId;
                    if (item.product && typeof item.product === 'object' && item.product._id) {
                        // Product is populated object
                        productId = item.product._id;
                        console.log('Found product ID from populated object:', productId);
                    } else if (item.product && typeof item.product === 'string') {
                        // Product is just the ID string
                        productId = item.product;
                        console.log('Found product ID from string:', productId);
                    } else {
                        console.error('No product ID found for item:', item);
                        console.error('Item structure:', {
                            keys: Object.keys(item),
                            product: item.product,
                            size: item.size,
                            quantity: item.quantity
                        });
                        throw new Error('Product ID missing for item');
                    }

                    // Get product details from the populated product object
                    const productName = item.product?.name || 'Unknown Product';
                    const productPrice = item.product?.price || 0;

                    console.log('Mapping item:', {
                        originalItem: item,
                        productId,
                        productName,
                        productPrice,
                        size: item.size,
                        quantity: item.quantity
                    });

                    return {
                        productId: productId,
                        name: productName,
                        price: productPrice,
                        size: item.size,
                        quantity: item.quantity
                    };
                }),
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                },
                paymentMethod: formData.paymentMethod,
                subtotal,
                shipping,
                total
            };

            console.log('Sending order data:', JSON.stringify(orderData, null, 2));

            const response = await ordersAPI.create(orderData);

            clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order-confirmation/${response.data._id}`);

        } catch (error) {
            console.error('Error placing order:', error);
            console.error('Error type:', error.constructor.name);
            console.error('Error message:', error.message);
            console.error('Error response status:', error.response?.status);
            console.error('Error response data:', error.response?.data);
            console.error('Error response headers:', error.response?.headers);

            // Show detailed error message
            let errorMessage = 'Failed to place order. Please try again.';

            if (error.response) {
                // Server responded with error status
                console.error('Server error response:', error.response.data);
                if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                }
                if (error.response.data.details) {
                    console.error('Error details:', error.response.data.details);
                    if (typeof error.response.data.details === 'object') {
                        const details = Object.values(error.response.data.details).join(', ');
                        errorMessage += ` - ${details}`;
                    } else {
                        errorMessage += ` - ${error.response.data.details}`;
                    }
                }
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = 'Network error. Please check your connection.';
            }

            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login to Checkout</h2>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-[#b94e13] transition"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-[#b94e13] transition"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Checkout Form */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Checkout Information</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Address *
                                        </label>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            required
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cod"
                                            checked={formData.paymentMethod === 'cod'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span>Cash on Delivery</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="online"
                                            checked={formData.paymentMethod === 'online'}
                                            onChange={handleInputChange}
                                            className="mr-2"
                                        />
                                        <span>Online Payment (Coming Soon)</span>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-primary text-white rounded-md hover:bg-[#b94e13] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : `Place Order - ₹${total}`}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <img
                                        src={item.image || item.product?.images?.[0]}
                                        alt={item.name || item.product?.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{item.name || item.product?.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            Size: {item.size} | Qty: {item.quantity}
                                        </p>
                                        <p className="text-primary font-semibold">
                                            ₹{(item.price || item.product?.price || 0) * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t mt-6 pt-6 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping:</span>
                                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 