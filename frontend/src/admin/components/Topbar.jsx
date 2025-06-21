import React from 'react';
import { useNavigate } from 'react-router-dom';

const Topbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    }
    return (
        <header className="h-16 bg-white flex items-center justify-between px-6 shadow-sm border-b">
            <div className="text-xl font-bold text-[#DA6220]">Admin Dashboard</div>
            <div className="flex items-center gap-4">
                <span className="font-medium text-black">Admin User</span>
                <button className="px-4 py-2 bg-[#DA6220] text-white rounded hover:bg-[#b94e13] transition" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    );
};

export default Topbar; 