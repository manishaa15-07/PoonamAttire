import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const adminAPI = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add admin token to requests if it exists
adminAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Admin token attached:', token.substring(0, 20) + '...');
        console.log('🔐 Admin request URL:', config.url);
        console.log('🔐 Admin request method:', config.method);
    } else {
        console.warn('⚠️ No admin token found in localStorage');
    }
    return config;
});

// Admin Auth API calls
export const adminAuthAPI = {
    login: (credentials) => adminAPI.post('/login', credentials),
    register: (adminData) => adminAPI.post('/signup', adminData),
    getProfile: () => adminAPI.get('/profile'),
    updateProfile: (data) => adminAPI.patch('/profile', data),
    changePassword: (data) => adminAPI.post('/change-password', data)
};

// Admin Products API calls
export const adminProductsAPI = {
    getAll: (params) => adminAPI.get('/products', { params }),
    getById: (id) => adminAPI.get(`/products/${id}`),
    create: (data) => adminAPI.post('/products', data),
    update: (id, data) => adminAPI.patch(`/products/${id}`, data),
    delete: (id) => adminAPI.delete(`/products/${id}`),
    uploadImage: (formData) => adminAPI.post('/products/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
};

// Admin Orders API calls
export const adminOrdersAPI = {
    getAll: (params) => adminAPI.get('/orders', { params }),
    getById: (id) => adminAPI.get(`/orders/${id}`),
    updateStatus: (id, data) => adminAPI.patch(`/orders/${id}/status`, data),
    updatePaymentStatus: (id, data) => adminAPI.patch(`/orders/${id}/payment-status`, data),
    getStats: () => adminAPI.get('/orders/stats')
};

// Admin Users API calls
export const adminUsersAPI = {
    getAll: (params) => adminAPI.get('/users', { params }),
    getById: (id) => adminAPI.get(`/users/${id}`),
    update: (id, data) => adminAPI.patch(`/users/${id}`, data),
    delete: (id) => adminAPI.delete(`/users/${id}`),
    toggleStatus: (id) => adminAPI.patch(`/users/${id}/toggle-status`)
};

// Admin Dashboard API calls
export const adminDashboardAPI = {
    getStats: () => adminAPI.get('/dashboard/stats'),
    getRecentOrders: () => adminAPI.get('/dashboard/recent-orders'),
    getTopProducts: () => adminAPI.get('/dashboard/top-products'),
    getSalesChart: (period) => adminAPI.get(`/dashboard/sales-chart?period=${period}`)
};

// Individual methods for backward compatibility
adminAPI.login = adminAuthAPI.login;
adminAPI.register = adminAuthAPI.register;
adminAPI.getProfile = adminAuthAPI.getProfile;
adminAPI.updateProfile = adminAuthAPI.updateProfile;

// Default export for backward compatibility
export default adminAPI; 