import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { FiPackage, FiCheckCircle, FiTruck, FiHome } from 'react-icons/fi';

const OrderStatusTracker = ({ status }) => {
    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentStatusIndex = statuses.indexOf(status);

    const getStatusIcon = (s) => {
        switch (s) {
            case 'PENDING': return <FiPackage />;
            case 'PROCESSING': return <FiPackage />;
            case 'SHIPPED': return <FiTruck />;
            case 'DELIVERED': return <FiHome />;
            default: return <FiCheckCircle />;
        }
    };

    return (
        <div className="my-8">
            <div className="flex items-center justify-between">
                {statuses.map((s, index) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${index <= currentStatusIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {getStatusIcon(s)}
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${index <= currentStatusIndex ? 'text-primary' : 'text-gray-500'}`}>{s}</p>
                        </div>
                        {index < statuses.length - 1 && (
                            <div className={`flex-1 h-1 mx-2 ${index < currentStatusIndex ? 'bg-primary' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const response = await ordersAPI.getOrderById(id);
                setOrder(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to load order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading order details...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (!order) return <div className="text-center py-20">Order not found.</div>;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Order #{order._id.slice(-6).toUpperCase()}</h1>
                            <p className="text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Link to="/profile" state={{ defaultTab: 'orders' }} className="btn-secondary">
                            Back to My Orders
                        </Link>
                    </div>

                    <OrderStatusTracker status={order.status} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Shipping Details */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Shipping Address</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                                <p><strong>Phone:</strong> {order.phone}</p>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Order Summary</h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between py-1">
                                    <span>Subtotal</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span>Shipping</span>
                                    <span>FREE</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-700 mb-4">Items in this Order</h2>
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item._id} className="flex items-center bg-white p-4 rounded-lg border">
                                    <img src={item.product.images?.[0] || '/placeholder-image.jpg'} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-800">₹{item.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails; 