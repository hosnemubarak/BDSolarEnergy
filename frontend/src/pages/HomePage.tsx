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
  Sparkles
} from 'lucide-react';
import { productService } from '../services/productService';
import { solarPackageService } from '../services/solarPackageService';
import { Product, SolarPackage } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { useCategories } from '../context/CategoryContext';

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
      
      {/* 1. COMPACT PROMOTIONAL STRIP */}
      <section className="bg-[#F0FDF4] border border-green-200/80 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-8 h-8 rounded-lg bg-white border border-green-200 flex items-center justify-center text-[#16A34A] shrink-0 hidden sm:flex">
            <Zap className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div>
            <span className="font-bold text-gray-900 text-xs sm:text-sm">
              Tier-1 Solar Panels, Inverters & Storage Batteries
            </span>
            <span className="text-gray-600 text-xs block sm:inline sm:ml-2">
              Free nationwide delivery on orders over ৳50,000 • Net-metering ready
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-[#16A34A] bg-white px-2.5 py-1 rounded-md border border-green-200">
            Coupon: <strong>BDSOLAR5</strong> (5% OFF)
          </span>
          <Link
            to="/shop"
            className="px-3.5 py-1 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs flex items-center gap-1"
          >
            <span>Shop All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. EXPLORE BY CATEGORY CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-gray-500">
              High-efficiency solar solutions and heavy-duty electrical components
            </p>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {categories.slice(0, 6).map((cat) => {
            const catId = cat.slug || cat.id;
            return (
              <Link
                key={cat.id || cat.slug}
                to={`/shop?category=${catId}`}
                className="group p-3 sm:p-3.5 bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-xs transition-all flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-[#F0FDF4] border border-gray-100 group-hover:border-green-200 flex items-center justify-center text-[#16A34A] mb-2 transition-colors">
                  {(catId === 'solar-panels' || cat.name.toLowerCase().includes('panel')) && <Sun className="w-6 h-6 text-amber-500" />}
                  {(catId === 'solar-inverters' || cat.name.toLowerCase().includes('inverter')) && <Zap className="w-6 h-6 text-[#16A34A]" />}
                  {(catId === 'solar-batteries' || cat.name.toLowerCase().includes('battery')) && <BatteryCharging className="w-6 h-6 text-emerald-600" />}
                  {(catId === 'wires-cables' || cat.name.toLowerCase().includes('wire')) && <Cable className="w-6 h-6 text-blue-600" />}
                  {(catId === 'electrical-protection' || cat.name.toLowerCase().includes('protect')) && <ShieldCheck className="w-6 h-6 text-indigo-600" />}
                  {!['solar-panels', 'solar-inverters', 'solar-batteries', 'wires-cables', 'electrical-protection'].includes(catId) && <Layers className="w-6 h-6 text-[#16A34A]" />}
                </div>
                <h3 className="font-semibold text-xs text-gray-900 group-hover:text-[#16A34A] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  {cat.productCount} Items
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                Featured Products
              </h2>
              <p className="text-xs text-gray-500">
                Verified tier-1 modules, pure sine-wave hybrid inverters, and accessories
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  High-Efficiency Solar Panels
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                N-Type TOPCon and Bifacial dual-glass modules with 25-year yield warranties
              </p>
            </div>
            <Link
              to="/shop?category=solar-panels"
              className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View All Panels</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-[#16A34A]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Solar Inverters & Storage Batteries
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Growatt, Deye, Huawei hybrid inverters and Pylontech LiFePO4 rack batteries
              </p>
            </div>
            <Link
              to="/shop?category=solar-inverters"
              className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View Inverters</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Wires, Cables & Electrical Protection
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Genuine BRB Solar DC cables, Schneider Acti9 MCB, MCCB, and DC Surge Protection
              </p>
            </div>
            <Link
              to="/shop?category=wires-cables"
              className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>View All Electrical</span>
              <ChevronRight className="w-3.5 h-3.5" />
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                  Turnkey Solar Packages
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Pre-engineered complete solar systems with matched components & full warranty
              </p>
            </div>
            <Link
              to="/solar-packages"
              className="text-xs font-semibold text-[#16A34A] hover:text-[#15803D] flex items-center gap-1"
            >
              <span>All Packages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {solarPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-xs transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F0FDF4] text-[#16A34A] border border-green-200">
                      {pkg.specifications?.totalSolarCapacityWp ? `${pkg.specifications.totalSolarCapacityWp}Wp` : pkg.systemType}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 truncate max-w-[120px]">{pkg.idealFor}</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">{pkg.title}</h3>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">{pkg.tagline}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Complete System</span>
                    <span className="text-sm font-extrabold text-gray-900">৳{pkg.price.toLocaleString('en-BD')}</span>
                  </div>
                  <Link
                    to="/solar-packages"
                    className="px-2.5 py-1 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-colors"
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
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Official Brand Partners & Suppliers
          </h2>
          <span className="text-[11px] text-gray-400">100% Genuine Authorized Sourcing</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {brands.slice(0, 8).map((brand) => (
            <Link
              key={brand.id || brand.slug}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors flex flex-col items-center justify-center text-center group"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#F0FDF4] flex items-center justify-center text-gray-700 group-hover:text-[#16A34A] font-bold text-xs mb-1 transition-colors">
                {brand.name.charAt(0)}
              </div>
              <span className="text-[10px] font-medium text-gray-700 group-hover:text-[#16A34A] transition-colors truncate w-full">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
