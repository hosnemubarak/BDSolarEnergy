import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ShoppingCart, 
  Heart, 
  Check, 
  ShieldCheck, 
  Plus, 
  Minus, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { useQuickView } from '../../context/QuickViewContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { RatingStars } from '../common/RatingStars';

export const QuickViewModal: React.FC = () => {
  const { activeProduct, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (activeProduct) {
      setSelectedImage(activeProduct.image);
      setQuantity(1);
    }
  }, [activeProduct]);

  if (!activeProduct) return null;

  const wishlisted = isWishlisted(activeProduct.id);

  const handleAddToCart = () => {
    const res = addItem(activeProduct, quantity);
    if (res.success) {
      showToast(`Added ${quantity}x "${activeProduct.name}" to cart.`, 'success');
      closeQuickView();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleToggleWishlist = () => {
    const added = toggleWishlist(activeProduct.id);
    showToast(
      added ? `Added "${activeProduct.name}" to wishlist.` : `Removed from wishlist.`,
      'info'
    );
  };

  const specs = activeProduct.specifications;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      {/* Modal Dialog */}
      <div className="min-h-screen px-4 text-center flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 text-left shadow-2xl z-10 overflow-hidden transform transition-all border border-green-100">
          {/* Close button */}
          <button
            onClick={closeQuickView}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Gallery preview */}
            <div className="space-y-3">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 relative">
                <img
                  src={selectedImage || activeProduct.image}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/solar-panel.svg';
                  }}
                />
                {activeProduct.originalPrice && activeProduct.originalPrice > activeProduct.price && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-rose-600 text-white font-bold text-xs rounded-md shadow-sm">
                    Sale
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {activeProduct.gallery && activeProduct.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {activeProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                        selectedImage === img
                          ? 'border-[#15803D] scale-105'
                          : 'border-gray-200 hover:border-gray-400 opacity-70'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumb"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/images/solar-panel.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Specs */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">
                  <span>{activeProduct.brand}</span>
                  <span>•</span>
                  <span className="text-gray-400 font-mono text-[11px]">{activeProduct.sku}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {activeProduct.name}
                </h3>

                <div className="mt-2 flex items-center justify-between">
                  <RatingStars rating={activeProduct.rating} reviewCount={activeProduct.reviewCount} />
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({activeProduct.stock} units)</span>
                  </span>
                </div>

                {/* Price */}
                <div className="mt-4 p-3 bg-green-50/60 rounded-xl border border-green-100 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-[#166534]">
                    ৳{activeProduct.price.toLocaleString('en-BD')}
                  </span>
                  {activeProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      ৳{activeProduct.originalPrice.toLocaleString('en-BD')}
                    </span>
                  )}
                  <span className="text-[11px] text-gray-500 ml-auto">Verified Demo Pricing</span>
                </div>

                {/* Short specs list */}
                <div className="mt-4 space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {specs.ratedPowerW && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rated Power:</span>
                      <span className="font-semibold text-gray-800">{specs.ratedPowerW} Watts</span>
                    </div>
                  )}
                  {specs.ratedOutputKva && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rated Capacity:</span>
                      <span className="font-semibold text-gray-800">{specs.ratedOutputKva} kVA</span>
                    </div>
                  )}
                  {specs.capacityAh && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Storage Capacity:</span>
                      <span className="font-semibold text-gray-800">{specs.capacityAh} Ah ({specs.batteryChemistry})</span>
                    </div>
                  )}
                  {specs.crossSectionMm2 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Conductor Size:</span>
                      <span className="font-semibold text-gray-800">{specs.crossSectionMm2}</span>
                    </div>
                  )}
                  {specs.ratedCurrentA && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Rating:</span>
                      <span className="font-semibold text-gray-800">{specs.ratedCurrentA}A ({specs.poles})</span>
                    </div>
                  )}
                  {specs.warrantyYears && (
                    <div className="flex justify-between text-green-900 font-medium">
                      <span>Warranty:</span>
                      <span>{specs.warrantyYears} Years Manufacturer Warranty</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(activeProduct.stock, q + 1))}
                      className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-2.5 px-4 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-green-700/20 flex items-center justify-center gap-2 active:scale-98"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={handleToggleWishlist}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      wishlisted
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-gray-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50/50'
                    }`}
                    title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                <Link
                  to={`/product/${activeProduct.slug}`}
                  onClick={closeQuickView}
                  className="w-full py-2 text-center text-xs font-semibold text-green-700 hover:text-green-900 flex items-center justify-center gap-1.5"
                >
                  <span>View Full Product Details & Compatibility</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
