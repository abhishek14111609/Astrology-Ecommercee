import React, { useState, useEffect } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Search, Loader2 } from 'lucide-react';
import ProductCard from '../components/UI/ProductCard';
import API_BASE_URL from '../config/api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [priceRange, setPriceRange] = useState(50000);
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch products
                const prodRes = await fetch(`${API_BASE_URL}/api/products`);
                const response = await prodRes.json();
                
                // Check if response has the expected structure
                const prodData = response.data?.products || response.products || response;
                
                // Check if response is an array
                if (Array.isArray(prodData)) {
                    setProducts(prodData);
                    // Extract or fetch categories
                    const uniqueCats = ['All', ...new Set(prodData.map(p => p.category?.name || p.category_name).filter(Boolean))];
                    setCategories(uniqueCats);
                } else {
                    console.error("Expected array from API, got:", response);
                    setProducts([]);
                    setCategories(['All']);
                }

            } catch (err) {
                console.error("Failed to fetch shop data", err);
                setProducts([]);
                setCategories(['All']);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Filter Logic
    const filteredProducts = products.filter(product => {
        // Handle nested category structure
        const categoryName = product.category?.name || product.category_name || product.category;
        const categoryMatch = selectedCategory === 'All' || categoryName === selectedCategory;
        
        // Get price from variants or direct price field
        const productPrice = product.variants?.[0]?.price || product.price || 0;
        const priceMatch = productPrice <= priceRange;
        
        const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return categoryMatch && priceMatch && searchMatch;
    });

    // Sort Logic
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = a.variants?.[0]?.price || a.price || 0;
        const priceB = b.variants?.[0]?.price || b.price || 0;
        
        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
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
                                    <ProductCard key={product._id || product.id} product={product} />
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
