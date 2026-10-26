import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Zap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard,
  Send
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to BD Solar Energy updates!', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-[#0B1E13] text-gray-300 pt-14 pb-20 md:pb-12 border-t-4 border-[#15803D]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-green-900/60">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-green-900/50 border border-green-800/60 flex items-center justify-center text-amber-300 shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Tier 1 Solar Brands</h5>
              <p className="text-xs text-gray-400 mt-0.5">Trina, Jinko, Growatt, Deye & Pylontech</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-green-900/50 border border-green-800/60 flex items-center justify-center text-emerald-300 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">BSTI & IEC Certified</h5>
              <p className="text-xs text-gray-400 mt-0.5">100% genuine equipment guaranteed</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-green-900/50 border border-green-800/60 flex items-center justify-center text-green-300 shrink-0">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Free System Sizing</h5>
              <p className="text-xs text-gray-400 mt-0.5">Tailored rooftop load calculations</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-green-900/50 border border-green-800/60 flex items-center justify-center text-cyan-300 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Nationwide Delivery</h5>
              <p className="text-xs text-gray-400 mt-0.5">Fast courier to all 64 districts in BD</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-green-900/60">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#166534] to-[#15803D] flex items-center justify-center text-white shadow-md">
                <Sun className="w-5 h-5 text-amber-300" />
              </div>
              <div className="font-black text-xl text-white tracking-tight">
                BD<span className="text-[#22C55E]">SOLAR</span>
              </div>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              BD Solar Energy is Bangladesh's dedicated online marketplace for residential and commercial solar power systems, high-voltage inverters, lithium energy storage, certified cables, and industrial electrical protection gear.
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                <span>Level 7, Solar Bhaban, 42 Motijheel C/A, Dhaka-1000, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-green-400 shrink-0" />
                <span>Hotline: +880 1700-SOLAR / +880 2-9568900</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-green-400 shrink-0" />
                <span>support@bdsolarenergy.com.bd</span>
              </div>
            </div>
          </div>

          {/* Column 2: Solar Energy Systems */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Solar Equipment
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=solar-panels" className="hover:text-green-300 transition-colors">
                  Monocrystalline Panels
                </Link>
              </li>
              <li>
                <Link to="/shop?category=solar-inverters" className="hover:text-green-300 transition-colors">
                  Hybrid & On-Grid Inverters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=solar-batteries" className="hover:text-green-300 transition-colors">
                  LiFePO4 Lithium Batteries
                </Link>
              </li>
              <li>
                <Link to="/shop?category=solar-charge-controllers" className="hover:text-green-300 transition-colors">
                  MPPT Charge Controllers
                </Link>
              </li>
              <li>
                <Link to="/solar-packages" className="hover:text-green-300 transition-colors">
                  Turnkey Solar Packages
                </Link>
              </li>
              <li>
                <Link to="/system-builder" className="hover:text-green-300 transition-colors text-amber-300 font-medium">
                  Custom System Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Electrical Equipment */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Electrical Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=wires-cables" className="hover:text-green-300 transition-colors">
                  Solar DC PV Cables (4/6mm²)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=wires-cables" className="hover:text-green-300 transition-colors">
                  FR Domestic Copper Wires
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-protection" className="hover:text-green-300 transition-colors">
                  Schneider MCB & MCCB Breakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-protection" className="hover:text-green-300 transition-colors">
                  DC & AC Surge Arresters (SPD)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-protection" className="hover:text-green-300 transition-colors">
                  Automatic Transfer Switches (ATS)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-installation-tools" className="hover:text-green-300 transition-colors">
                  Fluke True-RMS Clamp Meters
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Stay Updated
            </h4>
            <p className="text-xs text-gray-400">
              Subscribe for flash discounts, solar net-metering news, and new arrivals.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 bg-green-950/80 border border-green-800 rounded-l-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-green-400"
                />
                <button
                  type="submit"
                  className="px-3 bg-[#15803D] hover:bg-[#166534] text-white rounded-r-lg transition-colors flex items-center justify-center shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="pt-2 space-y-1.5 text-xs">
              <div>
                <Link to="/shipping-policy" className="hover:text-green-300 transition-colors">
                  Shipping & Delivery Terms
                </Link>
              </div>
              <div>
                <Link to="/warranty-policy" className="hover:text-green-300 transition-colors">
                  Warranty & Return Policy
                </Link>
              </div>
              <div>
                <Link to="/faq" className="hover:text-green-300 transition-colors">
                  Frequently Asked Questions
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payment Logos & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} BD Solar Energy Ltd. All rights reserved. Built for Bangladesh.
          </div>

          {/* Payment Methods Simulation */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] text-gray-400 font-medium mr-1">Accepted Payments:</span>
            <span className="px-2 py-0.5 bg-green-950/80 border border-green-800 rounded font-semibold text-pink-400 text-[11px]">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-green-950/80 border border-green-800 rounded font-semibold text-orange-400 text-[11px]">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-green-950/80 border border-green-800 rounded font-semibold text-green-300 text-[11px]">
              Rocket
            </span>
            <span className="px-2 py-0.5 bg-green-950/80 border border-green-800 rounded font-semibold text-blue-400 text-[11px]">
              Visa / Master
            </span>
            <span className="px-2 py-0.5 bg-green-950/80 border border-green-800 rounded font-semibold text-emerald-400 text-[11px]">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
