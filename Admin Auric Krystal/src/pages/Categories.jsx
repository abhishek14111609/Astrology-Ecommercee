import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Loader2,
    AlertCircle,
    X,
    Layers,
    Image as ImageIcon
} from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        image_url: ''
    });

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        let isMounted = true;

        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/admin/categories`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (isMounted) {
                    setCategories(response.data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load categories');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Auto-generate slug from name
        if (name === 'name' && !editingCategory) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(
                    `${API_BASE}/admin/categories/${editingCategory.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                );
                setCategories(prev => prev.map(cat => 
                    cat.id === editingCategory.id ? { ...cat, ...formData } : cat
                ));
            } else {
                const response = await axios.post(
                    `${API_BASE}/admin/categories`,
                    formData,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
                );
                // Refetch to get the new category with ID
                const newCategory = await axios.get(`${API_BASE}/admin/categories`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setCategories(newCategory.data);
            }
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        
        try {
            await axios.delete(`${API_BASE}/admin/categories/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete category');
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                image_url: category.image_url || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', slug: '', image_url: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', slug: '', image_url: '' });
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Categories</h1>
                    <p className="text-neutral-500 mt-1">Manage product categories</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="card p-4 border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-ghost pl-10 w-full"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-auric-purple animate-spin" />
                </div>
            ) : filteredCategories.length === 0 ? (
                <div className="card p-12 text-center">
                    <Layers className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-600">No categories found</h3>
                    <p className="text-neutral-500 mt-2">Create your first category to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {category.image_url ? (
                                            <img
                                                src={category.image_url}
                                                alt={category.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-auric-purple/10 rounded-lg flex items-center justify-center">
                                                <ImageIcon className="text-auric-purple" size={24} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-neutral-900">{category.name}</h3>
                                            <p className="text-sm text-neutral-500">/{category.slug}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(category)}
                                        className="p-2 text-auric-purple hover:bg-auric-purple/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs text-neutral-500">
                                ID: {category.id}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-2xl font-bold text-neutral-900">
                                {editingCategory ? 'Edit Category' : 'Add Category'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="input-ghost w-full"
                                    placeholder="e.g., Gemstones"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Slug *
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                    className="input-ghost w-full"
                                    placeholder="gemstones"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    URL-friendly version (auto-generated)
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    className="input-ghost w-full"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingCategory ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
