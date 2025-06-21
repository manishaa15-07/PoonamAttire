import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });


api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 Token attached:', token); // ✅ log it
    } else {
        console.warn('⚠️ No token found in localStorage');
    }
    return config;
});


// Auth API calls
export const authAPI = {
    login: (credentials) => api.post('/users/login', credentials),
    register: (userData) => api.post('/users/register', userData),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.patch('/users/profile', data),
    changePassword: (data) => api.post('/users/change-password', data)
};

// Products API calls
export const productsAPI = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.patch(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`)
};

// Cart API calls
export const cartAPI = {
    get: () => api.get('/cart'),
    add: (item) => api.post('/cart', item),
    updateQuantity: (cartItemId, { quantity }) => api.put(`/cart/${cartItemId}`, { quantity }),
    remove: (cartItemId) => api.delete(`/cart/${cartItemId}`),
    clear: () => api.post('/cart/clear')
};

// Orders API calls
export const ordersAPI = {
    create: (data) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/'),
    getOrder: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data)
};

// Wishlist API calls
export const wishlistAPI = {
    getWishlist: () => api.get('/users/wishlist'),
    addToWishlist: (productId) => api.post(`/users/wishlist/add/${productId}`),
    removeFromWishlist: (productId) => api.delete(`/users/wishlist/remove/${productId}`),
};

export default api; 