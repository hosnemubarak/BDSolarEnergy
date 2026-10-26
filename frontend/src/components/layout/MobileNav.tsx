import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, Heart, ShoppingBag, Wrench } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface MobileNavProps {
  onOpenCategories: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenCategories }) => {
  const { totalCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-1 py-1 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center min-h-[48px] px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </button>

        <NavLink
          to="/system-builder"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 text-xs font-medium transition-colors ${
              isActive ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <div className="relative">
            <Wrench className="w-5 h-5 mb-0.5 text-green-700" />
            <span className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <span>Builder</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center min-h-[48px] px-2 py-1 text-xs font-medium transition-colors relative ${
              isActive ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <div className="relative">
            <Heart className="w-5 h-5 mb-0.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {wishlistCount}
              </span>
            )}
          </div>
          <span>Wishlist</span>
        </NavLink>

        <button
          onClick={openCart}
          className="flex flex-col items-center justify-center min-h-[48px] px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-[#16A34A]" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-amber-400 text-gray-950 text-[10px] font-extrabold flex items-center justify-center leading-none">
                {totalCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
};
