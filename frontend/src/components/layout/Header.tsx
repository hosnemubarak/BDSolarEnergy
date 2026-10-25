import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  Search,
  Zap,
  PhoneCall
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { totalCount, subtotal, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, setIsAuthModalOpen } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Left: Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 md:hidden transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4C1D95] to-[#6D28D9] flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6 text-amber-300 animate-[spin_12s_linear_infinite]" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 leading-none">
                <span>BD</span>
                <span className="text-[#6D28D9]">SOLAR</span>
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 -ml-0.5" />
              </div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-gray-500 mt-0.5">
                Energy & Electrical
              </p>
            </div>
          </Link>
        </div>

        {/* Middle: Universal Search Bar (Desktop & Tablet) */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <SearchBar />
        </div>

        {/* Right Action Icons: Helpline (Tablet+), Wishlist, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Quick Support Phone - Hidden on small mobile */}
          <a
            href="tel:+880170076527"
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100/80 text-purple-900 border border-purple-100 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-[#6D28D9]" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-gray-500 font-medium">Expert Consultation</div>
              <div className="text-xs font-bold text-purple-950">+880 1700-SOLAR</div>
            </div>
          </a>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-lg text-gray-700 hover:text-purple-700 hover:bg-purple-50 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6D28D9] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account Button / User Profile */}
          {user ? (
            <Link
              to="/account"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-900 transition-colors border border-transparent hover:border-purple-200"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-[#4C1D95] font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <div className="text-[10px] text-gray-400">Welcome</div>
                <div className="text-xs font-bold text-gray-900 truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </div>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-gray-700 hover:text-purple-900 hover:bg-purple-50 transition-colors"
              title="Sign In or Register"
            >
              <User className="w-5 h-5 sm:w-5 sm:h-5 text-gray-700" />
              <span className="hidden lg:inline text-xs font-semibold">Sign In</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/20 active:scale-95"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-400 text-gray-950 text-[10px] font-extrabold flex items-center justify-center border border-purple-900">
                  {totalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] text-purple-200 font-normal">Cart</span>
              <span className="font-bold text-white text-xs mt-0.5">
                ৳{subtotal > 0 ? subtotal.toLocaleString('en-BD') : '0'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar below Header */}
      <div className="px-4 pb-3 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
};
