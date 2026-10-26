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
    <footer className="bg-[#F8FAFC] text-gray-600 pt-10 pb-20 md:pb-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#16A34A] shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Tier 1 Solar Brands</h5>
              <p className="text-xs text-gray-500">Trina, Jinko, Growatt & Deye</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#16A34A] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">BSTI & IEC Certified</h5>
              <p className="text-xs text-gray-500">100% genuine equipment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#16A34A] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Expert Sizing Support</h5>
              <p className="text-xs text-gray-500">Engineered rooftop calculations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-[#16A34A] shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Nationwide Delivery</h5>
              <p className="text-xs text-gray-500">Fast courier across 64 districts</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-b border-gray-200">
          {/* Column 1: Brand Info */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#16A34A] flex items-center justify-center text-white">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <div className="font-extrabold text-lg text-gray-900 tracking-tight">
                BD<span className="text-[#16A34A]">SOLAR</span>
              </div>
            </Link>

            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              BD Solar Energy is Bangladesh's dedicated online store for solar panels, inverters, lithium batteries, cables, and electrical protection equipment.
            </p>

            <div className="space-y-1.5 text-xs text-gray-600 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>Level 7, Solar Bhaban, Motijheel, Dhaka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>Hotline: +880 1700-SOLAR</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>support@bdsolarenergy.com.bd</span>
              </div>
            </div>
          </div>

          {/* Column 2: Solar Energy Systems */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Solar Equipment
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=solar-panels" className="hover:text-[#16A34A] transition-colors">
                  Solar Photovoltaic Panels
                </Link>
              </li>
              <li>
                <Link to="/shop?category=solar-inverters" className="hover:text-[#16A34A] transition-colors">
                  Hybrid & On-Grid Inverters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=solar-batteries" className="hover:text-[#16A34A] transition-colors">
                  LiFePO4 Lithium Batteries
                </Link>
              </li>
              <li>
                <Link to="/solar-packages" className="hover:text-[#16A34A] transition-colors">
                  Turnkey Solar Packages
                </Link>
              </li>
              <li>
                <Link to="/system-builder" className="hover:text-[#16A34A] transition-colors text-[#16A34A] font-semibold">
                  Custom System Builder &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Electrical Equipment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Electrical Products
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=wires-cables" className="hover:text-[#16A34A] transition-colors">
                  Solar DC PV Cables (4/6mm²)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=wires-cables" className="hover:text-[#16A34A] transition-colors">
                  Domestic & Industrial Wires
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-protection" className="hover:text-[#16A34A] transition-colors">
                  Schneider MCB & MCCB Breakers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-protection" className="hover:text-[#16A34A] transition-colors">
                  Surge Protective Devices (SPD)
                </Link>
              </li>
              <li>
                <Link to="/shop?category=electrical-protection" className="hover:text-[#16A34A] transition-colors">
                  Automatic Transfer Switches (ATS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Order Tracking */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/account" className="hover:text-[#16A34A] transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-[#16A34A] transition-colors">
                  Shipping & Delivery Terms
                </Link>
              </li>
              <li>
                <Link to="/warranty-policy" className="hover:text-[#16A34A] transition-colors">
                  Warranty & Return Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#16A34A] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#16A34A] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>

            <form onSubmit={handleSubscribe} className="pt-2 space-y-1.5">
              <span className="text-xs font-semibold text-gray-700 block">Newsletter:</span>
              <div className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-l-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#16A34A]"
                />
                <button
                  type="submit"
                  className="px-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-r-lg transition-colors flex items-center justify-center shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar: Payment Logos & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>
            &copy; {new Date().getFullYear()} BD Solar Energy Ltd. All rights reserved.
          </div>

          {/* Accepted Payment Methods */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center text-xs">
            <span className="text-gray-400 mr-1">Payments:</span>
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded font-semibold text-pink-600">
              bKash
            </span>
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded font-semibold text-orange-600">
              Nagad
            </span>
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded font-semibold text-blue-600">
              Card
            </span>
            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded font-semibold text-[#16A34A]">
              Cash on Delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
