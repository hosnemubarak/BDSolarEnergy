import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Calculator, Truck } from 'lucide-react';

export const TopAnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#4C1D95] text-purple-100 text-[11px] sm:text-xs py-1.5 px-4 border-b border-purple-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Free delivery announcement */}
        <div className="flex items-center gap-2 truncate">
          <Truck className="w-3.5 h-3.5 text-purple-300 shrink-0" />
          <span className="truncate">
            <span className="font-semibold text-white">Free Nationwide Delivery</span> on Solar & Electrical orders over ৳50,000
          </span>
          <span className="hidden lg:inline-block px-1.5 py-0.2 bg-purple-800/80 rounded text-[10px] text-purple-200 border border-purple-700">
            Use Code: BDSOLAR5
          </span>
        </div>

        {/* Right: Hotline, Calculator, Standards */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link
            to="/solar-calculator"
            className="hidden md:flex items-center gap-1 text-purple-200 hover:text-white transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-300" />
            <span>Solar Sizing Calculator</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-purple-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>BSTI & IEC Certified</span>
          </div>

          <a
            href="tel:+880170076527"
            className="flex items-center gap-1.5 font-medium text-white hover:text-purple-200 transition-colors"
          >
            <Phone className="w-3 h-3 text-purple-300" />
            <span>+880 1700-SOLAR</span>
          </a>
        </div>
      </div>
    </div>
  );
};
