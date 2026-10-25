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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1.5 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#6D28D9] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </NavLink>

        <button
          onClick={onOpenCategories}
          className="flex flex-col items-center py-1 px-2 text-[10px] font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </button>

        <NavLink
          to="/system-builder"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors ${
              isActive ? 'text-[#6D28D9] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <div className="relative">
            <Wrench className="w-5 h-5 mb-0.5 text-purple-700" />
            <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <span>Builder</span>
        </NavLink>

        <NavLink
          to="/wishlist"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-2 text-[10px] font-medium transition-colors relative ${
              isActive ? 'text-[#6D28D9] font-bold' : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          <Heart className="w-5 h-5 mb-0.5" />
          {wishlistCount > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 rounded-full bg-[#6D28D9] text-white text-[9px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span>Wishlist</span>
        </NavLink>

        <button
          onClick={openCart}
          className="flex flex-col items-center py-1 px-2 text-[10px] font-medium text-gray-500 hover:text-gray-900 transition-colors relative"
        >
          <ShoppingBag className="w-5 h-5 mb-0.5 text-[#6D28D9]" />
          {totalCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-amber-400 text-gray-950 text-[9px] font-extrabold flex items-center justify-center">
              {totalCount}
            </span>
          )}
          <span>Cart</span>
        </button>
      </div>
    </nav>
  );
};
