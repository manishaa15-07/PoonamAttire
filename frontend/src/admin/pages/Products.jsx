import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/adminApi';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await adminAPI.getProducts();
            setProducts(res.data.products || res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add Product
    const handleAdd = () => setModal({ open: true, type: 'add' });
    const handleAddSubmit = async (data) => {
        setActionLoading(true);
        setActionError(null);
        try {
            await adminAPI.createProduct(data);
            setModal({ open: false });
            fetchProducts();
        } catch (err) {
            setActionError(err.response?.data?.error || 'Error adding product');
        } finally {
            setActionLoading(false);
        }
    };

    // Edit Product
    const handleEdit = (product) => setModal({ open: true, type: 'edit', product });
    const handleEditSubmit = async (data) => {
        setActionLoading(true);
        setActionError(null);
        try {
            await adminAPI.updateProduct(modal.product._id, data);
            setModal({ open: false });
            fetchProducts();
        } catch (err) {
            setActionError(err.response?.data?.error || 'Error editing product');
        } finally {
            setActionLoading(false);
        }
    };

    // View Product
    const handleView = (product) => setModal({ open: true, type: 'view', product });

    // Delete Product
    const handleDelete = (product) => setModal({ open: true, type: 'delete', product });
    const handleDeleteConfirm = async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            await adminAPI.deleteProduct(modal.product._id);
            setModal({ open: false });
            fetchProducts();
        } catch (err) {
            setActionError(err.response?.data?.error || 'Error deleting product');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-black">Products</h1>
                <button onClick={handleAdd} className="px-4 py-2 bg-[#DA6220] text-white rounded hover:bg-[#b94e13] transition">Add Product</button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id} className="border-b">
                                    <td className="px-6 py-4">{product.name}</td>
                                    <td className="px-6 py-4">₹{product.price}</td>
                                    <td className="px-6 py-4">{typeof product.stock === 'object' ? Object.values(product.stock).reduce((a, b) => a + b, 0) : product.stock}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button onClick={() => handleView(product)} className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition">View</button>
                                        <button onClick={() => handleEdit(product)} className="px-3 py-1 bg-[#DA6220] text-white rounded hover:bg-[#b94e13] transition">Edit</button>
                                        <button onClick={() => handleDelete(product)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 transition">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                open={modal.open && (modal.type === 'add' || modal.type === 'edit')}
                onClose={() => setModal({ open: false })}
                title={modal.type === 'add' ? 'Add Product' : 'Edit Product'}
                actions={actionError && <div className="text-red-500 w-full text-right">{actionError}</div>}
            >
                <ProductForm
                    initialValues={modal.type === 'edit' ? modal.product : {}}
                    onSubmit={modal.type === 'add' ? handleAddSubmit : handleEditSubmit}
                    loading={actionLoading}
                    onCancel={() => setModal({ open: false })}
                />
            </Modal>

            {/* View Modal */}
            <Modal
                open={modal.open && modal.type === 'view'}
                onClose={() => setModal({ open: false })}
                title="Product Details"
            >
                {modal.product && (
                    <div className="space-y-2">
                        <div><b>Name:</b> {modal.product.name}</div>
                        <div><b>Description:</b> {modal.product.description}</div>
                        <div><b>Price:</b> ₹{modal.product.price}</div>
                        <div><b>Category:</b> {modal.product.category}</div>
                        <div><b>Sizes:</b> {modal.product.sizes && modal.product.sizes.join(', ')}</div>
                        <div><b>Stock:</b> {modal.product.stock && Object.entries(modal.product.stock).map(([size, qty]) => `${size}: ${qty}`).join(', ')}</div>
                        <div><b>Images:</b> {modal.product.images && modal.product.images.map((img, i) => <img key={i} src={img} alt="" className="inline-block w-16 h-16 object-cover mr-2" />)}</div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                open={modal.open && modal.type === 'delete'}
                onClose={() => setModal({ open: false })}
                title="Delete Product"
                actions={
                    <>
                        <button onClick={() => setModal({ open: false })} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button onClick={handleDeleteConfirm} className="px-4 py-2 bg-red-500 text-white rounded" disabled={actionLoading}>{actionLoading ? 'Deleting...' : 'Delete'}</button>
                    </>
                }
            >
                <div>Are you sure you want to delete <b>{modal.product?.name}</b>?</div>
                {actionError && <div className="text-red-500 mt-2">{actionError}</div>}
            </Modal>
        </div>
    );
};

export default Products; 