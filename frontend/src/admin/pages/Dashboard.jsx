import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/adminApi';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
    const [stats, setStats] = useState({ orders: 0, sales: 0, users: 0, products: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const [ordersRes, usersRes, productsRes] = await Promise.all([
                    adminAPI.getOrders(),
                    adminAPI.getUsers(),
                    adminAPI.getProducts()
                ]);
                const orders = ordersRes.data;
                const users = usersRes.data;
                const products = productsRes.data.products || productsRes.data;
                const sales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
                setStats({
                    orders: orders.length,
                    sales,
                    users: users.length,
                    products: products.length
                });
            } catch (err) {
                setError('Error loading dashboard stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-black">Dashboard Overview</h1>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-2xl font-bold text-[#DA6220]">{stats.orders}</div>
                        <div className="text-gray-600 mt-1">Orders</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-4xl mb-2">💰</div>
                        <div className="text-2xl font-bold text-[#DA6220]">₹{stats.sales}</div>
                        <div className="text-gray-600 mt-1">Sales</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-4xl mb-2">👤</div>
                        <div className="text-2xl font-bold text-[#DA6220]">{stats.users}</div>
                        <div className="text-gray-600 mt-1">Users</div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                        <div className="text-4xl mb-2">🛍️</div>
                        <div className="text-2xl font-bold text-[#DA6220]">{stats.products}</div>
                        <div className="text-gray-600 mt-1">Products</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard; 