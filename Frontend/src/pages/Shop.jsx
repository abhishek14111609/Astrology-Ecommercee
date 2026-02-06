import React, { useState, useEffect, useRef } from 'react';
import { Filter, ChevronDown, ChevronUp, X, Search, Loader2 } from 'lucide-react';
import ProductCard from '../components/UI/ProductCard';
import VITE_API_BASE_URL from '../config/api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [categories, setCategories] = useState(['All']);
    const [priceRange, setPriceRange] = useState(50000);
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const categoryRef = useRef(null);
    const sortRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch products
                const prodRes = await fetch(`${VITE_API_BASE_URL}/api/products`);
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

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setIsCategoryOpen(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target)) {
                setIsSortOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('touchstart', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('touchstart', handleOutsideClick);
        };
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
                <div className="mb-8 rounded-2xl border border-auric-gold/10 bg-white/80 p-6 shadow-md backdrop-blur-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-auric-gold">Celestial Collection</p>
                            <h1 className="font-serif text-3xl font-bold text-auric-rose">Divine Shop</h1>
                            <p className="text-gray-500 text-sm mt-1">Explore our collection of {sortedProducts.length} spiritual artifacts</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
                        <div className="relative h-full">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-auric-gold">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search gems, rituals, artifacts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-18 w-full rounded-xl border border-gray-200 bg-white px-10 text-sm shadow-sm outline-none transition focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30"
                            />
                        </div>

                        <div className="flex h-18 flex-col justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-500">Price Range</span>
                                <span className="rounded-full bg-auric-blush px-2 py-0.5 text-xs font-semibold text-auric-rose">₹{priceRange}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="50000"
                                step="1000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full accent-auric-gold"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400">
                                <span>₹0</span>
                                <span>₹50k</span>
                            </div>
                        </div>

                        <label className="flex h-18 flex-col justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                            <span className="text-xs font-medium text-gray-500">Category</span>
                            <div className="relative" ref={categoryRef}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCategoryOpen((prev) => !prev);
                                        setIsSortOpen(false);
                                    }}
                                    aria-expanded={isCategoryOpen}
                                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30 lg:hidden"
                                >
                                    <span className="truncate">{selectedCategory}</span>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                                {isCategoryOpen && (
                                    <ul className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg lg:hidden">
                                        {categories.map((cat) => (
                                            <li key={cat}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                    className="block w-full px-3 py-2 text-left hover:bg-auric-blush"
                                                >
                                                    {cat}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="hidden w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30 lg:block"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </label>

                        <label className="flex h-18 flex-col justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
                            <span className="text-xs font-medium text-gray-500">Sort By</span>
                            <div className="relative" ref={sortRef}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSortOpen((prev) => !prev);
                                        setIsCategoryOpen(false);
                                    }}
                                    aria-expanded={isSortOpen}
                                    className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30 lg:hidden"
                                >
                                    <span className="truncate">
                                        {sortBy === 'newest' ? 'Newest Arrivals' : sortBy === 'price-low' ? 'Price: Low to High' : 'Price: High to Low'}
                                    </span>
                                    <ChevronDown size={16} className="text-gray-400" />
                                </button>
                                {isSortOpen && (
                                    <ul className="absolute left-0 right-0 z-20 mt-2 max-h-56 overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg lg:hidden">
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSortBy('newest');
                                                    setIsSortOpen(false);
                                                }}
                                                className="block w-full px-3 py-2 text-left hover:bg-auric-blush"
                                            >
                                                Newest Arrivals
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSortBy('price-low');
                                                    setIsSortOpen(false);
                                                }}
                                                className="block w-full px-3 py-2 text-left hover:bg-auric-blush"
                                            >
                                                Price: Low to High
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSortBy('price-high');
                                                    setIsSortOpen(false);
                                                }}
                                                className="block w-full px-3 py-2 text-left hover:bg-auric-blush"
                                            >
                                                Price: High to Low
                                            </button>
                                        </li>
                                    </ul>
                                )}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="hidden w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-auric-gold focus:ring-2 focus:ring-auric-gold/30 lg:block"
                                >
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                </select>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Product Grid - Full Width */}
                <main>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-auric-gold animate-spin" />
                        </div>
                    ) : sortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
    );
};

export default Shop;