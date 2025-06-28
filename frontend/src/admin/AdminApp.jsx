import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';

const AdminLayout = () => {
    const { admin, loading } = useAdminAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!admin) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-50">
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

const AdminApp = () => {
    return (
        <AdminAuthProvider>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/signup" element={<AdminSignup />} />
                <Route path="/*" element={<AdminLayout />} />
            </Routes>
        </AdminAuthProvider>
    );
};

export default AdminApp; 