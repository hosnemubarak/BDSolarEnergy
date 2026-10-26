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
import { formatBDT } from '../../utils/currency';

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
            className="p-1.5 rounded-lg text-gray-700 hover:text-[#16A34A] hover:bg-green-50 md:hidden transition-colors"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#16A34A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#15803D] transition-colors">
              <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 leading-none">
                <span>BD</span>
                <span className="text-[#16A34A]">SOLAR</span>
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 -ml-0.5" />
              </div>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 mt-0.5">
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
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-green-50 text-gray-700 hover:text-[#16A34A] border border-gray-200 transition-colors"
          >
            <PhoneCall className="w-4 h-4 text-[#16A34A]" />
            <div className="text-left leading-tight">
              <div className="text-[10px] text-gray-500 font-medium">Customer Support</div>
              <div className="text-xs font-bold text-gray-900">+880 1700-SOLAR</div>
            </div>
          </a>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-lg text-gray-700 hover:text-[#16A34A] hover:bg-green-50 transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#16A34A] text-white text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Account Button / User Profile */}
          {user ? (
            <Link
              to="/account"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-900 transition-colors border border-transparent hover:border-green-200"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 text-[#16A34A] font-bold text-xs flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left leading-tight">
                <div className="text-[10px] text-gray-400">Account</div>
                <div className="text-xs font-bold text-gray-900 truncate max-w-[100px]">
                  {user.name.split(' ')[0]}
                </div>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-gray-700 hover:text-[#16A34A] hover:bg-green-50 transition-colors"
              title="Sign In or Register"
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="hidden lg:inline text-xs font-semibold">Sign In</span>
            </button>
          )}

          {/* Shopping Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-xs sm:text-sm transition-all shadow-xs active:scale-95 min-h-[40px]"
            aria-label="View shopping cart"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {totalCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-400 text-gray-950 text-[11px] font-bold flex items-center justify-center leading-none">
                  {totalCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[11px] text-green-100 font-normal">Cart</span>
              <span className="font-bold text-white text-xs sm:text-sm">
                {formatBDT(subtotal)}
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
