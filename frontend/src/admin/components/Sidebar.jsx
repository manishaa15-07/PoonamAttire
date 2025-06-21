import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/profile', label: 'Profile' },
];

const Sidebar = () => (
    <aside className="w-64 bg-white shadow-lg hidden md:block">
        <div className="h-20 flex items-center justify-center border-b">
            <span className="text-2xl font-bold text-[#DA6220]">Admin</span>
        </div>
        <nav className="mt-8">
            <ul className="space-y-2">
                {navItems.map(item => (
                    <li key={item.to}>
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                `block px-6 py-3 rounded-l-full font-medium transition-colors duration-200 ${isActive ? 'bg-[#DA6220] text-white' : 'text-black hover:bg-[#DA6220]/10'
                                }`
                            }
                            end={item.to === '/admin'}
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    </aside>
);

export default Sidebar; 