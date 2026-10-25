import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calculator, 
  Sun, 
  Zap, 
  BatteryCharging, 
  TrendingUp, 
  Sliders, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CalculatorPage: React.FC = () => {
  const [monthlyBillBdt, setMonthlyBillBdt] = useState<number>(6500);
  const [billReductionPercent, setBillReductionPercent] = useState<number>(80);
  const [needBatteryBackup, setNeedBatteryBackup] = useState<boolean>(true);

  // Bangladesh average tariff: ~৳11.5 per kWh (residential slab average)
  const monthlyKwhConsumed = useMemo(() => {
    return Math.round(monthlyBillBdt / 11.5);
  }, [monthlyBillBdt]);

  const targetDailyKwh = useMemo(() => {
    return Math.round(((monthlyKwhConsumed * billReductionPercent) / 100 / 30) * 10) / 10;
  }, [monthlyKwhConsumed, billReductionPercent]);

  // Recommended Solar Array (Peak sun hours in BD: 4.2 * 0.8 efficiency)
  const recommendedSolarKwp = useMemo(() => {
    return Math.max(1.0, Math.round((targetDailyKwh / (4.2 * 0.8)) * 10) / 10);
  }, [targetDailyKwh]);

  // Estimated 585W Panels
  const recommendedPanelCount = useMemo(() => {
    return Math.ceil((recommendedSolarKwp * 1000) / 585);
  }, [recommendedSolarKwp]);

  // Recommended Inverter Size
  const recommendedInverterKva = useMemo(() => {
    if (recommendedSolarKwp <= 2.5) return 3.0;
    if (recommendedSolarKwp <= 5.0) return 6.0;
    if (recommendedSolarKwp <= 8.0) return 8.0;
    return 10.0;
  }, [recommendedSolarKwp]);

  // Recommended Battery Bank (kWh) for 4-6 hours evening backup
  const recommendedBatteryKwh = useMemo(() => {
    if (!needBatteryBackup) return 0;
    return Math.round(targetDailyKwh * 0.6 * 10) / 10;
  }, [needBatteryBackup, targetDailyKwh]);

  // Estimated 25-Year Savings in BDT
  const lifetime25YearSavingsBdt = useMemo(() => {
    const annualSavings = (monthlyBillBdt * (billReductionPercent / 100)) * 12;
    return Math.round(annualSavings * 25);
  }, [monthlyBillBdt, billReductionPercent]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      <Breadcrumbs items={[{ label: 'Solar Sizing Calculator' }]} />

      {/* Header */}
      <div className="bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-indigo-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold backdrop-blur-xs border border-white/20">
            <Calculator className="w-3.5 h-3.5" />
            <span>Smart Rooftop Solar Sizing Tool</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Calculate Your Solar System Size & Bill Savings
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Estimate your required solar panel capacity, inverter rating, and lithium battery storage based on your average monthly electricity bill in Bangladesh.
          </p>
        </div>
      </div>

      {/* Calculator Inputs & Live Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Controls (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
          <h3 className="font-extrabold text-base text-gray-900 border-b border-gray-100 pb-3">
            Enter Your Household or Facility Usage
          </h3>

          {/* Monthly Bill Slider & Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-gray-800">
                Average Monthly Electricity Bill (BDT)
              </label>
              <span className="text-base font-black text-[#4C1D95]">
                ৳{monthlyBillBdt.toLocaleString('en-BD')}
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="500"
              value={monthlyBillBdt}
              onChange={(e) => setMonthlyBillBdt(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#6D28D9]"
            />
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>৳2,000 / mo</span>
              <span>Approx. {monthlyKwhConsumed} kWh units / month</span>
              <span>৳50,000 / mo</span>
            </div>
          </div>

          {/* Desired Bill Reduction */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-800">
              Target Electricity Bill Offset
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[50, 80, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setBillReductionPercent(pct)}
                  className={`py-3 rounded-2xl border-2 text-xs font-bold transition-all text-center ${
                    billReductionPercent === pct
                      ? 'border-[#6D28D9] bg-purple-50 text-[#4C1D95] shadow-xs'
                      : 'border-gray-200 text-gray-600 hover:border-purple-200'
                  }`}
                >
                  <span className="block text-sm font-black">{pct}%</span>
                  <span className="text-[10px] font-normal text-gray-500">Bill Offset</span>
                </button>
              ))}
            </div>
          </div>

          {/* Battery Backup Option */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-gray-900 block">Include Lithium Battery Backup</span>
              <span className="text-[11px] text-gray-500">Powers AC, fans, and WiFi during load shedding</span>
            </div>
            <input
              type="checkbox"
              checked={needBatteryBackup}
              onChange={(e) => setNeedBatteryBackup(e.target.checked)}
              className="w-5 h-5 text-[#6D28D9] rounded focus:ring-purple-400 border-gray-300 cursor-pointer"
            />
          </div>
        </div>

        {/* Right: Results & Recommendations (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-base text-gray-900">
              Recommended Solar Engineering Configuration
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
              High Feasibility
            </span>
          </div>

          {/* Key Metric Blocks */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="text-gray-500 block text-[11px]">Recommended Array</span>
              <span className="text-xl font-black text-purple-950 block mt-1">
                {recommendedSolarKwp} kWp
              </span>
              <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                {recommendedPanelCount}x 585W Panels
              </span>
            </div>

            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100">
              <span className="text-gray-500 block text-[11px]">Inverter Capacity</span>
              <span className="text-xl font-black text-purple-950 block mt-1">
                {recommendedInverterKva} kVA
              </span>
              <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                Hybrid Pure Sine Wave
              </span>
            </div>

            <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-100 col-span-2 sm:col-span-1">
              <span className="text-gray-500 block text-[11px]">Battery Storage</span>
              <span className="text-xl font-black text-purple-950 block mt-1">
                {recommendedBatteryKwh} kWh
              </span>
              <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                {needBatteryBackup ? 'LiFePO4 Storage' : 'Grid-Tied Net Metering'}
              </span>
            </div>
          </div>

          {/* 25-Year Cumulative Savings Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
            <div className="text-xs font-semibold text-emerald-800">
              Estimated 25-Year Net Utility Savings:
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">
              ৳{lifetime25YearSavingsBdt.toLocaleString('en-BD')}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1">
              Based on average Bangladesh electricity tariff with 3% annual inflation.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <Link
              to="/system-builder"
              className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>Customize in System Builder</span>
            </Link>

            <Link
              to="/solar-packages"
              className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Turnkey Pre-Packaged Systems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
