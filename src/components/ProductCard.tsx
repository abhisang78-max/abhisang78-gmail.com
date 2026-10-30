import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, wishlist, toggleWishlist } = useApp();
  const [imageError, setImageError] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent = product.originalPrice > product.sellingPrice
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white border border-stone-200/80 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      
      {/* Product Image Stage */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        {!imageError && product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-100 text-stone-500">
            <span className="font-serif text-sm font-medium text-stone-800">{product.name}</span>
            <span className="text-xs text-stone-400 mt-1 uppercase tracking-wider">{product.categoryLabel}</span>
          </div>
        )}

        {/* Subtle Text Tag (Anti-Pill Rule: Quiet unboxed metadata) */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {product.isNewArrival && (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-stone-900/90 text-white rounded">
              New Arrival
            </span>
          )}
          {product.isBestSeller && !product.isNewArrival && (
            <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 bg-amber-900/90 text-amber-200 rounded">
              Curated Direct
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
            isWishlisted ? 'bg-red-50 text-red-600' : 'bg-white/80 text-stone-700 hover:text-stone-950 hover:bg-white'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-stone-950/70 via-stone-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold rounded shadow-sm hover:bg-stone-100 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Details</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <span className="uppercase tracking-wider font-medium text-[11px]">{product.categoryLabel}</span>
            <div className="flex items-center gap-1 text-amber-700 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="tabular-nums">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-medium text-stone-900 text-sm leading-snug line-clamp-1 hover:text-amber-800 transition-colors cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-stone-950 tabular-nums">
                ₹{product.sellingPrice.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.sellingPrice && (
                <span className="text-xs text-stone-400 line-through tabular-nums">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[11px] text-amber-800 font-medium">
                Save {discountPercent}% direct
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.inventory <= 0}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer ${
              product.inventory <= 0
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}
            title={product.inventory <= 0 ? 'Out of stock' : 'Add to Bag'}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{product.inventory <= 0 ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
