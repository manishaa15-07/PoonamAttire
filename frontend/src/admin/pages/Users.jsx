import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/adminApi';
import Modal from '../components/Modal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [userOrdersLoading, setUserOrdersLoading] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminAPI.getUsers();
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // View User
    const handleView = async (user) => {
        setModal({ open: true, type: 'view', user });
        setUserOrdersLoading(true);
        setUserOrders([]);
        try {
            // Fetch all orders and filter by user._id
            const ordersRes = await adminAPI.getOrders();
            const orders = ordersRes.data.filter(order => order.user && order.user._id === user._id);
            setUserOrders(orders);
        } catch {
            setUserOrders([]);
        } finally {
            setUserOrdersLoading(false);
        }
    };

    // Delete User
    const handleDelete = (user) => setModal({ open: true, type: 'delete', user });
    const handleDeleteConfirm = async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            await adminAPI.deleteUser(modal.user._id);
            setModal({ open: false });
            fetchUsers();
        } catch (err) {
            setActionError(err.response?.data?.error || 'Error deleting user');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-black">Users</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="border-b">
                                    <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4 capitalize">{user.role}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleView(user)} className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition">View</button>
                                        <button onClick={() => handleDelete(user)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition">Delete</button>
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
                title="User Details"
            >
                {modal.user && (
                    <div className="space-y-2">
                        <div><b>First Name:</b> {modal.user.firstName}</div>
                        <div><b>Last Name:</b> {modal.user.lastName}</div>
                        <div><b>Email:</b> {modal.user.email}</div>
                        <div><b>Phone:</b> {modal.user.phone || 'N/A'}</div>
                        <div><b>Address:</b> {modal.user.address ? Object.values(modal.user.address).join(', ') : 'N/A'}</div>
                        <div><b>Role:</b> {modal.user.role}</div>
                        <div><b>Wishlist Count:</b> {modal.user.wishlist ? modal.user.wishlist.length : 0}</div>
                        <div><b>Number of Orders:</b> {userOrdersLoading ? 'Loading...' : userOrders.length}</div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={modal.open && modal.type === 'delete'}
                onClose={() => setModal({ open: false })}
                title="Delete User"
                actions={
                    <>
                        <button onClick={() => setModal({ open: false })} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500 text-white rounded" disabled={actionLoading}>{actionLoading ? 'Deleting...' : 'Delete'}</button>
                    </>
                }
            >
                <div>Are you sure you want to delete <b>{modal.user?.firstName} {modal.user?.lastName}</b>?</div>
                {actionError && <div className="text-red-500 mt-2">{actionError}</div>}
            </Modal>
        </div>
    );
};

export default Users; 