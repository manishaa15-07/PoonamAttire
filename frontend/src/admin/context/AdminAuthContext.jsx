import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import adminAPI from '../services/adminApi';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used within an AdminAuthProvider');
    }
    return context;
};

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            loadAdmin();
        } else {
            setLoading(false);
        }
    }, []);

    const loadAdmin = async () => {
        try {
            console.log('🔄 Loading admin profile...');
            const response = await adminAPI.getProfile();
            console.log('✅ Admin profile loaded:', response.data);
            setAdmin(response.data);
            setError(null);
        } catch (err) {
            console.error('❌ Error loading admin:', err);
            console.error('❌ Error response:', err.response);
            console.error('❌ Error data:', err.response?.data);
            console.error('❌ Error status:', err.response?.status);

            // Check if token is expired
            if (err.response?.status === 401) {
                console.log('🔐 Token expired or invalid, clearing admin data');
                localStorage.removeItem('adminToken');
                setAdmin(null);
                setError('Session expired. Please log in again.');
                return;
            }

            // Fallback to JWT decode
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    console.log('🔄 Falling back to JWT decode...');
                    const decoded = jwtDecode(token);
                    console.log('🔓 Decoded token:', decoded);

                    // Check if token is expired
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp && decoded.exp < currentTime) {
                        console.log('❌ JWT token expired');
                        localStorage.removeItem('adminToken');
                        setAdmin(null);
                        setError('Session expired. Please log in again.');
                        return;
                    }

                    setAdmin({
                        name: decoded.name || decoded.firstName || 'Admin',
                        email: decoded.email || '',
                        role: decoded.role || 'admin',
                        id: decoded.userId || decoded.id || ''
                    });
                } catch {
                    console.error('❌ JWT decode failed');
                    setAdmin(null);
                    setError('Failed to load admin profile');
                    localStorage.removeItem('adminToken');
                }
            } else {
                console.log('❌ No admin token found');
                setAdmin(null);
                setError('Not logged in');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            console.log('🔐 Admin login attempt for:', email);
            const response = await adminAPI.login({ email, password });
            const { token, user: adminData } = response.data;

            console.log('✅ Admin login successful, token received:', token ? 'YES' : 'NO');
            console.log('👤 Admin data:', adminData);

            localStorage.setItem('adminToken', token);
            console.log('💾 Admin token stored in localStorage');

            setAdmin(adminData);
            setError(null);
            return adminData;
        } catch (err) {
            console.error('❌ Admin login error:', err);
            setError(err.response?.data?.error || 'Login failed');
            throw err;
        }
    };

    const register = async (adminData) => {
        try {
            console.log('🔐 Admin registration attempt for:', adminData.email);

            // Map the data to match backend expectations
            const registrationData = {
                firstname: adminData.firstName,
                lastname: adminData.lastName,
                email: adminData.email,
                password: adminData.password
            };

            console.log('📤 Sending registration data:', { ...registrationData, password: '[HIDDEN]' });

            const response = await adminAPI.register(registrationData);
            const { token, user: newAdmin } = response.data;

            console.log('✅ Admin registration successful, token received:', token ? 'YES' : 'NO');
            console.log('👤 New admin data:', newAdmin);

            localStorage.setItem('adminToken', token);
            console.log('💾 Admin token stored in localStorage');

            setAdmin(newAdmin);
            setError(null);
            return newAdmin;
        } catch (err) {
            console.error('❌ Admin registration error:', err);
            console.error('❌ Error response:', err.response);
            console.error('❌ Error data:', err.response?.data);
            console.error('❌ Error status:', err.response?.status);
            setError(err.response?.data?.error || 'Registration failed');
            throw err;
        }
    };

    const clearExpiredToken = () => {
        console.log('🧹 Clearing expired admin token');
        localStorage.removeItem('adminToken');
        setAdmin(null);
        setError('Session expired. Please log in again.');
    };

    const logout = () => {
        console.log('🚪 Admin logout');
        localStorage.removeItem('adminToken');
        setAdmin(null);
        setError(null);
    };

    const updateProfile = async (data) => {
        try {
            const response = await adminAPI.updateProfile(data);
            setAdmin(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            console.error('Admin profile update error:', err);
            setError(err.response?.data?.error || 'Profile update failed');
            throw err;
        }
    };

    const value = {
        admin,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        clearExpiredToken
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
}; 