import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { admin } = useAdminAuth();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = [
        {
            path: '/admin/dashboard',
            name: 'Dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"></path>
                </svg>
            )
        },
        {
            path: '/admin/products',
            name: 'Products',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
            )
        },
        {
            path: '/admin/orders',
            name: 'Orders',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
            )
        },
        {
            path: '/admin/users',
            name: 'Users',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
            )
        },
        {
            path: '/admin/profile',
            name: 'Profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            )
        }
    ];

    return (
        <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Poonam Ladies</h1>
                        <p className="text-xs text-gray-400">Admin Panel</p>
                    </div>
                </div>
            </div>

            {/* Admin Info */}
            {admin && (
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                                {admin.firstName?.charAt(0)}{admin.lastName?.charAt(0)}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {admin.firstName} {admin.lastName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{admin.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.path)
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <div className={`transition-colors duration-200 ${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            }`}>
                            {item.icon}
                        </div>
                        <span className="font-medium">{item.name}</span>
                        {isActive(item.path) && (
                            <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                        )}
                    </Link>
                ))}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
                <div className="text-center">
                    <p className="text-xs text-gray-400">© 2024 Poonam Ladies Wear</p>
                    <p className="text-xs text-gray-500 mt-1">Admin Dashboard v1.0</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar; 