import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ShieldCheck, Calculator, Truck } from 'lucide-react';
import { formatBDT } from '../../utils/currency';

export const TopAnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#F0FDF4] text-gray-700 text-xs py-2 px-4 border-b border-green-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Free delivery announcement */}
        <div className="flex items-center gap-2 truncate">
          <Truck className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span className="truncate">
            <span className="font-bold text-[#16A34A]">Free Delivery</span> on Solar & Electrical orders over {formatBDT(50000)}
          </span>
        </div>

        {/* Right: Hotline, Calculator, Standards */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <Link
            to="/solar-calculator"
            className="hidden md:flex items-center gap-1 text-gray-600 hover:text-[#16A34A] font-medium transition-colors"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-500" />
            <span>Solar Sizing Calculator</span>
          </Link>

          <div className="hidden sm:flex items-center gap-1 text-gray-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>BSTI & IEC Certified</span>
          </div>

          <a
            href="tel:+880170076527"
            className="flex items-center gap-1.5 font-bold text-[#16A34A] hover:text-[#15803D] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#16A34A]" />
            <span>+880 1700-SOLAR</span>
          </a>
        </div>
      </div>
    </div>
  );
};
