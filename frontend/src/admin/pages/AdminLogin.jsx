import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/adminApi';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await adminAPI.login({ email, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-[#DA6220]">Admin Login</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                </div>
                <button type="submit" className="w-full bg-[#DA6220] text-white py-2 rounded font-semibold hover:bg-[#b94e13] transition" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default AdminLogin; 