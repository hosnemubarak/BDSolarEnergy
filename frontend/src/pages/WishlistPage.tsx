import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { PRODUCTS } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const WishlistPage: React.FC = () => {
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => addItem(p, 1));
    showToast(`Added ${wishlistedProducts.length} saved products to cart.`, 'success');
    openCart();
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Save high-performance solar panels, hybrid inverters, and electrical accessories here for later review.
        </p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#6D28D9] text-white text-xs font-bold rounded-xl inline-flex items-center gap-2"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: 'Saved Wishlist' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            My Wishlist ({wishlistedProducts.length} Items)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Products you have bookmarked for current or upcoming solar installations
          </p>
        </div>

        <button
          onClick={handleAddAllToCart}
          className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Move All to Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlistedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
