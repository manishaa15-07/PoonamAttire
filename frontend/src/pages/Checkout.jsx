import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, getCartTotal, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        paymentMethod: 'cod'
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                postalCode: user.address?.pincode || '',
                phone: user.phone || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!cart || !cart.items || cart.items.length === 0) {
                throw new Error('Your cart is empty.');
            }

            const orderPayload = {
                items: cart.items.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    size: item.size,
                    price: item.product.price,
                })),
                shippingAddress: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.postalCode,
                    country: formData.country,
                },
                phone: formData.phone,
                paymentMethod: formData.paymentMethod.toUpperCase(),
            };

            const response = await ordersAPI.create(orderPayload);
            toast.success('Order placed successfully!');
            clearCart();
            navigate(`/order-confirmation/${response.data._id}`);

        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to place order. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty.</h2>
                <button onClick={() => navigate('/products')} className="bg-primary text-white px-6 py-2 rounded-lg">
                    Continue Shopping
                </button>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const shipping = 0;
    const total = subtotal + shipping;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text- mb-8 text-center">Checkout</h1>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
                    {/* Shipping & Payment */}
                    <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Street Address" name="street" value={formData.street} onChange={handleInputChange} required />
                            <InputField label="City" name="city" value={formData.city} onChange={handleInputChange} required />
                            <InputField label="State" name="state" value={formData.state} onChange={handleInputChange} required />
                            <InputField label="Pincode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                            <InputField label="Country" name="country" value={formData.country} onChange={handleInputChange} required />
                            <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mt-8 mb-6">Payment Method</h2>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <label className="flex items-center">
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                                <span className="ml-3 font-semibold text-gray-700">Cash on Delivery (COD)</span>
                            </label>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Your Order</h2>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {cart.items.map(item => (
                                    <div key={item._id} className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                                            <div className="ml-3">
                                                <p className="font-semibold text-gray-800">{item.product.name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-800">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 space-y-3">
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-gray-800">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                            </div>
                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-primary">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" />
    </div>
);

export default Checkout;










