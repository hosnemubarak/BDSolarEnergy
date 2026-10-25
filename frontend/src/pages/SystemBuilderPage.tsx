import React, { useState, useMemo } from 'react';
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
  Minus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { PRODUCTS } from '../data/products';

// Panels options
const PANEL_OPTIONS = [
  { id: 'prod-sp-01', name: 'Trina Solar Vertex S+ 585W Bifacial', watts: 585, price: 18500, image: '/images/solar-panel.svg' },
  { id: 'prod-sp-02', name: 'Jinko Solar Tiger Neo 550W Half-Cut', watts: 550, price: 16800, image: '/images/solar-panel.svg' },
  { id: 'prod-sp-03', name: 'LONGi Solar Hi-MO 6 570W Mono', watts: 570, price: 17900, image: '/images/solar-panel.svg' },
];

// Inverter options
const INVERTER_OPTIONS = [
  { id: 'prod-inv-01', name: 'Growatt SPH 6000TL 6kW Hybrid Inverter', ratedKva: 6.0, type: 'Hybrid', price: 145000, maxArrayWatts: 8000 },
  { id: 'prod-inv-02', name: 'Deye SUN-8K 8kW Low Voltage Hybrid', ratedKva: 8.0, type: 'Hybrid', price: 185000, maxArrayWatts: 10400 },
  { id: 'prod-inv-03', name: 'Huawei SUN2000 10kW Three-Phase On-Grid', ratedKva: 10.0, type: 'On-Grid', price: 215000, maxArrayWatts: 15000 },
  { id: 'prod-inv-04', name: 'Felicity Solar IVEM5048 5kVA Off-Grid', ratedKva: 5.0, type: 'Off-Grid', price: 78000, maxArrayWatts: 6000 },
];

// Battery options
const BATTERY_OPTIONS = [
  { id: 'none', name: 'No Battery (Grid-Tied Net Metering)', kwh: 0, price: 0, chemistry: 'None' },
  { id: 'prod-bat-01', name: 'Pylontech US5000 4.8kWh LiFePO4 Lithium', kwh: 4.8, price: 165000, chemistry: 'LiFePO4' },
  { id: 'prod-bat-02', name: 'Felicity Solar 10.24kWh Wall-Mount LiFePO4', kwh: 10.24, price: 295000, chemistry: 'LiFePO4' },
  { id: 'prod-bat-03', name: '2x Rahimafrooz 200Ah 12V Tubular (4.8kWh Bank)', kwh: 4.8, price: 53000, chemistry: 'Tubular' },
];

