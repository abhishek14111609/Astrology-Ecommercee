import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';
import {
    Plus,
    Trash2,
    Edit,
    Search,
    Loader2,
    Package,
    Zap,
    // ZodiacAries, // Note: using placeholders or icons
    LayoutGrid,
    MoreVertical,
    CheckCircle2,
    Upload,
    FileSpreadsheet,
    Download,
    AlertCircle
} from 'lucide-react';

const ProductManagement = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        slug: '',
        description: '',
        price: '',
        category_id: '',
        sub_category_id: '',
        image_url: '',
        zodiac_sign: 'Aries',
        is_bestseller: false,
        tags: [],
        stock: 0
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setFetching(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get(`${VITE_API_BASE_URL}/products`),
                axios.get(`${VITE_API_BASE_URL}/admin/categories`)
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) { console.error(err); }
        setFetching(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await axios.post(`${VITE_API_BASE_URL}/admin/upload-image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm(prev => ({ ...prev, image_url: response.data.imageUrl }));
        } catch (err) {
            console.error(err);
            alert('Failed to upload image');
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            slug: '',
            description: '',
            price: '',
            category_id: '',
            sub_category_id: '',
            image_url: '',
            zodiac_sign: 'Aries',
            is_bestseller: false,
            tags: [],
            stock: 0
        });
        setEditingProduct(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingProduct) {
                await axios.put(`${VITE_API_BASE_URL}/admin/products/${editingProduct.id}`, form);
            } else {
                await axios.post(`${VITE_API_BASE_URL}/admin/products`, form);
            }
            fetchInitialData();
            resetForm();
            alert(`Product ${editingProduct ? 'updated' : 'created'} successfully!`);
        } catch (err) {
            alert('Operation failed. Check connection.');
        }
        setLoading(false);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            slug: product.slug,
            description: product.description || '',
            price: product.price,
            category_id: product.category_id || '',
            sub_category_id: product.sub_category_id || '',
            image_url: product.image_url || product.image || '',
            zodiac_sign: product.zodiac_sign || 'Aries',
            is_bestseller: product.is_bestseller || false,
            tags: product.tags || [],
            stock: product.stock || 0
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await axios.delete(`${VITE_API_BASE_URL}/admin/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            alert('Failed to delete product');
        }
    };

    const handleExcelUpload = async () => {
        if (!uploadFile) {
            alert('Please select an Excel file');
            return;
        }

        setUploading(true);
        setUploadResult(null);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', uploadFile);

            const response = await axios.post(
                `${VITE_API_BASE_URL}/admin/products/upload-excel`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setUploadResult(response.data.results);
            fetchInitialData();
            setUploadFile(null);
        } catch (err) {
            console.error('Upload Error:', err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert('Session expired. Please login again.');
                navigate('/login');
            } else {
                alert('Failed to upload Excel file: ' + (err.response?.data?.message || err.message));
            }
        }

        setUploading(false);
    };

    const downloadTemplate = () => {
        // Create sample Excel data
        const sampleData = [
            {
                Categories: 'Healing Crystals',
                Products: 'Sample Product',
                Price: 1999.00,
                Tags: 'Healing, Meditation',
                'Best Seller': 'FALSE',
                'Zodiac Signs': 'Aries',
                Stocks: 50,
                Descriptions: 'Product description here'
            }
        ];

        // Create worksheet
        const ws = document.createElement('table');
        ws.innerHTML = `
            <thead>
                <tr>
                    <th>Categories</th>
                    <th>Products</th>
                    <th>Price</th>
                    <th>Tags</th>
                    <th>Best Seller</th>
                    <th>Zodiac Signs</th>
                    <th>Stocks</th>
                    <th>Descriptions</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Healing Crystals</td>
                    <td>Sample Product</td>
                    <td>1999.00</td>
                    <td>Healing, Meditation</td>
                    <td>FALSE</td>
                    <td>Aries</td>
                    <td>50</td>
                    <td>Product description here</td>
                </tr>
            </tbody>
        `;

        // Convert to CSV for simplicity
        const csv = 'Categories,Products,Price,Tags,Best Seller,Zodiac Signs,Stocks,Descriptions\nHealing Crystals,Sample Product,1999.00,"Healing, Meditation",FALSE,Aries,50,"Product description here"\n';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'products_template.csv';
        a.click();
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Product Management</h1>
                    <p className="text-neutral-500 mt-1">Curate and manage your sacred inventory</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                    >
                        <Upload size={18} />
                        Bulk Upload
                    </button>
                    <div className="relative w-full sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-auric-purple transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input-ghost w-full pl-12"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            {/* Excel Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-auric-purple/10 rounded-xl">
                                    <FileSpreadsheet className="text-auric-purple" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-neutral-900">Bulk Upload Products</h2>
                                    <p className="text-sm text-neutral-500">Upload Excel file to add multiple products</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setUploadResult(null);
                                    setUploadFile(null);
                                }}
                                className="text-neutral-400 hover:text-neutral-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Template Download */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-blue-900 mb-1">Need a template?</h3>
                                        <p className="text-sm text-blue-700 mb-3">
                                            Download our Excel template with sample data and column format.
                                        </p>
                                        <button
                                            onClick={downloadTemplate}
                                            className="btn-ghost text-blue-600 hover:bg-blue-100 flex items-center gap-2 text-sm"
                                        >
                                            <Download size={16} />
                                            Download Template (CSV)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-8 text-center hover:border-auric-purple transition-colors">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={(e) => setUploadFile(e.target.files[0])}
                                    className="hidden"
                                    id="excel-upload"
                                />
                                <label htmlFor="excel-upload" className="cursor-pointer">
                                    <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileSpreadsheet size={32} className="text-neutral-400" />
                                    </div>
                                    <p className="text-neutral-900 font-semibold mb-1">
                                        {uploadFile ? uploadFile.name : 'Click to select Excel/CSV file'}
                                    </p>
                                    <p className="text-sm text-neutral-500">Supports .xlsx, .xls and .csv formats</p>
                                </label>
                            </div>

                            {/* Upload Button */}
                            <button
                                onClick={handleExcelUpload}
                                disabled={!uploadFile || uploading}
                                className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading && <Loader2 className="animate-spin" size={18} />}
                                {uploading ? 'Uploading...' : 'Upload Products'}
                            </button>

                            {/* Results */}
                            {uploadResult && (
                                <div className="space-y-4 mt-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-neutral-50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-neutral-900">{uploadResult.total}</p>
                                            <p className="text-xs text-neutral-500 mt-1">Total Rows</p>
                                        </div>
                                        <div className="bg-green-50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-green-600">{uploadResult.successful}</p>
                                            <p className="text-xs text-green-600 mt-1">Successful</p>
                                        </div>
                                        <div className="bg-red-50 rounded-xl p-4 text-center">
                                            <p className="text-2xl font-bold text-red-600">{uploadResult.failed}</p>
                                            <p className="text-xs text-red-600 mt-1">Failed</p>
                                        </div>
                                    </div>

                                    {uploadResult.failedList && uploadResult.failedList.length > 0 && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-48 overflow-y-auto">
                                            <h4 className="font-semibold text-red-900 mb-2">Failed Items:</h4>
                                            <ul className="space-y-2 text-sm">
                                                {uploadResult.failedList.map((item, idx) => (
                                                    <li key={idx} className="text-red-700">
                                                        <span className="font-medium">{item.row.name || 'Unknown'}:</span> {item.error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area - Split View */}
            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Form Section - Scrollable Panel */}
                <aside className="xl:col-span-4 overflow-y-auto pr-2 no-scrollbar">
                    <div className="card p-6">
                        <div className="inline-flex p-3 rounded-xl bg-auric-purple/10 mb-4">
                            {editingProduct ? <Edit size={24} className="text-auric-purple" /> : <Plus size={24} className="text-auric-purple" />}
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <p className="text-neutral-500 text-sm mb-6">
                            {editingProduct ? 'Update product details' : 'Create a new product in your inventory'}
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-700">Product Name</label>
                                    <input
                                        placeholder="e.g. Crystal Healing Set"
                                        className="input-ghost"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-700">Price (₹)</label>
                                        <input
                                            placeholder="4999"
                                            type="number"
                                            className="input-ghost"
                                            value={form.price}
                                            onChange={e => setForm({ ...form, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-700">Stock Quantity</label>
                                        <input
                                            placeholder="50"
                                            type="number"
                                            min="0"
                                            className="input-ghost"
                                            value={form.stock}
                                            onChange={e => setForm({ ...form, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-700">Category</label>
                                        <select
                                            className="input-ghost"
                                            value={form.category_id}
                                            onChange={e => setForm({ ...form, category_id: e.target.value, sub_category_id: '' })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-neutral-700">Sub-Category</label>
                                        <select
                                            className="input-ghost"
                                            value={form.sub_category_id}
                                            onChange={e => setForm({ ...form, sub_category_id: e.target.value })}
                                            disabled={!form.category_id}
                                        >
                                            <option value="">Select Sub-Category</option>
                                            {form.category_id && categories.find(c => c.id == form.category_id)?.subcategories?.map(sc => (
                                                <option key={sc.id} value={sc.id}>{sc.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-700">Product Image</label>
                                    <div className="relative border-2 border-dashed border-neutral-200 rounded-xl p-4 hover:border-auric-purple transition-colors bg-neutral-50/50">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-10 h-10 bg-auric-purple/10 rounded-full flex items-center justify-center mb-2">
                                                <Upload size={18} className="text-auric-purple" />
                                            </div>
                                            <p className="text-xs font-medium text-neutral-900">Click to upload image</p>
                                            <p className="text-[10px] text-neutral-500 mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    </div>
                                    {form.image_url && (
                                        <div className="mt-3 relative w-full h-48 rounded-lg overflow-hidden border border-neutral-200 group">
                                            <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                                                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-red-500 hover:text-red-600 hover:bg-white opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-700">Zodiac Sign</label>
                                    <select
                                        className="input-ghost"
                                        value={form.zodiac_sign}
                                        onChange={e => setForm({ ...form, zodiac_sign: e.target.value })}
                                    >
                                        {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(sign => (
                                            <option key={sign} value={sign}>{sign}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-700">Description</label>
                                    <textarea
                                        placeholder="Describe the product..."
                                        className="input-ghost min-h-[100px] resize-none"
                                        value={form.description}
                                        onChange={e => setForm({ ...form, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-neutral-700">Tags (comma-separated)</label>
                                    <input
                                        placeholder="e.g. Healing, Meditation, Energy"
                                        className="input-ghost"
                                        value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                                        onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
                                    />
                                    {form.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {form.tags.map((tag, idx) => (
                                                <span key={idx} className="badge bg-auric-purple/10 text-auric-purple border-auric-purple/20 text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl group cursor-pointer">
                                <input
                                    type="checkbox"
                                    id="bestseller-check"
                                    className="hidden"
                                    checked={form.is_bestseller}
                                    onChange={e => setForm({ ...form, is_bestseller: e.target.checked })}
                                />
                                <label
                                    htmlFor="bestseller-check"
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all cursor-pointer border-2 ${form.is_bestseller ? 'bg-auric-purple border-auric-purple text-white' : 'border-neutral-300'}`}
                                >
                                    {form.is_bestseller && <CheckCircle2 size={14} />}
                                </label>
                                <label htmlFor="bestseller-check" className="text-sm font-semibold text-neutral-700 cursor-pointer">Mark as Bestseller</label>
                            </div>

                            <div className="flex gap-3 pt-2">
                                {editingProduct && (
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="btn-secondary flex-1 py-3.5"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading && <Loader2 className="animate-spin" size={18} />}
                                    {loading ? (editingProduct ? 'Updating...' : 'Creating...') : (editingProduct ? 'Update Product' : 'Create Product')}
                                </button>
                            </div>
                        </form>
                    </div>
                </aside>

                {/* Product List - Scrollable Panel */}
                <div className="xl:col-span-8 overflow-y-auto pr-2 no-scrollbar">
                    {fetching ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <div className="w-16 h-16 border-4 border-neutral-200 border-t-auric-purple rounded-full animate-spin mb-4"></div>
                            <p className="text-neutral-500 font-semibold animate-pulse">Loading products...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="card-hover p-6 group relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-auric-purple/10 to-auric-purple/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                            {p.image_url || p.image ? (
                                                <img src={p.image_url || p.image} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                '🕉️'
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(p)}
                                                className="p-2 text-neutral-400 hover:text-auric-purple hover:bg-auric-purple/10 rounded-lg transition-all"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2 text-neutral-400 hover:text-auric-crimson hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-neutral-900 group-hover:text-auric-purple transition-colors mb-1">
                                                {p.name}
                                            </h3>
                                            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                                                {p.category_name}
                                            </span>
                                        </div>

                                        {p.description && (
                                            <p className="text-sm text-neutral-600 line-clamp-2">{p.description}</p>
                                        )}

                                        {p.tags && p.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {p.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="badge bg-auric-purple/10 text-auric-purple border-auric-purple/20 text-[10px]">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {p.tags.length > 3 && (
                                                    <span className="badge bg-neutral-100 text-neutral-500 border-neutral-200 text-[10px]">
                                                        +{p.tags.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                            <div>
                                                <span className="text-2xl font-bold text-neutral-900">₹{p.price}</span>
                                                <span className="block text-xs text-neutral-500 mt-1">
                                                    Stock: {p.stock || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {p.is_bestseller && (
                                                    <span className="badge badge-warning">
                                                        Best
                                                    </span>
                                                )}
                                                <span className="badge bg-neutral-100 text-neutral-600 border-neutral-200">
                                                    {p.zodiac_sign}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {filteredProducts.length === 0 && (
                                <div className="col-span-full py-32 text-center card">
                                    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package size={40} className="text-neutral-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-500 mb-2">No Products Found</h3>
                                    <p className="text-sm text-neutral-400">Try adjusting your search criteria</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
