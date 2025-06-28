import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        originalPrice: '',
        category: '',
        brand: '',
        images: [''],
        sizes: [''],
        colors: [''],
        stockQuantity: '',
        inStock: true,
        isFeatured: false,
        discount: '',
        material: '',
        careInstructions: [''],
        tags: ['']
    });

    const categories = ['Sarees', 'Kurtis', 'Dresses', 'Lehengas', 'Suits', 'Accessories', 'Other'];
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                originalPrice: product.originalPrice || '',
                category: product.category || '',
                brand: product.brand || '',
                images: product.images?.length ? product.images : [''],
                sizes: product.sizes?.length ? product.sizes : [''],
                colors: product.colors?.length ? product.colors : [''],
                stockQuantity: product.stockQuantity || '',
                inStock: product.inStock !== undefined ? product.inStock : true,
                isFeatured: product.isFeatured || false,
                discount: product.discount || '',
                material: product.material || '',
                careInstructions: product.careInstructions?.length ? product.careInstructions : [''],
                tags: product.tags?.length ? product.tags : ['']
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleArrayChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Clean up empty array items
        const cleanedData = {
            ...formData,
            images: formData.images.filter(img => img.trim()),
            sizes: formData.sizes.filter(size => size.trim()),
            colors: formData.colors.filter(color => color.trim()),
            careInstructions: formData.careInstructions.filter(instruction => instruction.trim()),
            tags: formData.tags.filter(tag => tag.trim()),
            price: parseFloat(formData.price),
            originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
            stockQuantity: parseInt(formData.stockQuantity),
            discount: formData.discount ? parseFloat(formData.discount) : 0
        };

        onSubmit(cleanedData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price *</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Original Price</label>
                            <input
                                type="number"
                                name="originalPrice"
                                value={formData.originalPrice}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Inventory & Status */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                            <input
                                type="number"
                                name="stockQuantity"
                                value={formData.stockQuantity}
                                onChange={handleChange}
                                required
                                min="0"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Material</label>
                        <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="inStock"
                                    checked={formData.inStock}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-gray-700">In Stock</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
                {formData.images.map((image, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="url"
                            value={image}
                            onChange={(e) => handleArrayChange(index, 'images', e.target.value)}
                            placeholder="Image URL"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formData.images.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem('images', index)}
                                className="px-2 py-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('images')}
                    className="text-sm text-primary hover:text-[#b94e13]"
                >
                    + Add Image
                </button>
            </div>

            {/* Sizes */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                {formData.sizes.map((size, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <select
                            value={size}
                            onChange={(e) => handleArrayChange(index, 'sizes', e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">Select Size</option>
                            {sizeOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        {formData.sizes.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem('sizes', index)}
                                className="px-2 py-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('sizes')}
                    className="text-sm text-primary hover:text-[#b94e13]"
                >
                    + Add Size
                </button>
            </div>

            {/* Colors */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Colors</label>
                {formData.colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text"
                            value={color}
                            onChange={(e) => handleArrayChange(index, 'colors', e.target.value)}
                            placeholder="Color name"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formData.colors.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem('colors', index)}
                                className="px-2 py-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('colors')}
                    className="text-sm text-primary hover:text-[#b94e13]"
                >
                    + Add Color
                </button>
            </div>

            {/* Care Instructions */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Care Instructions</label>
                {formData.careInstructions.map((instruction, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text"
                            value={instruction}
                            onChange={(e) => handleArrayChange(index, 'careInstructions', e.target.value)}
                            placeholder="Care instruction"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formData.careInstructions.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem('careInstructions', index)}
                                className="px-2 py-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('careInstructions')}
                    className="text-sm text-primary hover:text-[#b94e13]"
                >
                    + Add Care Instruction
                </button>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text"
                            value={tag}
                            onChange={(e) => handleArrayChange(index, 'tags', e.target.value)}
                            placeholder="Tag"
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formData.tags.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeArrayItem('tags', index)}
                                className="px-2 py-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('tags')}
                    className="text-sm text-primary hover:text-[#b94e13]"
                >
                    + Add Tag
                </button>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-[#b94e13] focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    {product ? 'Update Product' : 'Create Product'}
                </button>
            </div>
        </form>
    );
};

export default ProductForm; 