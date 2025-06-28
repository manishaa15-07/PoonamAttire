import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const generateCartItemId = (productId, size) => `${productId}_${size}`;

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCart({ items: [] });
            setLoading(false);
        } else {
            try {
                setLoading(true);
                const response = await cartAPI.get();
                console.log('Cart API response:', response.data);

                if (response.data && Array.isArray(response.data.items)) {
                    console.log('Cart items structure:', response.data.items.map(item => ({
                        _id: item._id,
                        product: item.product,
                        productId: item.product?._id || item.product,
                        size: item.size,
                        quantity: item.quantity
                    })));
                    setCart(response.data);
                } else {
                    console.log('No items array in cart response, setting empty cart');
                    setCart({ items: [] });
                }
                setError(null);
            } catch (err) {
                console.error('Error loading cart:', err);
                setError(err.response?.data?.message || 'Error loading cart');
                setCart({ items: [] });
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity, size) => {
        try {
            const cartItemId = generateCartItemId(productId, size);
            const response = await cartAPI.add({ productId, quantity, size, cartItemId });
            setCart(response.data);
        } catch (err) {
            console.error('Error adding to cart:', err);
            throw err;
        }
    };

    const updateQuantity = async (id, quantity) => {
        try {
            const response = await cartAPI.updateQuantity(id, { quantity });
            setCart(response.data);
        } catch (err) {
            console.error('Error updating quantity:', err);
        }
    };

    const removeFromCart = async (id) => {
        try {
            const response = await cartAPI.remove(id);
            console.log('Remove from cart response:', response.data);
            setCart(response.data);
        } catch (err) {
            console.error('Error removing item:', err);
        }
    };

    const clearCart = async () => {
        try {
            await cartAPI.clear();
            setCart({ items: [] });
            setError(null);
        } catch (err) {
            console.error('Error clearing cart:', err);
            setError(err.response?.data?.message || 'Error clearing cart');
            throw err;
        }
    };

    const getCartTotal = () => {
        if (!cart || !cart.items || !Array.isArray(cart.items)) return 0;
        return cart.items.reduce((total, item) => {
            const price = item.product?.price || 0;
            return total + (price * item.quantity);
        }, 0);
    };

    const getCartCount = () => {
        if (!cart || !cart.items || !Array.isArray(cart.items)) return 0;
        return cart.items.reduce((count, item) => {
            if (typeof item.quantity === 'number') {
                return count + item.quantity;
            }
            return count;
        }, 0);
    };

    const value = {
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}; 