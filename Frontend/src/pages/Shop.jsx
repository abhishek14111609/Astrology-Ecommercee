import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Search } from 'lucide-react';
import ProductCard from '../components/UI/ProductCard';
import { products, categories } from '../data/products';

const Shop = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const priceMatch = product.price <= priceRange;
        const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && priceMatch && searchMatch;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // Default (newest logic omitted for static mock)
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

                    <div className="flex items-center gap-4 mt-4 md:mt-0 flex-wrap">
                        <button
                            className="md:hidden flex items-center gap-2 text-auric-rose font-medium"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter size={20} /> Filters
                        </button>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded pl-10 pr-3 py-1 text-sm focus:outline-none focus:border-auric-gold w-48"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Category:</span>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:border-auric-gold"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:border-auric-gold"
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

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-serif text-lg font-semibold text-auric-rose mb-4 border-b border-gray-100 pb-2">Price Range</h3>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
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
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {sortedProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-lg border border-gray-100 border-dashed">
                                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                                <button
                                    onClick={() => { setSelectedCategory('All'); setPriceRange(5000); setSearchQuery(''); }}
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
