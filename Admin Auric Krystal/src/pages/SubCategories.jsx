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
    GitBranch, // Icon for Subcategories
    ArrowRight
} from 'lucide-react';

const SubCategories = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        category_id: ''
    });

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [subRes, catRes] = await Promise.all([
                axios.get(`${API_BASE}/admin/subcategories`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_BASE}/admin/categories`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setSubcategories(subRes.data);
            setCategories(catRes.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from name
        if (name === 'name' && !editingItem) {
            const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (editingItem) {
                await axios.put(
                    `${API_BASE}/admin/subcategories/${editingItem.id}`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                await axios.post(
                    `${API_BASE}/admin/subcategories`,
                    formData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            fetchData(); // Refresh data
            closeModal();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save sub-category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sub-category?')) return;

        try {
            await axios.delete(`${API_BASE}/admin/subcategories/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSubcategories(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete sub-category');
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                slug: item.slug,
                category_id: item.category_id
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', slug: '', category_id: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ name: '', slug: '', category_id: '' });
    };

    const filteredItems = subcategories.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.category_name && item.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Sub-Categories</h1>
                    <p className="text-neutral-500 mt-1">Manage product sub-categories</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Sub-Category
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
                        placeholder="Search sub-categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-ghost pl-10 w-full"
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-auric-purple animate-spin" />
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="card p-12 text-center">
                    <GitBranch className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-600">No sub-categories found</h3>
                    <p className="text-neutral-500 mt-2">Create your first sub-category to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 bg-auric-purple/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <GitBranch className="text-auric-purple" size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-neutral-900 truncate" title={item.name}>{item.name}</h3>
                                            <p className="text-sm text-neutral-500 truncate">/{item.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-3 text-xs font-medium text-neutral-600 bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
                                        <Layers size={12} />
                                        <span>Parent: {item.category_name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-2 text-auric-purple hover:bg-auric-purple/10 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-xs text-neutral-500 border-t pt-2 mt-2">
                                ID: {item.id}
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
                                {editingItem ? 'Edit Sub-Category' : 'Add Sub-Category'}
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
                                    Parent Category *
                                </label>
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                    className="input-ghost w-full"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">
                                    Sub-Category Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="input-ghost w-full"
                                    placeholder="e.g., Amethyst"
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
                                    placeholder="amethyst"
                                />
                                <p className="text-xs text-neutral-500 mt-1">
                                    URL-friendly version (auto-generated)
                                </p>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubCategories;
