import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await authAPI.getProfile();
            setUser(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading user:', err);
            setError(err.response?.data?.message || 'Error loading user');
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return user;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);
            setError(null);
            return user;
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const updateProfile = async (data) => {
        try {
            const response = await authAPI.updateProfile(data);
            setUser(response.data);
            setError(null);
            return response.data;
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.response?.data?.message || 'Profile update failed');
            throw err;
        }
    };

    const changePassword = async (data) => {
        try {
            await authAPI.changePassword(data);
            setError(null);
        } catch (err) {
            console.error('Password change error:', err);
            setError(err.response?.data?.message || 'Password change failed');
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 