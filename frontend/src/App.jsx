import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminApp from './admin/AdminApp';
import { Toaster } from 'react-hot-toast';
import { PreloaderProvider } from './context/PreloaderContext';

function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <PreloaderProvider>
            <AuthProvider>
                <CartProvider>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            success: {
                                style: {
                                    background: '#28a745',
                                    color: 'white',
                                },
                            },
                            error: {
                                style: {
                                    background: '#dc3545',
                                    color: 'white',
                                },
                            },
                        }}
                    />
                    <div className="min-h-screen flex flex-col">
                        {!isAdminRoute && <Navbar />}
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/products" element={<Products />} />
                                <Route path="/products/:id" element={<ProductDetail />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/checkout" element={<Checkout />} />
                                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                                <Route
                                    path="/profile"
                                    element={
                                        <PrivateRoute>
                                            <Profile />
                                        </PrivateRoute>
                                    }
                                />
                                <Route path='/admin/*' element={<AdminApp />} />
                            </Routes>
                        </main>
                        {!isAdminRoute && <Footer />}
                    </div>
                </CartProvider>
            </AuthProvider>
        </PreloaderProvider>
    );
}

export default App; 