export const SystemBuilderPage: React.FC = () => {
  const [selectedPanel, setSelectedPanel] = useState(PANEL_OPTIONS[0]);
  const [panelCount, setPanelCount] = useState<number>(6);
  const [selectedInverter, setSelectedInverter] = useState(INVERTER_OPTIONS[0]);
  const [selectedBattery, setSelectedBattery] = useState(BATTERY_OPTIONS[1]);
  const [includeProtectionKit, setIncludeProtectionKit] = useState<boolean>(true);

  const { addItem, openCart } = useCart();
  const { showToast } = useToast();

  const ACCESSORIES_PRICE = 32000; // Anodized rail structure + BRB 6mm² + SPD box

  // Calculations
  const totalArrayWatts = useMemo(() => selectedPanel.watts * panelCount, [selectedPanel, panelCount]);
  
  // Daily Generation in Bangladesh: ~4.0 to 4.5 peak sun hours * 0.8 system efficiency factor
  const dailyGenerationKwh = useMemo(() => {
    return Math.round((totalArrayWatts * 4.2 * 0.8) / 100) / 10;
  }, [totalArrayWatts]);

  // Estimated monthly savings at avg Bangladesh commercial/residential tier (approx ৳11.5 per kWh)
  const monthlySavingsBdt = useMemo(() => {
    return Math.round(dailyGenerationKwh * 30 * 11.5);
  }, [dailyGenerationKwh]);

  // Total demo price
  const totalPrice = useMemo(() => {
    let cost = selectedPanel.price * panelCount;
    cost += selectedInverter.price;
    cost += selectedBattery.price;
    if (includeProtectionKit) cost += ACCESSORIES_PRICE;
    return cost;
  }, [selectedPanel, panelCount, selectedInverter, selectedBattery, includeProtectionKit]);

  // Compatibility Checks
  const compatibilityWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (totalArrayWatts > selectedInverter.maxArrayWatts) {
      warnings.push(`Array size (${totalArrayWatts}W) exceeds maximum recommended PV input for this inverter (${selectedInverter.maxArrayWatts}W).`);
    }
    if (selectedInverter.type === 'Off-Grid' && selectedBattery.id === 'none') {
      warnings.push('Off-grid inverters require a connected battery storage bank to operate.');
    }
    if (totalArrayWatts < 1200 && selectedInverter.ratedKva >= 6) {
      warnings.push('Array wattage is slightly small for a 6kVA+ inverter. You may experience low startup voltage on cloudy days.');
    }
    return warnings;
  }, [totalArrayWatts, selectedInverter, selectedBattery]);

  const handleAddBundleToCart = () => {
    // Add panel
    const panelProduct = PRODUCTS.find((p) => p.id === selectedPanel.id);
    if (panelProduct) addItem(panelProduct, panelCount);

    // Add inverter
    const invProduct = PRODUCTS.find((p) => p.id === selectedInverter.id);
    if (invProduct) addItem(invProduct, 1);

    // Add battery if selected
    if (selectedBattery.id !== 'none') {
      const batProduct = PRODUCTS.find((p) => p.id === selectedBattery.id);
      if (batProduct) addItem(batProduct, 1);
    }

    // Add cable/protection kit
    if (includeProtectionKit) {
      const cableProduct = PRODUCTS.find((p) => p.id === 'prod-cb-01');
      if (cableProduct) addItem(cableProduct, 1);
    }

    showToast('Custom solar system components added to cart!', 'success');
    openCart();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'Solar Packages', url: '/solar-packages' },
          { label: 'Interactive System Builder' },
        ]}
      />

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Solar System Configurator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Design Your Custom Solar & Battery Solution
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Select solar panels, inverter capacity, lithium energy storage, and safety accessories. Instant wattage, daily kWh, and pricing calculations.
          </p>
        </div>
      </div>

      {/* Builder Workspace: Left Configurator (7 cols) + Right Live Analytics (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Step by Step Selector */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: SOLAR PANELS */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-sm sm:text-base text-gray-900">
                  Select Solar Panels & Quantity
                </h3>
              </div>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                Array: {totalArrayWatts} Wp ({ (totalArrayWatts / 1000).toFixed(2) } kWp)
              </span>
            </div>

            {/* Panels Choices */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PANEL_OPTIONS.map((panel) => (
                <div
                  key={panel.id}
                  onClick={() => setSelectedPanel(panel)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    selectedPanel.id === panel.id
                      ? 'border-[#6D28D9] bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 uppercase">
                      {panel.watts}W Module
                    </span>
                    <h5 className="font-bold text-xs text-gray-900 mt-1 line-clamp-2">
                      {panel.name}
                    </h5>
                  </div>
                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900">৳{panel.price.toLocaleString('en-BD')}</span>
                    {selectedPanel.id === panel.id && (
                      <CheckCircle2 className="w-4 h-4 text-[#6D28D9]" />
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
                  className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-base font-black text-purple-950 w-8 text-center">
                  {panelCount}
                </span>
                <button
                  type="button"
                  onClick={() => setPanelCount((c) => Math.min(24, c + 2))}
                  className="w-8 h-8 rounded-lg bg-white border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* STEP 2: SOLAR INVERTER */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center">
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
              {INVERTER_OPTIONS.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInverter(inv)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedInverter.id === inv.id
                      ? 'border-[#6D28D9] bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#6D28D9] flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-gray-900">{inv.name}</h5>
                      <div className="text-[11px] text-gray-500 flex items-center gap-2">
                        <span className="text-purple-700 font-semibold">{inv.type} Topology</span>
                        <span>•</span>
                        <span>Max PV: {inv.maxArrayWatts}W</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-extrabold text-purple-950">
                      ৳{inv.price.toLocaleString('en-BD')}
                    </div>
                    {selectedInverter.id === inv.id && (
                      <span className="text-[10px] text-[#6D28D9] font-bold">Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3: BATTERY STORAGE */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center">
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
              {BATTERY_OPTIONS.map((bat) => (
                <div
                  key={bat.id}
                  onClick={() => setSelectedBattery(bat)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedBattery.id === bat.id
                      ? 'border-[#6D28D9] bg-purple-50/50 shadow-sm'
                      : 'border-gray-200 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <BatteryCharging className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-gray-900">{bat.name}</h5>
                      <div className="text-[11px] text-gray-500">
                        {bat.kwh > 0 ? `${bat.chemistry} Chemistry` : 'Export directly to grid with net-metering'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-extrabold text-purple-950">
                      {bat.price > 0 ? `৳${bat.price.toLocaleString('en-BD')}` : '৳0'}
                    </div>
                    {selectedBattery.id === bat.id && (
                      <span className="text-[10px] text-[#6D28D9] font-bold">Selected</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 4: ACCESSORIES & DC PROTECTION */}
          <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#6D28D9] text-white text-xs font-bold flex items-center justify-center">
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
                className="w-5 h-5 text-[#6D28D9] rounded focus:ring-purple-400 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Right: Real-time System Metrics & Summary Card */}
        <div className="lg:col-span-5 sticky top-24 space-y-5">
          <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-gray-900 text-base">
                System Performance Estimate
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold text-[10px] uppercase">
                Demo Simulation
              </span>
            </div>

            {/* Calculations Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
                <span className="text-gray-500 block text-[11px]">Total Solar Array</span>
                <span className="text-lg font-black text-purple-950">{totalArrayWatts} Wp</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">({panelCount}x {selectedPanel.watts}W)</span>
              </div>

              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
                <span className="text-gray-500 block text-[11px]">Daily Generation</span>
                <span className="text-lg font-black text-purple-950">~{dailyGenerationKwh} kWh</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">4.2 Peak Sun Hours</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-emerald-700 block text-[11px]">Est. Monthly Savings</span>
                <span className="text-lg font-black text-emerald-900">৳{monthlySavingsBdt.toLocaleString('en-BD')}</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">Off Utility Bill</span>
              </div>

              <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100">
                <span className="text-gray-500 block text-[11px]">Battery Storage</span>
                <span className="text-lg font-black text-purple-950">{selectedBattery.kwh} kWh</span>
                <span className="text-[10px] text-gray-400 block mt-0.5">{selectedBattery.chemistry}</span>
              </div>
            </div>

            {/* Selected Components Line-Items */}
            <div className="pt-2 space-y-2 text-xs border-t border-gray-100">
              <div className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                Configured System Components:
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{panelCount}x {selectedPanel.name}</span>
                <span className="font-semibold text-gray-900">৳{(selectedPanel.price * panelCount).toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>1x {selectedInverter.name}</span>
                <span className="font-semibold text-gray-900">৳{selectedInverter.price.toLocaleString('en-BD')}</span>
              </div>
              {selectedBattery.id !== 'none' && (
                <div className="flex justify-between text-gray-600">
                  <span>1x {selectedBattery.name}</span>
                  <span className="font-semibold text-gray-900">৳{selectedBattery.price.toLocaleString('en-BD')}</span>
                </div>
              )}
              {includeProtectionKit && (
                <div className="flex justify-between text-gray-600">
                  <span>Mounting Structure & Protection Kit</span>
                  <span className="font-semibold text-gray-900">৳{ACCESSORIES_PRICE.toLocaleString('en-BD')}</span>
                </div>
              )}
            </div>

            {/* Compatibility Warning Box (if any) */}
            {compatibilityWarnings.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Engineering Notice:</span>
                </div>
                {compatibilityWarnings.map((w, idx) => (
                  <p key={idx} className="text-[11px] leading-tight">• {w}</p>
                ))}
              </div>
            )}

            {/* Final Total Price */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500 block">Total System Demo Price</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#4C1D95]">
                    ৳{totalPrice.toLocaleString('en-BD')}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold">
                  Free Shipping Eligible
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleAddBundleToCart}
              className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 active:scale-98"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Complete System to Cart</span>
            </button>

            {/* Notice */}
            <p className="text-[11px] text-gray-400 text-center leading-tight">
              *All solar configurations are demo examples until an engineer performs an on-site rooftop azimuth and tilt survey.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
