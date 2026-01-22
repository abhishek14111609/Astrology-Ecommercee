import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    return (
        <div className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-100">
                <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* badges */}
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-auric-rose text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-widest">
                        New
                    </span>
                )}
                {product.discount && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-widest">
                        -{product.discount}%
                    </span>
                )}

                {/* Quick Action Buttons (appear on hover) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <button
                        onClick={() => addToCart(product)}
                        className="bg-white p-3 rounded-full text-auric-rose hover:bg-auric-gold hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                        <ShoppingBag size={20} />
                    </button>
                    <Link to={`/product/${product.id}`} className="bg-white p-3 rounded-full text-auric-rose hover:bg-auric-gold hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                        <Eye size={20} />
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
                <Link to={`/category/${product.category}`} className="text-xs text-gray-500 uppercase hover:text-auric-gold transition-colors mb-1 block">
                    {product.category}
                </Link>
                <h3 className="font-serif text-lg font-medium text-auric-rose hover:text-auric-gold transition-colors mb-2 truncate">
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>

                {/* Rating */}
                <div className="flex justify-center items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`${i < product.rating ? 'fill-auric-gold text-auric-gold' : 'text-gray-300'}`}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex justify-center items-center gap-2">
                    {product.oldPrice && (
                        <span className="text-gray-400 line-through text-sm">₹{product.oldPrice}</span>
                    )}
                    <span className="text-auric-rose font-semibold">₹{product.price}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
