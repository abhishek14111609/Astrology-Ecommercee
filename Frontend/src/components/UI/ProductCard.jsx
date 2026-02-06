import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { buildImageUrl } from '../../config/api';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    // Extract data with fallbacks
    // Always use numeric id for API calls, not MongoDB _id
    const productId = product.id || product._id;
    const productImage = buildImageUrl(product.image_url || product.images?.[0]?.url || product.image);
    const productPrice = product.variants?.[0]?.price || product.price || 0;
    const discountPercentage = product.variants?.[0]?.discountPercentage || product.discount || 0;
    
    return (
        <div
            className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/product/${productId}`)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/product/${productId}`);
                }
            }}
        >
            {/* Image Container */}
            <div className="relative overflow-hidden aspect-[4/5] bg-gray-100">
                <Link to={`/product/${productId}`} className="block h-full">
                    <img
                        src={productImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </Link>

                {/* badges */}
                {product.isNew && (
                    <span className="absolute top-3 left-3 bg-auric-rose text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-widest">
                        New
                    </span>
                )}
                {discountPercentage > 0 && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm tracking-widest">
                        -{discountPercentage}%
                    </span>
                )}

            </div>

            {/* Content */}
            <div className="p-4 text-center">
                <h3 className="font-serif text-lg font-medium text-auric-rose mb-2 truncate">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex justify-center items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={`${i < (product.rating?.average || 0) ? 'fill-auric-gold text-auric-gold' : 'text-gray-300'}`}
                        />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({product.rating?.count || 0})</span>
                </div>

                {/* Price */}
                <div className="flex justify-center items-center gap-2">
                    {product.variants?.[0]?.discountPercentage > 0 && (
                        <span className="text-gray-400 line-through text-sm">₹{Math.round(productPrice / (1 - product.variants[0].discountPercentage / 100))}</span>
                    )}
                    <span className="text-auric-rose font-semibold">₹{productPrice}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
