import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, loading, error, updateQuantity, removeFromCart, getCartTotal } = useCart();

    const handleQuantityChange = (cartItemId, newQuantity) => {
        if (newQuantity > 0) {
            updateQuantity(cartItemId, newQuantity);
        }
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
                            {cart.items.map((item) => item.product ? (
                                <div key={item._id} className="flex items-center p-4 border-b border-gray-200">
                                    <img
                                        src={item.product.images[0]}
                                        alt={item.product.name}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div className="ml-4 flex-grow">
                                        <Link to={`/products/${item.product._id}`} className="font-semibold text-lg text-gray-800 hover:text-primary">{item.product.name}</Link>
                                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                                        <p className="text-md font-bold text-primary">₹{item.product.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                                            <FiMinus size={16} />
                                        </button>
                                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)} className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
                                            <FiPlus size={16} />
                                        </button>
                                    </div>
                                    <div className="ml-6 text-right">
                                        <p className="font-semibold text-lg text-gray-800">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item._id)} className="mt-1 text-red-500 hover:text-red-700">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : null)}
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