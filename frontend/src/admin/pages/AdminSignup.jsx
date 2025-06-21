import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminAPI } from '../services/adminApi';

const AdminSignup = () => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
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
            const res = await adminAPI.signup({ firstname, lastname, email, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.error || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-[#DA6220]">Admin Signup</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">First Name</label>
                    <input type="text" value={firstname} onChange={e => setFirstname(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Last Name</label>
                    <input type="text" value={lastname} onChange={e => setLastname(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border px-3 py-2 rounded" />
                </div>
                <button type="submit" className="w-full bg-[#DA6220] text-white py-2 rounded font-semibold hover:bg-[#b94e13] transition" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>
                <div className="mt-4 text-center">
                    <span>Already have an account? </span>
                    <Link to="/admin/login" className="text-[#DA6220] font-semibold hover:underline">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default AdminSignup; 