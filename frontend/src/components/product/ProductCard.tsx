import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuickView } from '../../context/QuickViewContext';
import { useToast } from '../../context/ToastContext';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const { showToast } = useToast();

  const wishlisted = isWishlisted(product.id);

  // Compute discount percentage
  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  // Determine specific quick technical badge
  const getTechnicalSpecBadge = () => {
    const s = product.specifications;
    if (s.ratedPowerW) return `${s.ratedPowerW}W ${s.cellType || 'Solar'}`;
    if (s.ratedOutputKva) return `${s.ratedOutputKva}kVA ${s.inverterType || 'Output'}`;
    if (s.capacityAh) return `${s.capacityAh}Ah ${s.batteryChemistry?.split(' ')[0] || ''}`;
    if (s.crossSectionMm2) return `${s.crossSectionMm2} ${s.cableType || ''}`;
    if (s.ratedCurrentA && s.poles) return `${s.ratedCurrentA}A ${s.poles} ${s.deviceType || ''}`;
    if (s.lumenOutput) return `${s.lumenOutput} lm ${s.lampType || ''}`;
    return null;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const res = addItem(product, 1);
    if (res.success) {
      showToast(`Added "${product.name}" to your cart.`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product.id);
    showToast(
      added ? `Added "${product.name}" to wishlist.` : `Removed from wishlist.`,
      'info'
    );
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const specBadge = getTechnicalSpecBadge();

  return (
    <div
      className={`group relative bg-white rounded-xl border border-gray-200/90 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ${className}`}
    >
      {/* Top Badges & Wishlist Action */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold text-[10px] shadow-sm">
              -{discountPercent}%
            </span>
          )}
          {product.badges?.map((badge) => (
            <Badge key={badge} type={badge} />
          ))}
        </div>

        <button
          onClick={handleToggleWishlist}
          className={`pointer-events-auto p-1.5 rounded-full transition-all shadow-xs ${
            wishlisted
              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              : 'bg-white/90 text-gray-400 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>
      </div>

      {/* Product Image Box */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = '/images/solar-panel.svg';
          }}
        />

        {/* Quick View Hover Button */}
        <button
          onClick={handleQuickView}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-white/95 hover:bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-md border border-gray-200/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 backdrop-blur-xs hover:text-purple-700"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </Link>

      {/* Product Details Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Technical Spec Badge */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider truncate">
              {product.brand}
            </span>
            {specBadge && (
              <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded shrink-0">
                {specBadge}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-[#6D28D9] transition-colors line-clamp-2 min-h-[2.5rem]"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Ratings & Stock Status */}
          <div className="flex items-center justify-between mt-2">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={12} />
            <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>In Stock</span>
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-purple-950">
                ৳{product.price.toLocaleString('en-BD')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{product.originalPrice.toLocaleString('en-BD')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-gray-400">Demo Price (BDT)</div>
          </div>

          <button
            onClick={handleAddToCart}
            className="p-2 sm:px-3 sm:py-2 rounded-lg bg-[#6D28D9] hover:bg-[#5B21B6] text-white transition-all shadow-sm hover:shadow-purple-500/20 active:scale-95 flex items-center gap-1.5 shrink-0"
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
