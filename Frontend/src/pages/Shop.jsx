import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Loader2 } from 'lucide-react';
import ProductCard from '../components/UI/ProductCard';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);
    const [sortBy, setSortBy] = useState('newest');
    const [categories, setCategories] = useState(['All']);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch products
                const prodRes = await fetch('http://localhost:5000/api/products');
                const prodData = await prodRes.json();
                setProducts(prodData);

                // Extract or fetch categories
                // Option A: Extract from products
                const uniqueCats = ['All', ...new Set(prodData.map(p => p.category_name).filter(Boolean))];
                setCategories(uniqueCats);

                // Option B: Fetch from /api/products/categories if distinct List needed
                // const catRes = await fetch('http://localhost:5000/api/products/categories');
                // const catData = await catRes.json();
                // setCategories(['All', ...catData.map(c => c.name)]);

            } catch (err) {
                console.error("Failed to fetch shop data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category_name === selectedCategory || product.category === selectedCategory; // Handle both potential backend response structures
        // Backend stores price as number, so clean comparison
        const priceMatch = product.price <= priceRange;
        return categoryMatch && priceMatch;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // Default (newest/id)
    });

    return (
        <div className="bg-auric-blush min-h-screen py-10">
            <div className="container mx-auto px-4">

                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-auric-rose">Divine Shop</h1>
                        <p className="text-gray-500 text-sm mt-1">Explore our collection of {sortedProducts.length} spiritual artifacts</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button
                            className="md:hidden flex items-center gap-2 text-auric-rose font-medium"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter size={20} /> Filters
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-auric-gold"
                            >
                                <option value="newest">Newest Arrivals</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className={`md:w-1/4 ${isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden md:block'}`}>
                        <div className="md:hidden flex justify-between items-center mb-6">
                            <h2 className="font-serif text-xl font-bold text-auric-rose">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                            <h3 className="font-serif text-lg font-semibold text-auric-rose mb-4 border-b border-gray-100 pb-2">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCategory === cat ? 'border-auric-gold' : 'border-gray-300'}`}>
                                            {selectedCategory === cat && <div className="w-2 h-2 rounded-full bg-auric-gold"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="category"
                                            className="hidden"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                        />
                                        <span className={`text-sm group-hover:text-auric-gold transition-colors ${selectedCategory === cat ? 'text-auric-rose font-medium' : 'text-gray-600'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-serif text-lg font-semibold text-auric-rose mb-4 border-b border-gray-100 pb-2">Price Range</h3>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="1000"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-auric-gold h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-sm text-gray-600 font-medium">
                                    <span>₹0</span>
                                    <span>₹{priceRange}</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="md:w-3/4">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-10 h-10 text-auric-gold animate-spin" />
                            </div>
                        ) : sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-gray-100 border-dashed">
                                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                                <button
                                    onClick={() => { setSelectedCategory('All'); setPriceRange(50000); }}
                                    className="mt-4 text-auric-gold font-medium hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Shop;
