import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src="/LogoPoonam.png" alt="Poonam Ladies Wear" className="h-12 w-[150px]" />
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        {/* <Link to="/" className="text-gray-600 hover:text-primary">
                            Home
                        </Link> */}
                        <Link to="/products" className="font-semibold text-gray-800 hover:text-primary">
                            Explore
                        </Link>
                        {/* <Link to="/about" className="text-gray-600 hover:text-primary">
                            About
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-primary">
                            Contact
                        </Link> */}
                    </div>

                    {/* Auth & Cart */}
                    <div className="flex items-center space-x-4">
                        <Link to="/cart" className="relative">
                            <ShoppingCartIcon className="h-6 w-6 text-gray-600 hover:text-primary" />
                            {getCartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-2 text-gray-600 hover:text-primary focus:outline-none"
                                >
                                    <UserCircleIcon className="h-6 w-6" />
                                    <span className="hidden md:inline">{user.firstName}</span>
                                </button>
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsProfileOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 