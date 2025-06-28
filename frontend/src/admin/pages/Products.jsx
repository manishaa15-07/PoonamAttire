import React, { useState, useEffect } from 'react';
import { adminProductsAPI } from '../services/adminApi';
import toast from 'react-hot-toast';
import ProductForm from '../components/ProductForm';
import Modal from '../components/Modal';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const categories = ['Sarees', 'Kurtis', 'Dresses', 'Lehengas', 'Suits', 'Accessories', 'Other'];

    useEffect(() => {
        fetchProducts();
    }, [currentPage, categoryFilter]);

    const fetchProducts = async () => {
        try {
            console.log('🔄 Fetching products...');
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                search: searchTerm,
                category: categoryFilter
            };
            console.log('📤 Products API params:', params);
            const response = await adminProductsAPI.getAll(params);
            console.log('✅ Products response:', response);
            console.log('📦 Products data:', response.data);
            setProducts(response.data.products || response.data);
            setTotalPages(response.data.pages || response.data.totalPages || 1);
        } catch (error) {
            console.error('❌ Error fetching products:', error);

        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchProducts();
    };

    const handleDelete = async (productId) => {
        const product = products.find(p => p._id === productId);
        const productName = product?.name || 'this product';

        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            try {
                console.log('🗑️ Deleting product:', productId);
                await adminProductsAPI.delete(productId);
                toast.success(`Product "${productName}" deleted successfully`);
                fetchProducts();
            } catch (error) {
                console.error('❌ Error deleting product:', error);
                console.error('❌ Error response:', error.response);
                toast.error('Failed to delete product');
            }
        }
    };

    const handleEdit = (product) => {
        console.log('✏️ Editing product:', product);
        setEditingProduct(product);
        setShowModal(true);
    };

    const handleAdd = () => {
        console.log('➕ Adding new product');
        setEditingProduct(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        console.log('❌ Closing product modal');
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (productData) => {
        try {
            if (editingProduct) {
                console.log('💾 Updating product:', editingProduct._id, productData);
                await adminProductsAPI.update(editingProduct._id, productData);
                toast.success('Product updated successfully');
            } else {
                console.log('💾 Creating new product:', productData);
                await adminProductsAPI.create(productData);
                toast.success('Product created successfully');
            }
            handleModalClose();
            fetchProducts();
        } catch (error) {
            console.error('❌ Error saving product:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error data:', error.response?.data);
            toast.error(error.response?.data?.error || 'Failed to save product');
        }
    };

    const toggleProductStatus = async (productId, currentStatus) => {
        try {
            await adminProductsAPI.update(productId, { isActive: !currentStatus });
            toast.success('Product status updated');
            fetchProducts();
        } catch (error) {
            console.error('Error updating product status:', error);
            toast.error('Failed to update product status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#b94e13] transition"
                >
                    Add Product
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={handleSearch}
                            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img
                                                src={product.images?.[0] || '/placeholder-image.jpg'}
                                                alt={product.name}
                                                className="w-10 h-10 rounded object-cover"
                                                onError={(e) => {
                                                    e.target.src = '/placeholder-image.jpg';
                                                }}
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {product._id.slice(-6)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.stock ? Object.values(product.stock).reduce((sum, qty) => sum + qty, 0) : 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                                            >
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                    <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Product Form Modal */}
            <Modal isOpen={showModal} onClose={handleModalClose} title={editingProduct ? 'Edit Product' : 'Add Product'}>
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={handleModalClose}
                />
            </Modal>
        </div>
    );
};

export default Products;
