import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        toast.success('Order placed successfully!');
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        try {
            setLoading(true);
            const response = await ordersAPI.getOrder(id);
            setOrder(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading order:', err);
            setError(err.response?.data?.message || 'Error loading order');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={loadOrder}
                    className="mt-4 btn-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Order not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
                    <p className="text-gray-600">
                        Thank you for your purchase. Your order has been received.
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Order Details */}
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Order Number</p>
                                <p className="font-medium">{order._id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="font-medium">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Payment Method</p>
                                <p className="font-medium capitalize">{order.paymentMethod}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Order Status</p>
                                <p className="font-medium capitalize">{order.status}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                        <div className="text-gray-600">
                            <p>{order.shippingAddress.street}</p>
                            <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                            </p>
                            <p>{order.shippingAddress.country}</p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-sm font-medium">{item.product.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium">
                                        ₹{item.price * item.quantity}
                                    </p>
                                </div>
                            ))}

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{order.totalAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link to="/products" className="btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 