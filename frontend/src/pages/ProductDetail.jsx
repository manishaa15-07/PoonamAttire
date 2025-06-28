import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productsAPI.getById(id);
                setProduct(response.data);
                if (response.data.sizes && response.data.sizes.length > 0) {
                    setSelectedSize(response.data.sizes[0]);
                }
            } catch (err) {
                setError('Product not found');
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            navigate('/login');
            return;
        }

        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            toast.error('Please select a size');
            return;
        }

        addToCart(product._id, quantity, selectedSize);
        toast.success('Added to cart!');
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.error('Please login to purchase');
            navigate('/login');
            return;
        }

        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            toast.error('Please select a size');
            return;
        }

        addToCart(product._id, quantity, selectedSize);
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="px-6 py-2 bg-primary text-white rounded hover:bg-[#b94e13] transition"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                        {/* Product Images */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1 w-full">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-96 object-cover rounded-lg"
                                />
                            </div>
                            {product.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.slice(1).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${product.name} ${index + 2}`}
                                            className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                <p className="text-2xl font-semibold text-primary">₹{product.price}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-md transition ${selectedSize === size
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-gray-300 hover:border-primary'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quantity</h3>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Stock Status */}
                            <div>
                                <p className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!product.inStock}
                                    className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-[#b94e13] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Add to Cart
                                </button>
                                <button
                                    onClick={handleBuyNow}
                                    disabled={!product.inStock}
                                    className="flex-1 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="border-t pt-6 space-y-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <span className="font-semibold mr-2">Category:</span>
                                    <span>{product.category}</span>
                                </div>
                                {product.brand && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="font-semibold mr-2">Brand:</span>
                                        <span>{product.brand}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 