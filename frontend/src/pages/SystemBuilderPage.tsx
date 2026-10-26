import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sliders, 
  Sun, 
  Zap, 
  BatteryCharging, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShoppingCart, 
  ArrowRight,
  Sparkles,
  Layers,
  Plus,
  Minus,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { productService } from '../services/productService';
import { Product } from '../types';
import { formatBDT } from '../utils/currency';

interface PanelChoice {
  product: Product;
  id: string;
  name: string;
  watts: number;
  price: number;
  image: string;
}

interface InverterChoice {
  product: Product;
  id: string;
  name: string;
  ratedKva: number;
  type: string;
  price: number;
  maxArrayWatts: number;
}

interface BatteryChoice {
  product?: Product;
  id: string;
  name: string;
  kwh: number;
  price: number;
  chemistry: string;
}

export const SystemBuilderPage: React.FC = () => {
  const [panelOptions, setPanelOptions] = useState<PanelChoice[]>([]);
  const [inverterOptions, setInverterOptions] = useState<InverterChoice[]>([]);
  const [batteryOptions, setBatteryOptions] = useState<BatteryChoice[]>([]);
  const [accessoryProduct, setAccessoryProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedPanel, setSelectedPanel] = useState<PanelChoice | null>(null);
  const [panelCount, setPanelCount] = useState<number>(6);
  const [selectedInverter, setSelectedInverter] = useState<InverterChoice | null>(null);
  const [selectedBattery, setSelectedBattery] = useState<BatteryChoice | null>(null);
  const [includeProtectionKit, setIncludeProtectionKit] = useState<boolean>(true);

  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const ACCESSORIES_PRICE = accessoryProduct ? accessoryProduct.price : 32000;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      productService.getProductsByCategory('solar-panels'),
      productService.getProductsByCategory('solar-inverters'),
      productService.getProductsByCategory('solar-batteries'),
      productService.getProductsByCategory('electrical-protection'),
    ])
      .then(([panels, inverters, batteries, protectionItems]) => {
        if (!isMounted) return;

        const mappedPanels: PanelChoice[] = panels.map((p) => ({
          product: p,
          id: p.id,
          name: p.name,
          watts: p.specifications?.ratedPowerW || 550,
          price: p.price,
          image: p.image || '/images/solar-panel.svg',
        }));

        const mappedInverters: InverterChoice[] = inverters.map((p) => {
          const kva = p.specifications?.ratedOutputKva || 6.0;
          return {
            product: p,
            id: p.id,
            name: p.name,
            ratedKva: kva,
            type: p.specifications?.inverterType || 'Hybrid',
            price: p.price,
            maxArrayWatts: kva * 1300,
          };
        });

        const noBattery: BatteryChoice = {
          id: 'none',
          name: 'No Battery (Grid-Tied Net Metering)',
          kwh: 0,
          price: 0,
          chemistry: 'None',
        };

        const mappedBatteries: BatteryChoice[] = [
          noBattery,
          ...batteries.map((p) => {
            const kwh =
              p.specifications?.usableEnergyKwh ||
              (p.specifications?.nominalVoltageV && p.specifications?.capacityAh
                ? Math.round((p.specifications.nominalVoltageV * p.specifications.capacityAh) / 100) / 10
                : 4.8);
            return {
              product: p,
              id: p.id,
              name: p.name,
              kwh,
              price: p.price,
              chemistry: p.specifications?.batteryChemistry || 'LiFePO4',
            };
          }),
        ];

        setPanelOptions(mappedPanels);
        setInverterOptions(mappedInverters);
        setBatteryOptions(mappedBatteries);

        if (protectionItems.length > 0) {
          setAccessoryProduct(protectionItems[0]);
        }

        if (mappedPanels.length > 0) setSelectedPanel(mappedPanels[0]);
        if (mappedInverters.length > 0) setSelectedInverter(mappedInverters[0]);
        if (mappedBatteries.length > 1) setSelectedBattery(mappedBatteries[1]);
        else if (mappedBatteries.length > 0) setSelectedBattery(mappedBatteries[0]);

        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load system builder products', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculations
  const totalArrayWatts = useMemo(() => {
    return selectedPanel ? selectedPanel.watts * panelCount : 0;
  }, [selectedPanel, panelCount]);
  
  // Daily Generation in Bangladesh: ~4.0 to 4.5 peak sun hours * 0.8 system efficiency factor
  const dailyGenerationKwh = useMemo(() => {
    return Math.round((totalArrayWatts * 4.2 * 0.8) / 100) / 10;
  }, [totalArrayWatts]);

  // Estimated monthly savings at avg Bangladesh commercial/residential tier (approx ৳11.5 per kWh)
  const monthlySavingsBdt = useMemo(() => {
    return Math.round(dailyGenerationKwh * 30 * 11.5);
  }, [dailyGenerationKwh]);

  // Total system price
  const totalPrice = useMemo(() => {
    let cost = 0;
    if (selectedPanel) cost += selectedPanel.price * panelCount;
    if (selectedInverter) cost += selectedInverter.price;
    if (selectedBattery) cost += selectedBattery.price;
    if (includeProtectionKit) cost += ACCESSORIES_PRICE;
    return cost;
  }, [selectedPanel, panelCount, selectedInverter, selectedBattery, includeProtectionKit, ACCESSORIES_PRICE]);

  // Compatibility Checks
  const compatibilityWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (selectedInverter && totalArrayWatts > selectedInverter.maxArrayWatts) {
      warnings.push(`Array size (${totalArrayWatts}W) exceeds maximum recommended PV input for this inverter (${selectedInverter.maxArrayWatts}W).`);
    }
    if (selectedInverter?.type === 'Off-Grid' && selectedBattery?.id === 'none') {
      warnings.push('Off-grid inverters require a connected battery storage bank to operate.');
    }
    if (selectedInverter && totalArrayWatts < 1200 && selectedInverter.ratedKva >= 6) {
      warnings.push('Array wattage is slightly small for a 6kVA+ inverter. You may experience low startup voltage on cloudy days.');
    }
    return warnings;
  }, [totalArrayWatts, selectedInverter, selectedBattery]);

  const handleAddBundleToCart = () => {
    if (!selectedPanel || !selectedInverter) {
      showToast('Please select solar panels and an inverter.', 'error');
      return;
    }

    // Add panel
    addItem(selectedPanel.product, panelCount);

    // Add inverter
    addItem(selectedInverter.product, 1);

    // Add battery if selected
    if (selectedBattery?.product && selectedBattery.id !== 'none') {
      addItem(selectedBattery.product, 1);
    }

    // Add cable/protection kit
    if (includeProtectionKit && accessoryProduct) {
      addItem(accessoryProduct, 1);
    }

    showToast('Custom solar system components added to cart!', 'success');
    openCart();
  };

  if (isLoading || !selectedPanel || !selectedInverter || !selectedBattery) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
        <p className="text-xs text-gray-500">Loading solar system builder components from catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Solar Packages', url: '/solar-packages' },
          { label: 'Interactive System Builder' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-[#F8FAFC] border border-gray-200 rounded-2xl p-6 sm:p-8 text-gray-900">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] text-xs font-semibold border border-green-200">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Solar System Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
            Design Your Custom Solar & Battery Solution
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Select solar panels, inverter capacity, lithium energy storage, and safety accessories. Instant wattage, daily kWh, and pricing calculations.
          </p>
        </div>
      </div>

      {/* Builder Workspace: Left Configurator (7 cols) + Right Live Analytics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Step by Step Selector */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: SOLAR PANELS */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm sm:text-base text-gray-900">
                  Select Solar Panels & Quantity
                </h3>
              </div>
              <span className="text-xs font-bold text-[#16A34A] bg-[#F0FDF4] px-2.5 py-1 rounded-md">
                Array: {totalArrayWatts} Wp ({ (totalArrayWatts / 1000).toFixed(2) } kWp)
              </span>
            </div>

            {/* Panels Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {panelOptions.map((panel) => (
                <div
                  key={panel.id}
                  onClick={() => setSelectedPanel(panel)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPanel.id === panel.id
                      ? 'border-[#16A34A] bg-green-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-[#16A34A] uppercase">
                      {panel.watts}W Module
                    </span>
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-900 mt-1 line-clamp-2">
                      {panel.name}
                    </h5>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-gray-900">{formatBDT(panel.price)}</span>
                    {selectedPanel.id === panel.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity Stepper */}
            <div className="pt-2 flex items-center justify-between bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div>
                <span className="text-xs font-bold text-gray-800 block">Number of Panels</span>
                <span className="text-[11px] text-gray-500">Each panel generates ~{selectedPanel.watts}W peak</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPanelCount((c) => Math.max(2, c - 2))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-gray-900 w-8 text-center">
                  {panelCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPanelCount((c) => Math.min(24, c + 2))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: SOLAR INVERTER */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-sm sm:text-base text-gray-900">
                  Select Solar Inverter
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {selectedInverter.ratedKva}kVA ({selectedInverter.type})
              </span>
            </div>

            <div className="space-y-2.5">
              {inverterOptions.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInverter(inv)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedInverter.id === inv.id
                      ? 'border-[#16A34A] bg-green-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 text-[#16A34A] flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-gray-900">{inv.name}</h5>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <span className="text-[#16A34A] font-semibold">{inv.type} Topology</span>
                        <span>•</span>
                        <span>Max PV: {inv.maxArrayWatts}W</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatBDT(inv.price)}
                    </div>
                    {selectedInverter.id === inv.id && (
                      <span className="text-xs text-[#16A34A] font-semibold">Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: BATTERY STORAGE */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-sm sm:text-base text-gray-900">
                  Select Battery Storage Bank
                </h3>
              </div>
              <span className="text-xs font-semibold text-gray-500">
                {selectedBattery.kwh > 0 ? `${selectedBattery.kwh} kWh Storage` : 'No Battery'}
              </span>
            </div>

            <div className="space-y-2.5">
              {batteryOptions.map((bat) => (
                <div
                  key={bat.id}
                  onClick={() => setSelectedBattery(bat)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedBattery.id === bat.id
                      ? 'border-[#16A34A] bg-green-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center shrink-0">
                      <BatteryCharging className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs sm:text-sm text-gray-900">{bat.name}</h5>
                      <div className="text-xs text-gray-500">
                        {bat.kwh > 0 ? `${bat.chemistry} Chemistry` : 'Export directly to grid with net-metering'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatBDT(bat.price)}
                    </div>
                    {selectedBattery.id === bat.id && (
                      <span className="text-xs text-[#16A34A] font-semibold">Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: ACCESSORIES & DC PROTECTION */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    Mounting Structure, DC SPD & Cables Kit
                  </h3>
                  <p className="text-xs text-gray-500">
                    Anodized aluminum rails, 50m BRB 6mm² Solar cable, and Chint 1000V DC SPD box
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={includeProtectionKit}
                onChange={(e) => setIncludeProtectionKit(e.target.checked)}
                className="w-5 h-5 text-[#16A34A] rounded focus:ring-green-400 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Right: Real-time System Metrics & Summary Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">
                System Performance Estimate
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#16A34A] font-bold text-[10px] uppercase border border-green-200">
                Calculated Estimate
              </span>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 bg-[#F0FDF4] rounded-xl border border-green-100">
                <span className="text-gray-500 block text-xs">Total Solar Array</span>
                <span className="text-base sm:text-lg font-bold text-gray-900">{totalArrayWatts} Wp</span>
                <span className="text-xs text-gray-400 block mt-0.5">({panelCount}x {selectedPanel.watts}W)</span>
              </div>

              <div className="p-3 bg-[#F0FDF4] rounded-xl border border-green-100">
                <span className="text-gray-500 block text-xs">Daily Generation</span>
                <span className="text-base sm:text-lg font-bold text-gray-900">~{dailyGenerationKwh} kWh</span>
                <span className="text-xs text-gray-400 block mt-0.5">4.2 Peak Sun Hours</span>
              </div>

              <div className="p-3 bg-[#F0FDF4] rounded-xl border border-green-100">
                <span className="text-emerald-700 block text-xs">Est. Monthly Savings</span>
                <span className="text-base sm:text-lg font-bold text-[#16A34A]">{formatBDT(monthlySavingsBdt)}</span>
                <span className="text-xs text-emerald-600 block mt-0.5">Off Utility Bill</span>
              </div>

              <div className="p-3 bg-[#F0FDF4] rounded-xl border border-green-100">
                <span className="text-gray-500 block text-xs">Battery Storage</span>
                <span className="text-base sm:text-lg font-bold text-gray-900">{selectedBattery.kwh} kWh</span>
                <span className="text-xs text-gray-400 block mt-0.5">{selectedBattery.chemistry}</span>
              </div>
            </div>

            {/* Selected Components Line-Items */}
            <div className="pt-2 space-y-2 text-xs sm:text-sm border-t border-gray-100">
              <div className="font-bold text-gray-900 uppercase tracking-wider text-xs">
                Configured System Components:
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{panelCount}x {selectedPanel.name}</span>
                <span className="font-semibold text-gray-900">{formatBDT(selectedPanel.price * panelCount)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>1x {selectedInverter.name}</span>
                <span className="font-semibold text-gray-900">{formatBDT(selectedInverter.price)}</span>
              </div>
              {selectedBattery.id !== 'none' && (
                <div className="flex justify-between text-gray-600">
                  <span>1x {selectedBattery.name}</span>
                  <span className="font-semibold text-gray-900">{formatBDT(selectedBattery.price)}</span>
                </div>
              )}
              {includeProtectionKit && (
                <div className="flex justify-between text-gray-600">
                  <span>Mounting Structure & Protection Kit</span>
                  <span className="font-semibold text-gray-900">{formatBDT(ACCESSORIES_PRICE)}</span>
                </div>
              )}
            </div>

            {/* Compatibility Warning Box (if any) */}
            {compatibilityWarnings.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Engineering Notice:</span>
                </div>
                {compatibilityWarnings.map((w, idx) => (
                  <p key={idx} className="text-xs leading-normal">• {w}</p>
                ))}
              </div>
            )}

            {/* Final Total Price */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Total Estimated System Price</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#16A34A]">
                    {formatBDT(totalPrice)}
                  </span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
                  Free Shipping Eligible
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAddBundleToCart}
              className="w-full h-12 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold text-sm sm:text-base rounded-lg transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add Complete System to Cart</span>
            </button>

            {/* Notice */}
            <p className="text-[11px] text-gray-400 text-center leading-tight">
              *All solar configurations are engineering estimates until verified by an on-site rooftop azimuth and tilt survey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
