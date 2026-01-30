import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { buildImageUrl } from '../config/api';
import Button from '../components/UI/Button';
import SectionHeading from '../components/UI/SectionHeading';
import { products } from '../data/products';

const Wishlist = () => {
    const { addToCart } = useCart();

    // Mock wishlist data - normally this would come from a context or backend
    const wishlistItems = products.slice(0, 3);

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-auric-blush px-4">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 text-auric-gold shadow-sm">
                    <Heart size={32} />
                </div>
                <h1 className="font-serif text-2xl font-bold text-auric-rose mb-2">Your Wishlist is Empty</h1>
                <p className="text-gray-500 mb-8 text-center max-w-sm">Save your favorite spiritual artifacts to view them here later.</p>
                <Link to="/shop">
                    <Button variant="primary">Explore Boutique</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4">
                <SectionHeading title="Your Sacred Selection" subtitle="WISHLIST" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
                            <div className="relative aspect-square overflow-hidden bg-auric-blush">
                                <img src={buildImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-red-400 hover:text-red-600 hover:bg-white transition-all shadow-sm">
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-6">
                                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-auric-gold font-bold mb-2 block">{item.category}</span>
                                <h3 className="font-serif text-xl font-bold text-auric-rose mb-2 group-hover:text-auric-gold transition-colors">{item.name}</h3>
                                <div className="text-lg font-bold text-auric-rose mb-6">₹{item.price}</div>

                                <Button
                                    onClick={() => addToCart(item)}
                                    variant="primary"
                                    className="w-full gap-2 py-3"
                                >
                                    <ShoppingBag size={18} /> Add to Bag
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
