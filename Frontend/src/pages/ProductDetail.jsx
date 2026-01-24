import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Minus, Plus, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from '../components/UI/Button';
// import { products } from '../data/products'; // REMOVED
import ProductCard from '../components/UI/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                const data = await res.json();

                if (res.ok) {
                    setProduct(data);
                    // Fetch related (same category)
                    // We call the all products endpoint with filter.
                    if (data.category_id || data.category_name) {
                        // Use fallback search if we don't have IDs handy in frontend mapping yet
                        // Assuming category_name is available or we use category_id
                        // For now, let's fetch all and filter in frontend or use correct query param
                        try {
                            const query = data.category_id ? `category_id=${data.category_id}` : `category=${data.category_name}`;
                            // Since our backend takes 'category' slug, we might need slug.
                            // Let's just fetch all and filter for related for now to be safe, or optimize later
                            const relRes = await fetch(`http://localhost:5000/api/products?category=${data.category_name}`); // Assuming category_name matches slug or backend handles it
                            if (relRes.ok) {
                                const relData = await relRes.json();
                                setRelatedProducts(relData.filter(p => p.id !== data.id).slice(0, 4));
                            }
                        } catch (e) {
                            console.error("Related fetch error", e);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch product", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    const handleAddToCart = () => {
        if (!product) return;
        // Add product multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 text-auric-gold animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <h2 className="text-2xl font-serif text-auric-rose">Product Not Found</h2>
                <Link to="/shop" className="text-auric-gold mt-4 hover:underline">Return to Shop</Link>
            </div>
        );
    }

    // Ensure images array is populated (backend might return just 'image' or 'images')
    const galleryImages = (product.images && product.images.length > 0)
        ? product.images
        : [product.image_url || product.image];

    return (
        <div className="bg-white py-12">
            <div className="container mx-auto px-4">

                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-8">
                    <Link to="/" className="hover:text-auric-rose">Home</Link>
                    <span className="mx-2">/</span>
                    <Link to="/shop" className="hover:text-auric-rose">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-auric-gold font-medium">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-auric-blush rounded-lg overflow-hidden border border-gray-100">
                            <img src={galleryImages[activeImage]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        {galleryImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-20 rounded-md overflow-hidden border-2 shrink-0 transition-all ${activeImage === idx ? 'border-auric-gold' : 'border-transparent hover:border-gray-200'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col h-full">
                        <span className="text-auric-gold uppercase tracking-[0.2em] text-xs font-semibold mb-2">{product.category_name || product.category}</span>
                        <h1 className="font-serif text-3xl md:text-4xl text-auric-rose font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-auric-gold text-sm">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`${i < Math.round(product.rating || 5) ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">({product.reviews || 0} Reviews)</span>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        </div>

                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-3xl font-bold text-auric-rose">₹{product.price}</span>
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
                                <Truck size={18} className="text-auric-gold" />
                                <span>Free delivery on orders over ₹999</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <ShieldCheck size={18} className="text-auric-gold" />
                                <span>100% Authentic & Lab Certified</span>
                            </div>
                            <div className="pt-4 text-xs text-gray-400">
                                SKU: {product.sku || 'N/A'}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="font-serif text-2xl font-bold text-auric-rose mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(prod => (
                                <ProductCard key={prod.id} product={prod} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ProductDetail;
