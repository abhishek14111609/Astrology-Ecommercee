import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';
import ProductCard from '../components/UI/ProductCard';

const Shop = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(5000);
    const [sortBy, setSortBy] = useState('newest');

    // Extended Mock Data
    const products = [
        { id: 1, name: "Natural Red Coral (Moonga)", category: "Gemstones", price: 2499, oldPrice: 4999, rating: 5, reviews: 128, image: "", isNew: true },
        { id: 2, name: "Certified Rudraksha Mala", category: "Rudraksha", price: 1599, oldPrice: 2199, rating: 4, reviews: 85, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&q=80", discount: 27 },
        { id: 3, name: "Crystal Tortoise For Vastu", category: "Feng Shui", price: 899, oldPrice: 1299, rating: 5, reviews: 240, image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=500&q=80" },
        { id: 4, name: "Healing Crystal Bracelet", category: "Bracelets", price: 499, oldPrice: 999, rating: 4, reviews: 45, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80", isNew: true },
        { id: 5, name: "Rose Quartz Stone", category: "Gemstones", price: 799, oldPrice: 1500, rating: 5, reviews: 32, image: "https://images.unsplash.com/photo-1596500448187-236b28328704?auto=format&fit=crop&w=500&q=80" },
        { id: 6, name: "Seven Chakra Tree", category: "Feng Shui", price: 1299, oldPrice: 1999, rating: 4, reviews: 67, image: "https://images.unsplash.com/photo-1615392695503-4f107c11867c?auto=format&fit=crop&w=500&q=80" },
        { id: 7, name: "Amethyst Crystal", category: "Gemstones", price: 1899, rating: 5, reviews: 112, image: "https://images.unsplash.com/photo-1567645064016-565451e5055c?auto=format&fit=crop&w=500&q=80", isNew: true },
        { id: 8, name: "Tibetan Singing Bowl", category: "Meditation", price: 3499, oldPrice: 4500, rating: 5, reviews: 204, image: "https://images.unsplash.com/photo-1520113412646-042339eb177d?auto=format&fit=crop&w=500&q=80" },
    ];

    const categories = ["All", "Gemstones", "Rudraksha", "Feng Shui", "Bracelets", "Meditation"];

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
        const priceMatch = product.price <= priceRange;
        return categoryMatch && priceMatch;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0; // Default (newest logic omitted for static mock)
    });

    return (
        <div className="bg-luxury-cream min-h-screen py-10">
            <div className="container mx-auto px-4">

                {/* Page Header */}
                <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                    <div>
                        <h1 className="font-serif text-3xl font-bold text-luxury-purple">Divine Shop</h1>
                        <p className="text-gray-500 text-sm mt-1">Explore our collection of {sortedProducts.length} spiritual artifacts</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button
                            className="md:hidden flex items-center gap-2 text-luxury-purple font-medium"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            <Filter size={20} /> Filters
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">Sort By:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-luxury-gold"
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
                            <h2 className="font-serif text-xl font-bold text-luxury-purple">Filters</h2>
                            <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                            <h3 className="font-serif text-lg font-semibold text-luxury-purple mb-4 border-b border-gray-100 pb-2">Categories</h3>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCategory === cat ? 'border-luxury-gold' : 'border-gray-300'}`}>
                                            {selectedCategory === cat && <div className="w-2 h-2 rounded-full bg-luxury-gold"></div>}
                                        </div>
                                        <input
                                            type="radio"
                                            name="category"
                                            className="hidden"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                        />
                                        <span className={`text-sm group-hover:text-luxury-gold transition-colors ${selectedCategory === cat ? 'text-luxury-purple font-medium' : 'text-gray-600'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="font-serif text-lg font-semibold text-luxury-purple mb-4 border-b border-gray-100 pb-2">Price Range</h3>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(Number(e.target.value))}
                                    className="w-full accent-luxury-gold h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
                                    onClick={() => { setSelectedCategory('All'); setPriceRange(5000); }}
                                    className="mt-4 text-luxury-gold font-medium hover:underline"
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
