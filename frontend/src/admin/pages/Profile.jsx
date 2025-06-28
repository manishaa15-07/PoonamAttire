import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/adminApi';
import jwtDecode from 'jwt-decode';

const Profile = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await adminAPI.getProfile();
                setAdmin(res.data);
            } catch (err) {
                // fallback to JWT decode
                const token = localStorage.getItem('adminToken');
                if (token) {
                    try {
                        const decoded = jwtDecode(token);
                        setAdmin({
                            name: decoded.name || decoded.firstName || 'Admin',
                            email: decoded.email || '',
                            role: decoded.role || 'admin',
                            id: decoded.userId || decoded.id || '',

                        });
                    } catch {
                        setAdmin(null);
                        setError('Failed to load admin profile');
                    }
                } else {
                    setAdmin(null);
                    setError('Not logged in');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    if (loading) return <div>Loading...</div>;
    if (!admin) return <div className="text-red-500">{error || 'Admin info not found.'}</div>;

    return (
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold mb-6 text-black">Admin Profile</h1>
            <div className="mb-4 space-y-2">
                {admin.name && <div><span className="font-semibold">Name:</span> {admin.name}</div>}
                {admin.firstName && <div><span className="font-semibold">First Name:</span> {admin.firstName}</div>}
                {admin.lastName && <div><span className="font-semibold">Last Name:</span> {admin.lastName}</div>}
                {admin.email && <div><span className="font-semibold">Email:</span> {admin.email}</div>}
                {admin.role && <div><span className="font-semibold">Role:</span> {admin.role}</div>}
                {admin.id && <div><span className="font-semibold">ID:</span> {admin.id}</div>}
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-[#DA6220] text-white rounded hover:bg-[#b94e13] transition">Logout</button>
        </div>
    );
};

export default Profile; 