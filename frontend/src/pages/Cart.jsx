import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, loading, error, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handleCheckout = () => {
        if (!user) {
            navigate('/login', { state: { from: '/cart' } });
        } else {
            navigate('/checkout');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-12 text-red-500">{error}</div>;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <FiShoppingCart className="mx-auto text-6xl text-primary mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/products" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-all">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const shipping = 0; // Assuming free shipping for now
    const total = subtotal + shipping;

    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-lg shadow-lg">
                            {cart.items.map((item) => {
                                // Get the correct id - use _id from the new structure
                                const itemId = item._id;
                                // Get product info safely
                                const product = item.product || item;
                                const productName = product.name || item.name;
                                const productPrice = product.price || item.price || 0;
                                const productImage = product.images?.[0] || item.image || '/placeholder-image.jpg';
                                const productId = product._id || item.productId;

                                return (
                                    <div key={itemId} className="flex items-center p-4 border-b border-gray-200">
                                        <img
                                            src={productImage}
                                            alt={productName}
                                            className="w-24 h-24 object-cover rounded-md"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                        <div className="ml-4 flex-grow">
                                            <Link to={`/products/${productId}`} className="font-semibold text-lg text-gray-800 hover:text-primary">
                                                {productName}
                                            </Link>
                                            <p className="text-sm text-gray-500">Size: {item.size}</p>
                                            <p className="text-md font-bold text-primary">₹{productPrice.toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleQuantityChange(itemId, item.quantity - 1)}
                                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                <FiMinus size={16} />
                                            </button>
                                            <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(itemId, item.quantity + 1)}
                                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                                            >
                                                <FiPlus size={16} />
                                            </button>
                                        </div>
                                        <div className="ml-6 text-right">
                                            <p className="font-semibold text-lg text-gray-800">₹{(productPrice * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => handleRemoveItem(itemId)}
                                                className="mt-1 text-red-500 hover:text-red-700 transition-colors p-1 rounded"
                                                title="Remove item"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold text-gray-800">{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                                </div>
                            </div>
                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span className="text-gray-900">Total</span>
                                    <span className="text-primary">₹{total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-all shadow-md"
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 