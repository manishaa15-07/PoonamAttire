import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/adminApi';
import Modal from '../components/Modal';

const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [statusValue, setStatusValue] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminAPI.getOrders();
            setOrders(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // View Order
    const handleView = (order) => setModal({ open: true, type: 'view', order });

    // Update Status
    const handleUpdateStatus = (order) => {
        setStatusValue(order.status);
        setModal({ open: true, type: 'status', order });
    };
    const handleStatusSubmit = async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            await adminAPI.updateOrderStatus(modal.order._id, { status: statusValue });
            setModal({ open: false });
            fetchOrders();
        } catch (err) {
            setActionError(err.response?.data?.error || 'Error updating status');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-black">Orders</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="border-b">
                                    <td className="px-6 py-4">{order._id}</td>
                                    <td className="px-6 py-4">{order.user ? `${order.user.firstName} ${order.user.lastName}` : 'N/A'}</td>
                                    <td className="px-6 py-4">₹{order.totalAmount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status}</span>
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleView(order)} className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition">View</button>
                                        <button onClick={() => handleUpdateStatus(order)} className="px-3 py-1 bg-[#DA6220] text-white rounded hover:bg-[#b94e13] transition">Update Status</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* View Modal */}
            <Modal
                open={modal.open && modal.type === 'view'}
                onClose={() => setModal({ open: false })}
                title="Order Details"
            >
                {modal.order && (
                    <div className="space-y-2">
                        <div><b>Order #:</b> {modal.order._id}</div>
                        <div><b>User:</b> {modal.order.user ? `${modal.order.user.firstName} ${modal.order.user.lastName}` : 'N/A'}</div>
                        <div><b>Total:</b> ₹{modal.order.totalAmount}</div>
                        <div><b>Status:</b> {modal.order.status}</div>
                        <div><b>Items:</b>
                            <ul className="list-disc ml-6">
                                {modal.order.items && modal.order.items.map((item, i) => (
                                    <li key={i}>{item.product?.name} x {item.quantity} ({item.size})</li>
                                ))}
                            </ul>
                        </div>
                        <div><b>Shipping Address:</b> {modal.order.shippingAddress && Object.values(modal.order.shippingAddress).join(', ')}</div>
                        <div><b>Payment Method:</b> {modal.order.paymentMethod}</div>
                    </div>
                )}
            </Modal>

            {/* Update Status Modal */}
            <Modal
                open={modal.open && modal.type === 'status'}
                onClose={() => setModal({ open: false })}
                title="Update Order Status"
                actions={
                    <>
                        <button onClick={() => setModal({ open: false })} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button onClick={handleStatusSubmit} className="px-4 py-2 bg-[#DA6220] text-white rounded" disabled={actionLoading}>{actionLoading ? 'Updating...' : 'Update'}</button>
                    </>
                }
            >
                <div>
                    <label className="block font-medium mb-2">Status</label>
                    <select value={statusValue} onChange={e => setStatusValue(e.target.value)} className="w-full border px-3 py-2 rounded">
                        {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    {actionError && <div className="text-red-500 mt-2">{actionError}</div>}
                </div>
            </Modal>
        </div>
    );
};

export default Orders; 