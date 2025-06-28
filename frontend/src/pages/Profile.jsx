import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, wishlistAPI } from '../services/api';
import { Link } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiHeart, FiLogOut } from 'react-icons/fi';

const Profile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [ordersError, setOrdersError] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(true);
    const [wishlistError, setWishlistError] = useState(null);

    useEffect(() => {
        if (user && activeTab === 'orders') {
            const fetchOrders = async () => {
                try {
                    console.log('🔄 Fetching orders for user:', user._id);
                    setLoadingOrders(true);
                    const response = await ordersAPI.getMyOrders();
                    console.log('✅ Orders response:', response);
                    console.log('📦 Orders data:', response.data);
                    console.log('📦 First order structure:', response.data[0]);
                    setOrders(response.data);
                    setOrdersError(null);
                } catch (err) {
                    console.error('❌ Error fetching orders:', err);
                    console.error('Error response:', err.response);
                    setOrdersError(err.response?.data?.error || 'Failed to load orders');
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [user, activeTab]);

    useEffect(() => {
        if (user && activeTab === 'wishlist') {
            const fetchWishlist = async () => {
                try {
                    setLoadingWishlist(true);
                    const response = await wishlistAPI.getWishlist();
                    setWishlist(response.data);
                    setWishlistError(null);
                } catch (err) {
                    setWishlistError(err.response?.data?.error || 'Failed to load wishlist');
                } finally {
                    setLoadingWishlist(false);
                }
            };
            fetchWishlist();
        }
    }, [user, activeTab]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await wishlistAPI.removeFromWishlist(productId);
            setWishlist(wishlist.filter(p => p._id !== productId));
        } catch (err) {
            setWishlistError('Failed to remove from wishlist');
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-lg">Please log in to view your profile.</p>
                <Link to="/login" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg">
                    Login
                </Link>
            </div>
        );
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileContent user={user} />;
            case 'orders':
                return <OrdersContent orders={orders} loading={loadingOrders} error={ordersError} />;
            case 'wishlist':
                return <WishlistContent wishlist={wishlist} loading={loadingWishlist} error={wishlistError} handleRemove={handleRemoveFromWishlist} />;
            default:
                return <ProfileContent user={user} />;
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="w-full md:w-1/4 px-4">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-bold mb-4">
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <nav className="space-y-2">
                                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                                    <FiUser className="mr-3" /> My Profile
                                </button>
                                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                                    <FiShoppingBag className="mr-3" /> My Orders
                                </button>
                                <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition ${activeTab === 'wishlist' ? 'bg-primary text-white shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}>
                                    <FiHeart className="mr-3" /> My Wishlist
                                </button>
                                <button onClick={logout} className="w-full flex items-center px-4 py-3 rounded-lg text-left transition text-red-500 hover:bg-red-50">
                                    <FiLogOut className="mr-3" /> Logout
                                </button>
                            </nav>
                        </div>
                    </div>
                    <div className="w-full md:w-3/4 px-4 mt-8 md:mt-0">
                        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileContent = ({ user }) => (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-600">Full Name</span>
                <p className="text-gray-800">{user.firstName} {user.lastName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
                <span className="font-semibold text-gray-600">Email Address</span>
                <p className="text-gray-800">{user.email}</p>
            </div>
            {user.phone && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="font-semibold text-gray-600">Phone</span>
                    <p className="text-gray-800">{user.phone}</p>
                </div>
            )}
            {user.address && (
                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <span className="font-semibold text-gray-600">Address</span>
                    <p className="text-gray-800">{user.address.street}, {user.address.city}, {user.address.state} {user.address.pincode}</p>
                </div>
            )}
        </div>
    </div>
);

const OrdersContent = ({ orders, loading, error }) => (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h2>
        {loading ? <div className="text-center py-8">Loading orders...</div> :
            error ? <div className="text-center py-8 text-red-500">{error}</div> :
                orders.length === 0 ? <div className="text-center py-8">You have no orders.</div> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map(order => (
                                    <tr key={order._id}>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-500">
                                            {order.orderNumber || order._id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                            ₹{(order.total || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${(order.orderStatus || order.status) === 'delivered' ? 'bg-green-100 text-green-800' :
                                                (order.orderStatus || order.status) === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {(order.orderStatus || order.status || 'pending').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
    </div>
);

const WishlistContent = ({ wishlist, loading, error, handleRemove }) => (
    <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h2>
        {loading ? <div className="text-center py-8">Loading wishlist...</div> :
            error ? <div className="text-center py-8 text-red-500">{error}</div> :
                wishlist.length === 0 ? <div className="text-center py-8">Your wishlist is empty.</div> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map(product => (
                            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                                <Link to={`/products/${product._id}`}>
                                    <img src={product.images?.[0] || '/placeholder-image.jpg'} alt={product.name} className="w-full h-48 object-cover group-hover:opacity-80 transition" />
                                </Link>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                                    <p className="text-primary font-bold mt-1">₹{product.price.toFixed(2)}</p>
                                    <button
                                        onClick={() => handleRemove(product._id)}
                                        className="mt-3 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
    </div>
);

export default Profile;