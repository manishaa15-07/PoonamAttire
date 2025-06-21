import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productsAPI } from '../services/api';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const [inWishlist, setInWishlist] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await productsAPI.getById(id);

                // Transform data to ensure proper format
                const transformedProduct = {
                    ...response.data,
                    sizes: response.data.sizes?.map(size =>
                        typeof size === 'object' ? size.value || size.size : String(size)
                    ),
                    details: response.data.details?.map(detail =>
                        typeof detail === 'object' ? detail.text || detail.description : String(detail)
                    )
                };

                setProduct(transformedProduct);

                if (transformedProduct.sizes && transformedProduct.sizes.length > 0) {
                    setSelectedSize(transformedProduct.sizes[0]);
                }
            } catch (err) {
                console.error('Error fetching product:', err);
                setError(err.response?.data?.error || 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (user && user.wishlist && product) {
            setInWishlist(user.wishlist.some(id => id === product._id || (id && id._id === product._id)));
        }
    }, [user, product]);

    const handleAddToCart = async () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        try {
            await addToCart(product._id, quantity, selectedSize);
            toast.success('Added to cart!');
            navigate('/cart');
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error(err.response?.data?.error || 'Failed to add to cart');
        }
    };

    const handleWishlist = async () => {
        if (!user) {
            toast.error('Please log in to use wishlist');
            return;
        }
        setWishlistLoading(true);
        try {
            if (inWishlist) {
                await wishlistAPI.removeFromWishlist(product._id);
                toast.success('Removed from wishlist');
                setInWishlist(false);
            } else {
                await wishlistAPI.addToWishlist(product._id);
                toast.success('Added to wishlist!');
                setInWishlist(true);
            }
        } catch (err) {
            toast.error('Failed to update wishlist');
        } finally {
            setWishlistLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn-primary"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Product not found</h2>
                    <button
                        onClick={() => navigate('/products')}
                        className="btn-primary"
                    >
                        Back to Products
                    </button>
                </div>
            </div>
        );
    }

    const renderContent = (content) => {
        if (Array.isArray(content)) {
            return content.join(', ');
        }
        if (typeof content === 'object' && content !== null) {
            return JSON.stringify(content);
        }
        return content;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-[700px] object-cover"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">No image available</span>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                        <h1 className="text-3xl font-bold mr-4">{renderContent(product.name)}</h1>
                        <button
                            onClick={handleWishlist}
                            disabled={wishlistLoading}
                            className="focus:outline-none"
                            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            {inWishlist ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#DA6220" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DA6220" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.435 6.582a5.373 5.373 0 00-7.6 0l-.835.836-.835-.836a5.373 5.373 0 00-7.6 7.6l.836.835 7.599 7.6 7.6-7.6.835-.835a5.373 5.373 0 000-7.6z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DA6220" className="w-7 h-7">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.435 6.582a5.373 5.373 0 00-7.6 0l-.835.836-.835-.836a5.373 5.373 0 00-7.6 7.6l.836.835 7.599 7.6 7.6-7.6.835-.835a5.373 5.373 0 000-7.6z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <p className="text-2xl font-semibold text-primary mb-4">
                        ₹{renderContent(product.price)}
                    </p>
                    <p className="text-gray-600 mb-6">{renderContent(product.description)}</p>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">Select Size</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 border rounded-md ${selectedSize === size
                                            ? 'border-primary bg-primary text-white'
                                            : 'border-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        {renderContent(size)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-2">Quantity</h3>
                        <div className="flex items-center">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                min="1"
                                max={product.stock}
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                className="w-16 text-center border-t border-b border-gray-300 py-1"
                            />
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                            >
                                +
                            </button>
                        </div>
                        {/* <p className="text-sm text-gray-500 mt-1">
                            {renderContent(product.stock)} items available
                        </p> */}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="btn-primary w-full"
                    >
                        Add to Cart
                    </button>

                    {/* Product Details */}
                    {product.details && product.details.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                            <ul className="list-disc list-inside space-y-2">
                                {product.details.map((detail, index) => (
                                    <li key={index} className="text-gray-600">
                                        {renderContent(detail)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;