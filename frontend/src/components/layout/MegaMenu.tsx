import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  ChevronDown, 
  Sun, 
  Zap, 
  BatteryCharging, 
  Cable, 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Wrench,
  Percent
} from 'lucide-react';
import { Category } from '../../types';
import { useCategories } from '../../context/CategoryContext';

export const MegaMenu: React.FC = () => {
  const { categories } = useCategories();
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState<Category | null>(null);

  const currentHoverCategory = activeHoverCategory || (categories.length > 0 ? categories[0] : null);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-green-600" />;
      case 'BatteryCharging': return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
      case 'Cable': return <Cable className="w-4 h-4 text-blue-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'Wrench': return <Wrench className="w-4 h-4 text-orange-600" />;
      default: return <Layers className="w-4 h-4 text-green-600" />;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-xs relative z-40 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* All Categories Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={() => setIsCategoryDropdownOpen(true)}
            onMouseLeave={() => setIsCategoryDropdownOpen(false)}
          >
            <button
              className="flex items-center gap-2.5 px-4 py-3 bg-[#16A34A] text-white font-semibold text-xs uppercase tracking-wider rounded-t-md hover:bg-[#15803D] transition-colors"
            >
              <Menu className="w-4 h-4" />
              <span>All Categories</span>
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            </button>

            {/* Mega Menu Dropdown flyout */}
            {isCategoryDropdownOpen && (
              <div className="absolute top-full left-0 w-[780px] bg-white border border-gray-200 rounded-b-xl shadow-2xl flex z-50 overflow-hidden">
                {/* Left column: Categories list */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 py-2 max-h-[460px] overflow-y-auto">
                  {categories.map((cat) => (
                    <div
                      key={cat.id || cat.slug}
                      onMouseEnter={() => setActiveHoverCategory(cat)}
                      className={`flex items-center justify-between px-4 py-2.5 text-xs cursor-pointer transition-colors ${
                        currentHoverCategory?.id === cat.id
                          ? 'bg-[#F0FDF4] text-[#16A34A] font-bold border-l-4 border-[#16A34A]'
                          : 'text-gray-700 hover:bg-gray-100 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {getCategoryIcon(cat.iconName)}
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal">
                        ({cat.productCount})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right area: Subcategories and highlight card */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  {currentHoverCategory && (
                    <div>
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">
                            {currentHoverCategory.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {currentHoverCategory.description}
                          </p>
                        </div>
                        <Link
                          to={`/shop?category=${currentHoverCategory.slug || currentHoverCategory.id}`}
                          onClick={() => setIsCategoryDropdownOpen(false)}
                          className="text-xs font-semibold text-green-700 hover:text-green-900"
                        >
                          Browse all &rarr;
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                        {(currentHoverCategory.subcategories || []).map((sub) => (
                          <Link
                            key={sub.id || sub.slug}
                            to={`/shop?category=${currentHoverCategory.slug || currentHoverCategory.id}&subcategory=${sub.slug || sub.id}`}
                            onClick={() => setIsCategoryDropdownOpen(false)}
                            className="p-2.5 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50/40 transition-colors group"
                          >
                            <div className="text-xs font-semibold text-gray-800 group-hover:text-green-700">
                              {sub.name}
                            </div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {sub.productCount} products listed
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Banner at bottom of mega menu */}
                  <div className="mt-4 p-3 bg-[#F0FDF4] border border-green-200 text-gray-900 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5 text-[#16A34A]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pre-engineered Solar Packages</span>
                      </div>
                      <div className="text-[11px] text-gray-600">
                        Residential hybrid & commercial packages with 25-year warranty
                      </div>
                    </div>
                    <Link
                      to="/solar-packages"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      className="px-3 py-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded shadow-xs transition-colors"
                    >
                      View Packages
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick links along the navigation bar */}
          <Link
            to="/shop?category=solar-panels"
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-green-700 transition-colors"
          >
            Solar Panels
          </Link>
          <Link
            to="/shop?category=solar-inverters"
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-green-700 transition-colors"
          >
            Inverters
          </Link>
          <Link
            to="/shop?category=solar-batteries"
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-green-700 transition-colors"
          >
            Lithium Batteries
          </Link>
          <Link
            to="/shop?category=wires-cables"
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-green-700 transition-colors"
          >
            Wires & Cables
          </Link>
          <Link
            to="/shop?category=electrical-protection"
            className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-green-700 transition-colors"
          >
            Circuit Breakers
          </Link>
          <Link
            to="/solar-packages"
            className="px-3 py-2 text-xs font-semibold text-green-700 hover:text-green-900 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Solar Packages</span>
          </Link>
          <Link
            to="/system-builder"
            className="px-3 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-md my-1 transition-colors flex items-center gap-1 shadow-xs"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>System Builder</span>
          </Link>
        </div>

        {/* Right side special offers badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/shop?onSale=true"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors border border-rose-200"
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Special Deals</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
