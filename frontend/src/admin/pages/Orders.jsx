import React, { useState, useEffect } from 'react';
import { adminOrdersAPI } from '../services/adminApi';
import toast from 'react-hot-toast';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const orderStatuses = [
        'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'
    ];

    const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

    useEffect(() => {
        fetchOrders();
    }, [currentPage, statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                search: searchTerm,
                status: statusFilter
            };
            const response = await adminOrdersAPI.getAll(params);
            setOrders(response.data.orders || response.data);
            setTotalPages(response.data.totalPages || 1);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchOrders();
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await adminOrdersAPI.updateStatus(orderId, { orderStatus: newStatus });
            toast.success('Order status updated successfully');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handlePaymentStatusUpdate = async (orderId, newPaymentStatus) => {
        try {
            await adminOrdersAPI.updatePaymentStatus(orderId, { paymentStatus: newPaymentStatus });
            toast.success('Payment status updated successfully');
            fetchOrders();
        } catch (error) {
            console.error('Error updating payment status:', error);
            toast.error('Failed to update payment status');
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            shipped: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            returned: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600">Manage customer orders and track their status</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search orders by order number or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Statuses</option>
                            {orderStatuses.map(status => (
                                <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={handleSearch}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            #{order.orderNumber}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.items?.length || 0} items
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.shippingAddress?.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{order.total}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(order.orderStatus)}`}
                                        >
                                            {orderStatuses.map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={order.paymentStatus}
                                            onChange={(e) => handlePaymentStatusUpdate(order._id, e.target.value)}
                                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getPaymentStatusColor(order.paymentStatus)}`}
                                        >
                                            {paymentStatuses.map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(order)}
                                            className="text-primary hover:text-[#b94e13]"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Order Details - #{selectedOrder.orderNumber}
                                </h3>
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            {/* Customer Information */}
                            <div className="mb-6">
                                <h4 className="text-md font-semibold mb-2">Customer Information</h4>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p><strong>Name:</strong> {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.shippingAddress?.email}</p>
                                    <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.phone}</p>
                                    <p><strong>Address:</strong> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="text-md font-semibold mb-2">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                            <div className="flex items-center">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded object-cover mr-3"
                                                />
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-medium">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="mb-6">
                                <h4 className="text-md font-semibold mb-2">Order Summary</h4>
                                <div className="bg-gray-50 p-4 rounded">
                                    <div className="flex justify-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>₹{selectedOrder.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Shipping:</span>
                                        <span>₹{selectedOrder.shipping}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Tax:</span>
                                        <span>₹{selectedOrder.tax || 0}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Discount:</span>
                                        <span>-₹{selectedOrder.discount || 0}</span>
                                    </div>
                                    <div className="flex justify-between font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span>₹{selectedOrder.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="mb-6">
                                <h4 className="text-md font-semibold mb-2">Payment Information</h4>
                                <div className="bg-gray-50 p-4 rounded">
                                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase()}</p>
                                    <p><strong>Payment Status:</strong>
                                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                                            {selectedOrder.paymentStatus}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders; 