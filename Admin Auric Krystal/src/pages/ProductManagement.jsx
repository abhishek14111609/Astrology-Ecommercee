import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    CheckCircle2
} from 'lucide-react';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '', slug: '', description: '', price: '', category_id: '', zodiac_sign: 'Aries', is_bestseller: false, tags: []
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setFetching(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('http://localhost:5000/api/products'),
                axios.get('http://localhost:5000/api/products/categories')
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (err) { console.error(err); }
        setFetching(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/products', form, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchInitialData();
            setForm({ name: '', slug: '', description: '', price: '', category_id: '', zodiac_sign: 'Aries', is_bestseller: false, tags: [] });
            alert('Divine product manifested successfully!');
        } catch (err) {
            alert('Failed to manifest. Check connection.');
        }
        setLoading(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Product Management</h1>
                    <p className="text-neutral-500 mt-1">Curate and manage your sacred inventory</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
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

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Form Section - Modern Card */}
                <aside className="xl:col-span-4 space-y-6">
                    <div className="card p-6 sticky top-6">
                        <div className="inline-flex p-3 rounded-xl bg-auric-purple/10 mb-4">
                            <Plus size={24} className="text-auric-purple" />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Add New Product</h2>
                        <p className="text-neutral-500 text-sm mb-6">Create a new product in your inventory</p>

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
                                        <label className="text-xs font-semibold text-neutral-700">Category</label>
                                        <select
                                            className="input-ghost"
                                            value={form.category_id}
                                            onChange={e => setForm({ ...form, category_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
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

                            <button
                                disabled={loading}
                                className="btn-primary w-full py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content - Grid View for modern look */}
                <div className="xl:col-span-8">
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
                                        <div className="w-14 h-14 bg-gradient-to-br from-auric-purple/10 to-auric-purple/5 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                                            🕉️
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-neutral-400 hover:text-auric-purple hover:bg-auric-purple/10 rounded-lg transition-all">
                                                <Edit size={16} />
                                            </button>
                                            <button className="p-2 text-neutral-400 hover:text-auric-crimson hover:bg-red-50 rounded-lg transition-all">
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

                                        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                                            <span className="text-2xl font-bold text-neutral-900">₹{p.price}</span>
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
