import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Zap, 
  BatteryCharging, 
  Cable, 
  ShieldCheck, 
  Wrench, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Award, 
  Truck, 
  Headphones, 
  Flame, 
  Sliders,
  ChevronRight,
  Layers
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useCategories } from '../context/CategoryContext';

export const HomePage: React.FC = () => {
  const { categories, brands } = useCategories();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [solarPanels, setSolarPanels] = useState<Product[]>([]);
  const [invertersAndBatteries, setInvertersAndBatteries] = useState<Product[]>([]);
  const [electricalEquipment, setElectricalEquipment] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Countdown timer for Flash Deals
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featured, sale, panels, invs, bats, wires, prot] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getOnSaleProducts(),
          productService.getProductsByCategory('solar-panels'),
          productService.getProductsByCategory('solar-inverters'),
          productService.getProductsByCategory('solar-batteries'),
          productService.getProductsByCategory('wires-cables'),
          productService.getProductsByCategory('electrical-protection'),
        ]);

        setFeaturedProducts(featured.slice(0, 8));
        setOnSaleProducts(sale.slice(0, 4));
        setSolarPanels(panels.slice(0, 4));
        setInvertersAndBatteries([...invs, ...bats].slice(0, 4));
        setElectricalEquipment([...wires, ...prot].slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage catalog data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-10 sm:space-y-14 bg-[#F0FDF4] pb-12">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-[#F0FDF4] border-b border-green-200 text-gray-900 overflow-hidden py-10 sm:py-16 lg:py-20 shadow-xs">
        {/* Abstract decorative grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#15803D_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-green-200 text-[#15803D] text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Bangladesh's Leading Solar & Electrical Marketplace</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                Power Your Future with <br className="hidden sm:inline" />
                <span className="text-[#15803D]">Smart Solar</span> & Electrical Solutions
              </h1>

              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Discover tier-1 solar photovoltaic panels, intelligent hybrid inverters, LiFePO4 energy storage, and industrial electrical equipment with full warranty and certified engineering support.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <Link
                  to="/shop?category=solar-panels"
                  className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-green-700/20 flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  <span>Shop Solar Products</span>
                </Link>

                <Link
                  to="/shop?category=electrical-protection"
                  className="px-6 py-3 bg-white hover:bg-[#F0FDF4] text-[#166534] border border-green-300 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center gap-2 shadow-xs"
                >
                  <Zap className="w-4 h-4 text-[#15803D]" />
                  <span>Explore Electrical Gear</span>
                </Link>

                <Link
                  to="/system-builder"
                  className="px-5 py-3 text-[#15803D] hover:text-[#166534] font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
                >
                  <Sliders className="w-4 h-4 text-[#15803D]" />
                  <span>Build Custom System &rarr;</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-green-200 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <div className="text-lg font-extrabold text-[#15803D]">25 Years</div>
                  <div className="text-[11px] text-gray-600">Panel Yield Warranty</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#15803D]">BSTI & IEC</div>
                  <div className="text-[11px] text-gray-600">Certified Equipment</div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#15803D]">Net-Metering</div>
                  <div className="text-[11px] text-gray-600">Grid Export Ready</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white p-4 sm:p-6 rounded-3xl border-2 border-green-200 shadow-xl">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F0FDF4]">
                  <img
                    src="/images/solar-package.svg"
                    alt="Solar Energy Installation"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="px-2 py-0.5 bg-amber-400 text-gray-950 text-[10px] font-black rounded uppercase tracking-wider self-start">
                      Featured System
                    </span>
                    <h3 className="text-white font-bold text-sm sm:text-base mt-1">
                      3.5kW Urban Hybrid Solar Package
                    </h3>
                    <p className="text-green-100 text-xs">
                      Trina 585W Bifacial + Growatt Hybrid + Pylontech Lithium
                    </p>
                  </div>
                </div>

                {/* Floating Micro Highlights */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#F0FDF4] p-2.5 rounded-xl border border-green-200">
                    <div className="text-gray-500 text-[10px]">Estimated Output</div>
                    <div className="font-extrabold text-[#15803D] text-sm">15 kWh / Day</div>
                  </div>
                  <div className="bg-[#F0FDF4] p-2.5 rounded-xl border border-green-200">
                    <div className="text-gray-500 text-[10px]">Monthly Bill Savings</div>
                    <div className="font-extrabold text-[#166534] text-sm">৳5,800 / Mo</div>
                  </div>
                </div>

                <Link
                  to="/solar-packages"
                  className="mt-4 w-full py-2.5 bg-[#15803D] text-white hover:bg-[#166534] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Explore Turnkey Solar Packages</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOP CATEGORIES SHORTCUTS GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-gray-600 mt-0.5">
              High-efficiency solar solutions and heavy-duty electrical components
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-[#15803D] hover:text-[#166534] flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => {
            const catId = cat.slug || cat.id;
            return (
              <Link
                key={cat.id || cat.slug}
                to={`/shop?category=${catId}`}
                className="group p-4 bg-white rounded-2xl border border-green-200/80 hover:border-green-400 hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#F0FDF4] group-hover:bg-green-100 flex items-center justify-center text-[#15803D] mb-3 transition-colors border border-green-200">
                  {(catId === 'solar-panels' || cat.name.toLowerCase().includes('panel')) && <Sun className="w-7 h-7 text-amber-500" />}
                  {(catId === 'solar-inverters' || cat.name.toLowerCase().includes('inverter')) && <Zap className="w-7 h-7 text-[#15803D]" />}
                  {(catId === 'solar-batteries' || cat.name.toLowerCase().includes('battery')) && <BatteryCharging className="w-7 h-7 text-emerald-600" />}
                  {(catId === 'wires-cables' || cat.name.toLowerCase().includes('wire')) && <Cable className="w-7 h-7 text-blue-600" />}
                  {(catId === 'electrical-protection' || cat.name.toLowerCase().includes('protect')) && <ShieldCheck className="w-7 h-7 text-indigo-600" />}
                  {!['solar-panels', 'solar-inverters', 'solar-batteries', 'wires-cables', 'electrical-protection'].includes(catId) && <Layers className="w-7 h-7 text-[#15803D]" />}
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-[#15803D] transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-gray-500 mt-1">
                  {cat.productCount} Items
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FLASH DEALS / SPECIAL OFFERS BANNER */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#F0FDF4] border-2 border-green-300 rounded-3xl p-5 sm:p-8 text-gray-900 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[11px] flex items-center gap-1 uppercase tracking-wider animate-pulse">
                  <Flame className="w-3.5 h-3.5" />
                  Flash Deals
                </span>
                <span className="text-xs font-semibold text-[#15803D]">Limited Stock Offers</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Special Seasonal Discounts on Solar Equipment
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                Get up to 15% instant off on tier-1 bifacial modules, hybrid inverters, and BRB Solar cables with code <strong className="text-[#15803D]">BDSOLAR5</strong>.
              </p>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-green-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-[#15803D]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Hours</span>
              </div>
              <span className="text-lg font-bold text-gray-400">:</span>
              <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-green-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-[#15803D]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Mins</span>
              </div>
              <span className="text-lg font-bold text-gray-400">:</span>
              <div className="flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl border border-green-200 shadow-xs">
                <span className="text-lg sm:text-xl font-black text-[#15803D]">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Secs</span>
              </div>
            </div>
          </div>

          {/* Flash Deal Products Showcase */}
          <div className="mt-6 pt-6 border-t border-green-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {onSaleProducts.map((p) => (
              <ProductCard key={p.id} product={p} className="text-gray-900 bg-white" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. BEST-SELLING SOLAR PANELS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                High-Efficiency Solar Panels
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              N-Type TOPCon and Bifacial dual-glass modules with 25-30 year performance warranties
            </p>
          </div>
          <Link
            to="/shop?category=solar-panels"
            className="text-xs font-bold text-[#15803D] hover:text-[#166534] flex items-center gap-1"
          >
            <span>View All Panels</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {solarPanels.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. DEDICATED PROMO BANNER: TURNKEY SOLAR PACKAGES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#F0FDF4] border-2 border-green-300 rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <span className="px-3 py-1 bg-[#15803D] text-white text-xs font-bold rounded-full uppercase tracking-wider inline-block">
              Turnkey Solar Packages
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Complete Solar Systems for Homes & Factories
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Don't guess component compatibility! Our pre-engineered solar packages combine matched panels, inverters, LiFePO4 batteries, and DC protection with full installation and net-metering approval.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 justify-center lg:justify-start">
              <Link
                to="/solar-packages"
                className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-green-700/20"
              >
                Browse Solar Packages
              </Link>
              <Link
                to="/system-builder"
                className="px-6 py-3 bg-white border border-green-300 text-green-950 hover:bg-[#F0FDF4] font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
              >
                Custom System Builder
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
            <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-xs text-center">
              <div className="text-2xl font-black text-green-900">1.5kW – 10kW</div>
              <div className="text-xs text-gray-500 mt-1">Ready Packages</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-xs text-center">
              <div className="text-2xl font-black text-emerald-600">Up to 80%</div>
              <div className="text-xs text-gray-500 mt-1">Electricity Bill Cut</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-xs text-center">
              <div className="text-2xl font-black text-amber-500">6,000+</div>
              <div className="text-xs text-gray-500 mt-1">Battery Cycles</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-green-200 shadow-xs text-center">
              <div className="text-2xl font-black text-green-700">100%</div>
              <div className="text-xs text-gray-500 mt-1">Net-Metering Safe</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SOLAR INVERTERS & LITHIUM BATTERIES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#15803D]" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Solar Inverters & Storage Batteries
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Growatt, Deye, Huawei hybrid inverters and Pylontech LiFePO4 rack batteries
            </p>
          </div>
          <Link
            to="/shop?category=solar-inverters"
            className="text-xs font-bold text-[#15803D] hover:text-[#166534] flex items-center gap-1"
          >
            <span>View All Inverters</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {invertersAndBatteries.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. ELECTRICAL WIRES, CABLES & PROTECTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Wires, Cables & Electrical Protection
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Genuine BRB Solar DC cables, Schneider Acti9 MCB, MCCB, and DC Surge Protection
            </p>
          </div>
          <Link
            to="/shop?category=wires-cables"
            className="text-xs font-bold text-[#15803D] hover:text-[#166534] flex items-center gap-1"
          >
            <span>View All Electrical</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {electricalEquipment.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. FEATURED BRANDS CAROUSEL/GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Official Brand Partners & Suppliers
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            We supply 100% genuine products sourced directly from certified global and local manufacturers
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {brands.slice(0, 12).map((brand) => (
            <Link
              key={brand.id || brand.slug}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="p-4 bg-white rounded-xl border border-green-200/80 hover:border-green-400 hover:shadow-md transition-all flex flex-col items-center justify-center text-center group shadow-xs"
            >
              <div className="w-10 h-10 rounded-full bg-[#F0FDF4] group-hover:bg-green-100 border border-green-200 flex items-center justify-center text-[#15803D] font-black text-sm mb-2 transition-colors">
                {brand.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-gray-800 group-hover:text-[#15803D] transition-colors line-clamp-1">
                {brand.name}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">{brand.country}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. WHY CHOOSE BD SOLAR ENERGY */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#F0FDF4] rounded-3xl border-2 border-green-300 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-[#15803D] uppercase tracking-wider">
              Trusted Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Why Choose BD Solar Energy?
            </h2>
            <p className="text-xs text-gray-600 mt-1">
              Engineered for Bangladesh’s tropical heat, monsoons, and load-shedding challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-green-200 flex flex-col items-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-green-200 text-[#15803D] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">100% Genuine Equipment</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Direct authorized imports with verified barcodes, flash test reports, and official manufacturer warranty cards.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-green-200 flex flex-col items-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-green-200 text-[#15803D] flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Nationwide Safe Logistics</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Specialized heavy freight shipping with wooden crating for solar glass panels and lithium batteries across all 64 districts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-green-200 flex flex-col items-center text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#F0FDF4] border border-green-200 text-[#15803D] flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Certified Solar Engineers</h4>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                Complimentary load sizing, single-line diagrams, net-metering paperwork support, and after-sales maintenance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            Customer Reviews & Case Studies
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            See how solar power is transforming homes and factories across Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-green-200/90 shadow-xs hover:border-green-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {'★★★★★'}
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "Installed the 3.5kW Growatt hybrid package at our Dhanmondi duplex. Even during 3-hour power cuts, our 1.5-ton AC runs without flickering. The electricity bill dropped by ৳5,000 every month."
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-green-200 text-green-900 font-bold text-xs flex items-center justify-center">
                EH
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Engr. Enamul Hoque</div>
                <div className="text-[10px] text-gray-400">Dhanmondi, Dhaka</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-green-200/90 shadow-xs hover:border-green-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {'★★★★★'}
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "We purchased 100 meters of BRB 6mm² Solar DC cable and Schneider MCBs for our commercial rooftop project. Packaging was superb and delivery to Chittagong took just 48 hours."
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-green-200 text-green-900 font-bold text-xs flex items-center justify-center">
                AK
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Arifur Rahman Khan</div>
                <div className="text-[10px] text-gray-400">Agrabad, Chittagong</div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-green-200/90 shadow-xs hover:border-green-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex text-amber-400 mb-3">
                {'★★★★★'}
              </div>
              <p className="text-xs text-gray-700 italic leading-relaxed">
                "The interactive Solar System Builder was so easy to use! We customized our inverter and battery bank, checked the price, and placed the order. Outstanding customer care service."
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F0FDF4] border border-green-200 text-green-900 font-bold text-xs flex items-center justify-center">
                SK
              </div>
              <div>
                <div className="text-xs font-bold text-gray-900">Dr. Shamim Kabir</div>
                <div className="text-[10px] text-gray-400">Sylhet Sadar</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple helper icon
const CpuIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
  </svg>
);
