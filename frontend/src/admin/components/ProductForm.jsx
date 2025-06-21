import React, { useState } from 'react';

const ProductForm = ({ initialValues = {}, onSubmit, loading, onCancel }) => {
    const [form, setForm] = useState({
        name: initialValues.name || '',
        description: initialValues.description || '',
        price: initialValues.price || '',
        category: initialValues.category || '',
        sizes: initialValues.sizes ? initialValues.sizes.join(',') : '',
        stock: initialValues.stock ? Object.values(initialValues.stock).join(',') : '',
        images: initialValues.images ? initialValues.images.join(',') : '',
    });
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = e => {
        e.preventDefault();
        // Convert sizes, stock, images to arrays/objects
        const sizesArr = form.sizes.split(',').map(s => s.trim());
        const stockArr = form.stock.split(',').map(s => Number(s.trim()));
        const stockObj = {};
        sizesArr.forEach((size, i) => { stockObj[size] = stockArr[i] || 0; });
        const imagesArr = form.images.split(',').map(s => s.trim());
        onSubmit({
            name: form.name,
            description: form.description,
            price: Number(form.price),
            category: form.category,
            sizes: sizesArr,
            stock: stockObj,
            images: imagesArr
        });
    };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block font-medium mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Price</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Category</label>
                <input name="category" value={form.category} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Sizes (comma separated)</label>
                <input name="sizes" value={form.sizes} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Stock (comma separated, matches sizes)</label>
                <input name="stock" value={form.stock} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div>
                <label className="block font-medium mb-1">Images (comma separated URLs)</label>
                <input name="images" value={form.images} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
            </div>
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#DA6220] text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
            </div>
        </form>
    );
};

export default ProductForm; 