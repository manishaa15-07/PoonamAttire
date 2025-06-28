import React, { useState, useEffect, Fragment } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Wishlist icons
import { HiSelector } from 'react-icons/hi';
import { Listbox, Transition } from '@headlessui/react';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const categories = [
    { name: 'All Categories', value: '' },
    { name: 'Sarees', value: 'Sarees' },
    { name: 'Lehengas', value: 'Lehengas' },
    { name: 'Gowns', value: 'Gowns' },
    { name: 'Suits', value: 'Suits' },
    { name: 'Kurtis', value: 'Kurtis' },
];

const sortOptions = [
    { name: 'Newest', value: 'newest' },
    { name: 'Price: Low to High', value: 'price_asc' },
    { name: 'Price: High to Low', value: 'price_desc' },
];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalCount, setTotalCount] = useState(0);

    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'newest'
    });

    const { user } = useAuth();
    const [wishlistLoading, setWishlistLoading] = useState({});

    const { addToCart } = useCart();

    const [searchParams] = useSearchParams();
    const initialCategory = categories.find(c => c.value.toLowerCase() === (searchParams.get('category') || '').toLowerCase()) || categories[0];
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { category, search, sort } = filters;

            const params = new URLSearchParams();
            if (category) params.append('category', category);
            if (search) params.append('search', search);
            if (sort === 'price_asc') params.append('sort', 'price-asc');
            else if (sort === 'price_desc') params.append('sort', 'price-desc');
            else if (sort === 'newest') params.append('sort', 'newest');

            const response = await axios.get(`${API_URL}/products?${params.toString()}`);

            const { products: fetchedProducts = [], total = 0 } = response.data;

            setProducts(fetchedProducts);
            setTotalCount(total);
            setError(null);
        } catch (err) {
            console.error('Error loading products:', err);
            setError(err.response?.data?.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            const categoryObject = categories.find(c => c.value.toLowerCase() === categoryFromUrl.toLowerCase());
            if (categoryObject) {
                setSelectedCategory(categoryObject);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            category: selectedCategory.value,
            sort: selectedSort.value,
        }));
    }, [selectedCategory, selectedSort]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1, 'M'); // Default quantity 1 and size M
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };

    const isInWishlist = (productId) => {
        if (!user || !user.wishlist) return false;
        return user.wishlist.some(id => id === productId || (id && id._id === productId));
    };

    const handleWishlist = async (productId) => {
        if (!user) {
            alert('Please log in to use wishlist');
            return;
        }
        setWishlistLoading(prev => ({ ...prev, [productId]: true }));
        try {
            if (isInWishlist(productId)) {
                await wishlistAPI.removeFromWishlist(productId);
                // Remove from user.wishlist in-place (simulate update)
                user.wishlist = user.wishlist.filter(id => (id._id || id) !== productId);
            } else {
                await wishlistAPI.addToWishlist(productId);
                user.wishlist = [...user.wishlist, productId];
            }
        } catch (err) {
            alert('Failed to update wishlist');
        } finally {
            setWishlistLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Filters */}
            <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-wrap items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-1/3">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border rounded-full focus:ring-primary focus:border-primary"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-4">
                    {/* Category Dropdown */}
                    <Listbox value={selectedCategory} onChange={setSelectedCategory}>
                        <div className="relative w-48">
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-full border cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                <span className="block truncate">{selectedCategory.name}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <HiSelector className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                    {categories.map((category, categoryIdx) => (
                                        <Listbox.Option key={categoryIdx} className={({ active }) => `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-4 pr-4`} value={category}>
                                            {({ selected, active }) => (
                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                    {category.name}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>

                    {/* Sort Dropdown */}
                    <Listbox value={selectedSort} onChange={setSelectedSort}>
                        <div className="relative w-48">
                            <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-full border cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm">
                                <span className="block truncate">{selectedSort.name}</span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <HiSelector className="w-5 h-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </Listbox.Button>
                            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
                                    {sortOptions.map((sort, sortIdx) => (
                                        <Listbox.Option key={sortIdx} className={({ active }) => `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'} cursor-default select-none relative py-2 pl-4 pr-4`} value={sort}>
                                            {({ selected, active }) => (
                                                <span className={`${selected ? 'font-medium' : 'font-normal'} block truncate`}>
                                                    {sort.name}
                                                </span>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-500 mb-4">
                Showing {products.length} of {totalCount} products
            </div>

            {/* Error */}
            {error && (
                <div className="text-center text-red-500 mb-6">
                    <p>{error}</p>
                    <button
                        className="btn-primary mt-2"
                        onClick={fetchProducts}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, idx) => (
                        <div key={idx} className="animate-pulse bg-gray-200 h-80 rounded-md"></div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    <p>No products found</p>
                    <button
                        onClick={() => setFilters({ category: '', search: '', sort: 'newest' })}
                        className="btn-primary mt-4"
                    >
                        Reset Filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product._id} className="relative bg-white shadow-md rounded-lg overflow-hidden group">
                            {/* Discount Badge */}
                            <div className="absolute top-0 left-0 bg-primary text-white text-xs font-bold px-2 py-1 rounded-br-lg">
                                10% OFF
                            </div>

                            <Link to={`/products/${product._id}`}>
                                <img
                                    src={product.images?.[0] || '/placeholder-image.jpg'}
                                    alt={product.name}
                                    className="w-full h-[350px] object-cover"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </Link>
                            <div className="p-4">
                                <Link to={`/products/${product._id}`}>
                                    <h3 className="text-lg font-semibold mb-1 hover:text-primary">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between">
                                    <div className="mb-2">
                                        <span className="text-primary font-bold">
                                            ₹{Math.round(product.price * 0.9)}
                                        </span>
                                        <span className="text-sm text-gray-500 line-through ml-2">
                                            ₹{product.price}
                                        </span>
                                    </div>
                                    {/* Wishlist Heart Icon */}
                                    <button
                                        onClick={() => handleWishlist(product._id)}
                                        className="text-xl z-10"
                                        disabled={wishlistLoading[product._id]}
                                        aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                                    >
                                        {isInWishlist(product._id) ? (
                                            <FaHeart className="text-primary" />
                                        ) : (
                                            <FaRegHeart className="text-gray-400 group-hover:text-primary" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

export default Products;
