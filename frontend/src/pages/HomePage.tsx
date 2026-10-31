import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  Zap, 
  BatteryCharging, 
  Cable, 
  ShieldCheck, 
  ChevronRight,
  Layers,
  Sparkles,
  Calculator,
  Sliders,
  Truck
} from 'lucide-react';
import { productService } from '../services/productService';
import { solarPackageService } from '../services/solarPackageService';
import { Product, SolarPackage } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useCategories } from '../context/CategoryContext';
import { Price } from '../components/common/Price';
import { formatBDT } from '../utils/currency';

export const HomePage: React.FC = () => {
  const { categories, brands } = useCategories();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [solarPanels, setSolarPanels] = useState<Product[]>([]);
  const [invertersAndBatteries, setInvertersAndBatteries] = useState<Product[]>([]);
  const [electricalEquipment, setElectricalEquipment] = useState<Product[]>([]);
  const [solarPackages, setSolarPackages] = useState<SolarPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featured, panels, invs, bats, wires, prot, packages] = await Promise.all([
          productService.getFeaturedProducts(),
          productService.getProductsByCategory('solar-panels'),
          productService.getProductsByCategory('solar-inverters'),
          productService.getProductsByCategory('solar-batteries'),
          productService.getProductsByCategory('wires-cables'),
          productService.getProductsByCategory('electrical-protection'),
          solarPackageService.getAllPackages(),
        ]);

        setFeaturedProducts(featured.slice(0, 8));
        setSolarPanels(panels.slice(0, 4));
        setInvertersAndBatteries([...invs, ...bats].slice(0, 4));
        setElectricalEquipment([...wires, ...prot].slice(0, 4));
        setSolarPackages(packages.slice(0, 4));
      } catch (err) {
        console.error('Error loading homepage catalog data', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8 sm:space-y-10">
      
      {/* 1. COMPACT HERO & PROMOTIONAL SHOWCASE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
        {/* Main Showcase Banner (8 cols) */}
        <div className="lg:col-span-8 bg-[#F0FDF4] border border-green-200/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs relative overflow-hidden group">
          {/* Subtle Ambient Background Watermark */}
          <div className="absolute right-6 bottom-0 opacity-15 pointer-events-none hidden sm:block text-[#16A34A]">
            <Sun className="w-52 h-52 stroke-1" />
          </div>

          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-green-200 text-[#16A34A] text-xs sm:text-sm font-semibold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tier-1 Solar Photovoltaic & Industrial Electrical Equipment</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight leading-snug">
              Smart Solar Solutions for Homes, Duplexes & Commercial Plants
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed">
              Genuine N-Type TOPCon bifacial modules, hybrid pure sine-wave inverters, and LiFePO4 rack batteries with official warranty across Bangladesh.
            </p>
          </div>

          <div className="relative z-10 pt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Link
                to="/shop"
                className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm sm:text-base rounded-lg transition-all shadow-xs flex items-center gap-1.5 active:scale-98"
              >
                <span>Shop All Equipment</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                to="/solar-calculator"
                className="px-3.5 py-2 bg-white hover:bg-green-50 text-gray-800 hover:text-[#16A34A] font-semibold text-sm sm:text-base rounded-lg border border-green-200 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Calculator className="w-4 h-4 text-amber-500" />
                <span>Load Sizing Calculator</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600 pt-2.5 border-t border-green-200/80 font-medium">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#16A34A]" />
                <span>Free Nationwide Delivery &gt;</span>
                <Price amount={50000} className="font-semibold text-gray-800" symbolClassName="font-black text-[#16A34A]" />
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                BSTI & IEC Certified
              </span>
              <span className="hidden sm:inline opacity-40">•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#16A34A]" />
                Net-Metering Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: 2 Compact Promo Cards (4 cols) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-3.5">
          {/* Promo Card 1: Turnkey Packages */}
          <Link
            to="/solar-packages"
            className="p-4 rounded-2xl bg-white hover:bg-green-50/40 border border-green-200/80 hover:border-green-400 hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Pre-Engineered
                </span>
                <span className="text-sm font-bold text-[#16A34A] group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ChevronRight className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-[#16A34A] transition-colors">
                Turnkey Solar Packages
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                Complete 3kW to 10kW residential & commercial systems with panels, inverters & battery storage.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-[#16A34A]">
              <span>Ready for Immediate Deployment</span>
              <span className="text-xs text-gray-400">1-Click Order</span>
            </div>
          </Link>

          {/* Promo Card 2: Interactive System Builder */}
          <Link
            to="/system-builder"
            className="p-4 rounded-2xl bg-white hover:bg-green-50/40 border border-green-200/80 hover:border-green-400 hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                  <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                  Custom Configuration
                </span>
                <span className="text-sm font-bold text-[#16A34A] group-hover:translate-x-0.5 transition-transform flex items-center">
                  Build <ChevronRight className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 group-hover:text-[#16A34A] transition-colors">
                Solar System Builder
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                Select your solar panels, hybrid inverter & lithium battery bank with live wattage verification.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm font-semibold text-gray-700">
              <span>Tailor Components to Your Roof</span>
              <span className="text-xs sm:text-sm text-[#16A34A] font-bold">Try Builder →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 2. EXPLORE BY CATEGORY CARDS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              High-efficiency solar solutions and heavy-duty electrical components
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.slice(0, 6).map((cat) => {
            const catId = cat.slug || cat.id;
            return (
              <Link
                key={cat.id || cat.slug}
                to={`/shop?category=${catId}`}
                className="group p-3.5 sm:p-4 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-card-hover transition-smooth flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-[#F0FDF4] border border-gray-100 group-hover:border-green-200 flex items-center justify-center text-[#16A34A] mb-2.5 transition-colors">
                  {(catId === 'solar-panels' || cat.name.toLowerCase().includes('panel')) && <Sun className="w-6 h-6 text-amber-500" />}
                  {(catId === 'solar-inverters' || cat.name.toLowerCase().includes('inverter')) && <Zap className="w-6 h-6 text-[#16A34A]" />}
                  {(catId === 'solar-batteries' || cat.name.toLowerCase().includes('battery')) && <BatteryCharging className="w-6 h-6 text-emerald-600" />}
                  {(catId === 'wires-cables' || cat.name.toLowerCase().includes('wire')) && <Cable className="w-6 h-6 text-blue-600" />}
                  {(catId === 'electrical-protection' || cat.name.toLowerCase().includes('protect')) && <ShieldCheck className="w-6 h-6 text-indigo-600" />}
                  {!['solar-panels', 'solar-inverters', 'solar-batteries', 'wires-cables', 'electrical-protection'].includes(catId) && <Layers className="w-6 h-6 text-[#16A34A]" />}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                  {cat.productCount} Items
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Verified tier-1 modules, pure sine-wave hybrid inverters, and accessories
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. SOLAR PANELS */}
      {solarPanels.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  High-Efficiency Solar Panels
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                N-Type TOPCon and Bifacial dual-glass modules with 25-year yield warranties
              </p>
            </div>
            <Link
              to="/shop?category=solar-panels"
              className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View All Panels</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {solarPanels.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. SOLAR INVERTERS & BATTERIES */}
      {invertersAndBatteries.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#16A34A]" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Solar Inverters & Storage Batteries
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Growatt, Deye, Huawei hybrid inverters and Pylontech LiFePO4 rack batteries
              </p>
            </div>
            <Link
              to="/shop?category=solar-inverters"
              className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View Inverters</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {invertersAndBatteries.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. ELECTRICAL WIRES, CABLES & PROTECTION */}
      {electricalEquipment.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Wires, Cables & Electrical Protection
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Genuine BRB Solar DC cables, Schneider Acti9 MCB, MCCB, and DC Surge Protection
              </p>
            </div>
            <Link
              to="/shop?category=wires-cables"
              className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View All Electrical</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {electricalEquipment.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. TURNKEY SOLAR PACKAGES */}
      {solarPackages.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Turnkey Solar Packages
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Pre-engineered complete solar systems with matched components & full warranty
              </p>
            </div>
            <Link
              to="/solar-packages"
              className="text-xs sm:text-sm font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>All Packages</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {solarPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-card-hover transition-smooth p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded text-xs sm:text-sm font-semibold bg-[#F0FDF4] text-[#16A34A] border border-green-200">
                      {pkg.specifications?.totalSolarCapacityWp ? `${pkg.specifications.totalSolarCapacityWp}Wp` : pkg.systemType}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-500 truncate max-w-[140px]">{pkg.idealFor}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1">{pkg.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">{pkg.tagline}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs sm:text-sm text-gray-500 block">Complete System</span>
                    <Price
                      amount={pkg.price}
                      className="text-lg sm:text-xl font-bold text-gray-900"
                      symbolClassName="text-[#16A34A] text-xl"
                    />
                  </div>
                  <Link
                    to="/solar-packages"
                    className="px-3.5 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs sm:text-sm font-semibold transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. BRAND PARTNERS */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-gray-700 uppercase tracking-wider">
            Official Brand Partners & Suppliers
          </h2>
          <span className="text-xs sm:text-sm text-gray-500">100% Genuine Authorized Sourcing</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {brands.slice(0, 8).map((brand) => (
            <Link
              key={brand.id || brand.slug}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="p-2.5 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors flex flex-col items-center justify-center text-center group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#F0FDF4] flex items-center justify-center text-gray-700 group-hover:text-[#16A34A] font-bold text-sm mb-1.5 transition-colors">
                {brand.name.charAt(0)}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-[#16A34A] transition-colors truncate w-full">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
