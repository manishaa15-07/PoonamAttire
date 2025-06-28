import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { admin, updateProfile, logout } = useAdminAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: admin?.firstName || '',
        lastName: admin?.lastName || '',
        email: admin?.email || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
    };

    if (!admin) {
        return (
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-black">Admin Profile</h1>
                <p className="text-gray-600">Loading admin details...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Admin Profile</h1>
                <div className="flex space-x-3">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Edit Profile
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-[#b94e13] transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold text-gray-700">First Name:</span>
                            <p className="text-gray-900">{admin.firstName}</p>
                        </div>
                        <div>
                            <span className="font-semibold text-gray-700">Last Name:</span>
                            <p className="text-gray-900">{admin.lastName}</p>
                        </div>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Email:</span>
                        <p className="text-gray-900">{admin.email}</p>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Role:</span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 ml-2">
                            {admin.role}
                        </span>
                    </div>
                    {admin.createdAt && (
                        <div>
                            <span className="font-semibold text-gray-700">Member Since:</span>
                            <p className="text-gray-900">{new Date(admin.createdAt).toLocaleDateString()}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile; 