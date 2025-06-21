import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const adminApi = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Add token to requests if needed
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const adminAPI = {
    // Products
    getProducts: () => adminApi.get('/products'),
    createProduct: (data) => adminApi.post('/products', data),
    updateProduct: (id, data) => adminApi.patch(`/products/${id}`, data),
    deleteProduct: (id) => adminApi.delete(`/products/${id}`),
    // Orders
    getOrders: () => adminApi.get('/orders/ad'),
    updateOrderStatus: (id, data) => adminApi.patch(`/orders/${id}/status`, data),
    // Users
    getUsers: () => adminApi.get('/users'),
    deleteUser: (id) => adminApi.delete(`/users/${id}`),
    login: (data) => adminApi.post('/admin/login', data),
    signup: (data) => adminApi.post('/admin/signup', data),
    getProfile: () => adminApi.get('/users/profile'),
}; 