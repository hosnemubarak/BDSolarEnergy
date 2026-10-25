import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  ChevronDown, 
  Phone, 
  Sun, 
  Zap, 
  Calculator, 
  ShieldCheck, 
  HelpCircle,
  PackageCheck,
  User,
  LogOut
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { useAuth } from '../../context/AuthContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const { user, logout, setIsAuthModalOpen } = useAuth();

  if (!isOpen) return null;

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 bottom-0 left-0 w-5/6 max-w-sm bg-white shadow-2xl flex flex-col z-50 overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 bg-[#4C1D95] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6D28D9] flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-extrabold text-sm tracking-wide">BD SOLAR ENERGY</div>
              <div className="text-[10px] text-purple-200">Power & Electrical Systems</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-purple-800 text-purple-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Bar in Drawer */}
        <div className="p-3 bg-purple-50 border-b border-purple-100 flex items-center justify-between">
          {user ? (
            <div className="flex items-center justify-between w-full">
              <Link
                to="/account"
                onClick={onClose}
                className="flex items-center gap-2 text-xs font-semibold text-purple-950"
              >
                <div className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div>{user.name}</div>
                  <div className="text-[10px] text-gray-500 font-normal">View Account</div>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="p-1.5 text-gray-400 hover:text-rose-600"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2 px-3 bg-[#6D28D9] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Login / Register Customer Account</span>
            </button>
          )}
        </div>

        {/* Scrollable Categories & Links */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {/* Quick Primary Links */}
          <div className="p-2 space-y-1">
            <Link
              to="/solar-packages"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-purple-900 bg-purple-50/70 hover:bg-purple-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4 text-purple-700" />
                <span>Turnkey Solar Packages</span>
              </div>
              <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                HOT
              </span>
            </Link>

            <Link
              to="/system-builder"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Interactive Solar Builder</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <Link
              to="/solar-calculator"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>Solar Sizing Calculator</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>

          {/* Catalog Categories Accordion */}
          <div className="py-2">
            <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Browse Categories
            </div>
            {CATEGORIES.map((cat) => {
              const isExpanded = expandedCategoryId === cat.id;
              return (
                <div key={cat.id}>
                  <div
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-purple-700" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="bg-gray-50/80 px-4 py-2 space-y-2 border-y border-gray-100">
                      <Link
                        to={`/shop?category=${cat.id}`}
                        onClick={onClose}
                        className="block text-xs font-bold text-[#6D28D9] pb-1 border-b border-gray-200"
                      >
                        All in {cat.name} &rarr;
                      </Link>
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/shop?category=${cat.id}&subcategory=${sub.id}`}
                          onClick={onClose}
                          className="block text-xs text-gray-600 hover:text-purple-700 py-1 pl-2"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Institutional & Support Links */}
          <div className="p-3 space-y-1">
            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-900"
            >
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>About BD Solar Energy</span>
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-900"
            >
              <Phone className="w-4 h-4 text-gray-400" />
              <span>Contact Showroom & Support</span>
            </Link>
            <Link
              to="/faq"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:text-gray-900"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
              <span>FAQ & Net Metering</span>
            </Link>
          </div>
        </div>

        {/* Drawer Bottom Support Hotline */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
          <div className="text-[11px] text-gray-500">Need Immediate Help?</div>
          <a
            href="tel:+880170076527"
            className="text-xs font-bold text-[#4C1D95] hover:underline"
          >
            +880 1700-SOLAR (76527)
          </a>
        </div>
      </div>
    </div>
  );
};
