import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import { AdminAuthProvider } from './context/AdminAuthContext';

function RequireAdminAuth({ children }) {
    const location = useLocation();
    const isLoggedIn = !!localStorage.getItem('adminToken');
    if (!isLoggedIn) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return children;
}

const AdminApp = () => {
    return (
        <AdminAuthProvider>
            <Routes>
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/signup" element={<AdminSignup />} />
                <Route
                    path="/*"
                    element={
                        <RequireAdminAuth>
                            <div className="flex min-h-screen bg-gray-50">
                                <Sidebar />
                                <div className="flex-1 flex flex-col">
                                    <Topbar />
                                    <main className="flex-1 p-6 bg-gray-50">
                                        <Routes>
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="products" element={<Products />} />
                                            <Route path="orders" element={<Orders />} />
                                            <Route path="users" element={<Users />} />
                                            <Route path="profile" element={<Profile />} />
                                            <Route path="*" element={<Navigate to="/admin" />} />
                                        </Routes>
                                    </main>
                                </div>
                            </div>
                        </RequireAdminAuth>
                    }
                />
            </Routes>
        </AdminAuthProvider>
    );
};

export default AdminApp;
