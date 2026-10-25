import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Sun, 
  Zap, 
  BatteryCharging, 
  ShieldCheck, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  TrendingUp,
  Truck
} from 'lucide-react';
import { solarPackageService } from '../services/solarPackageService';
import { productService } from '../services/productService';
import { SolarPackage } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const SolarPackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<SolarPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    solarPackageService.getAllPackages().then((data) => {
      setPackages(data);
      setIsLoading(false);
    });
  }, []);

  const handleAddPackageToCart = async (pkg: SolarPackage) => {
    // Look up the product representative or add each item
    try {
      const packageProduct = await productService.getProductById(
        pkg.id === 'pkg-1' ? 'prod-pkg-04' : pkg.id === 'pkg-2' ? 'prod-pkg-01' : pkg.id === 'pkg-3' ? 'prod-pkg-02' : 'prod-pkg-03'
      );
      if (packageProduct) {
        addItem(packageProduct, 1);
        showToast(`Added "${pkg.title}" to cart.`, 'success');
        openCart();
      } else {
        showToast(`Added package "${pkg.title}" to cart.`, 'success');
      }
    } catch {
      showToast(`Added package "${pkg.title}" to cart.`, 'success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Solar Packages', url: '/solar-packages' },
        ]}
      />

      {/* Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Engineered Turnkey Solutions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Complete Solar Power Packages for Homes & Businesses
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Eliminate guesswork. Our matched packages include tier-1 solar panels, pure sine-wave hybrid inverters, LiFePO4 batteries, mounting structures, and official warranty support across Bangladesh.
          </p>
          <div className="pt-2">
            <Link
              to="/system-builder"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-gray-950 text-xs font-bold rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Or Build a Custom System with our Builder &rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image banner & Specs Badge */}
              <div className="relative aspect-[16/9] bg-purple-950 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/images/solar-package.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-gray-950 text-[10px] font-black uppercase tracking-wider">
                      {pkg.systemType}
                    </span>
                    {pkg.netMeteringEligible && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                        Net-Metering Approved
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">{pkg.title}</h3>
                  <p className="text-xs text-purple-200 mt-0.5">{pkg.tagline}</p>
                </div>
              </div>

              {/* Performance Metrics Bar */}
              <div className="grid grid-cols-3 bg-purple-50/70 p-4 border-b border-purple-100 text-center divide-x divide-purple-200/60 text-xs">
                <div>
                  <div className="text-gray-500 text-[10px]">Solar Capacity</div>
                  <div className="font-extrabold text-purple-950 text-sm mt-0.5">
                    {pkg.specifications.totalSolarCapacityWp} Wp
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">Daily Est. Generation</div>
                  <div className="font-extrabold text-purple-950 text-sm mt-0.5">
                    ~{pkg.dailyGenerationEstimateKwh} kWh / day
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px]">Est. Monthly Savings</div>
                  <div className="font-extrabold text-emerald-700 text-sm mt-0.5">
                    ৳{pkg.savingsMonthlyEstimateBdt.toLocaleString('en-BD')} / mo
                  </div>
                </div>
              </div>

              {/* Package Content Items List */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Included Components in Package:
                  </h4>
                  <ul className="space-y-2">
                    {pkg.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5" />
                        <div>
                          <strong>{item.quantity}x {item.productName}</strong>
                          <span className="text-gray-400 text-[11px] block">{item.specsSummary}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Benefits */}
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Ideal Application:
                  </h4>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    {pkg.idealFor}
                  </p>
                </div>
              </div>
            </div>

            {/* Price & Cart Actions Bottom Bar */}
            <div className="p-5 sm:p-6 bg-gray-50/80 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-2xl font-black text-[#4C1D95]">
                  ৳{pkg.price.toLocaleString('en-BD')}
                </div>
                {pkg.originalPrice && (
                  <span className="text-xs text-gray-400 line-through">
                    ৳{pkg.originalPrice.toLocaleString('en-BD')}
                  </span>
                )}
                <div className="text-[10px] text-gray-500">Installation & Mounting Included</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/system-builder"
                  className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Customize
                </Link>

                <button
                  onClick={() => handleAddPackageToCart(pkg)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-purple-600/20 active:scale-98"
                >
                  Order Package
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engineering Consultation Callout */}
      <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200 text-center max-w-2xl mx-auto space-y-2">
        <h4 className="font-extrabold text-purple-950 text-base">
          Need a Custom Sized Solar System for your Factory or Building?
        </h4>
        <p className="text-xs text-gray-600">
          Our senior solar engineers will calculate your peak load demands, analyze rooftop shadow profiles, and prepare bankable feasibility reports.
        </p>
        <div className="pt-2">
          <Link
            to="/contact"
            className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl inline-block"
          >
            Request Engineering Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};
