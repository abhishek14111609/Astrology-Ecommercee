import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    // Mock Data for the single product (in real app, fetch based on ID)
    const product = {
        id: Number(id) || 1,
        name: "Natural Red Coral (Moonga)",
        category: "Gemstones",
        price: 2499,
        oldPrice: 4999,
        rating: 4.8,
        reviews: 128,
        description: "Original Italian Red Coral (Moonga) gemstone certified by lab. Bringing energy, vitality, and ambition to the wearer. Beneficial for Mars (Mangal) complications.",
        images: [
            "",
            "https://images.unsplash.com/photo-1596500448187-236b28328704?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1615392695503-4f107c11867c?auto=format&fit=crop&w=600&q=80"
        ],
        sku: "GEM-RC-001",
        availability: "In Stock"
    };

    const relatedProducts = [
        { id: 2, name: "Certified Rudraksha Mala", category: "Rudraksha", price: 1599, oldPrice: 2199, rating: 4, reviews: 85, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=500&q=80", discount: 27 },
        { id: 3, name: "Crystal Tortoise For Vastu", category: "Feng Shui", price: 899, oldPrice: 1299, rating: 5, reviews: 240, image: "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=500&q=80" },
        { id: 4, name: "Healing Crystal Bracelet", category: "Bracelets", price: 499, oldPrice: 999, rating: 4, reviews: 45, image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80", isNew: true },
    ];

    const handleAddToCart = () => {
        // Add product multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">

                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-luxury-purple">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-luxury-purple">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-luxury-gold font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-luxury-cream rounded-lg overflow-hidden border border-gray-100">
                            <img src={product.images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-4 overflow-x-auto">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-luxury-gold' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col h-full">
                        <span className="text-luxury-gold uppercase tracking-[0.2em] text-xs font-semibold mb-2">{product.category}</span>
                        <h1 className="font-serif text-3xl md:text-4xl text-luxury-purple font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-luxury-gold text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`${i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews} Reviews)</span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">{product.availability}</span>
                        </div>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-3xl font-bold text-luxury-purple">₹{product.price}</span>
                            {product.oldPrice && <span className="text-xl text-gray-400 line-through mb-1">₹{product.oldPrice}</span>}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
                            {product.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-sm w-32">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Minus size={16} /></button>
                                <span className="flex-1 text-center font-medium">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"><Plus size={16} /></button>
                            </div>
                            <Button onClick={handleAddToCart} variant="primary" className="flex-1">
                                Add to Cart
                            </Button>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-3">
                                <Truck size={18} className="text-luxury-gold" />
                                <span>Free delivery on orders over ₹999</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-luxury-gold" />
                                <span>100% Authentic & Lab Certified</span>
                            </div>
                            <div className="pt-4 text-xs text-gray-400">
                                SKU: {product.sku}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                <div>
                    <h2 className="font-serif text-2xl font-bold text-luxury-purple mb-8">You May Also Like</h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(prod => (
                            <ProductCard key={prod.id} product={prod} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;
