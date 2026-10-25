import React from 'react';
import { Filter, X, RotateCcw, Check } from 'lucide-react';
import { ProductFilterParams, CategoryId } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { BRANDS } from '../../data/brands';

interface ProductFiltersProps {
  filters: ProductFilterParams;
  onChange: (updated: ProductFilterParams) => void;
  onReset: () => void;
  activeCount: number;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onChange,
  onReset,
  activeCount,
}) => {
  const currentCategoryObj = CATEGORIES.find((c) => c.id === filters.category);

  const handleCategorySelect = (catId?: CategoryId) => {
    onChange({
      ...filters,
      category: catId,
      subcategory: undefined, // reset subcategory on category change
    });
  };

  const handleSubcategorySelect = (subId?: string) => {
    onChange({
      ...filters,
      subcategory: subId,
    });
  };

  const handleBrandToggle = (brandName: string) => {
    const current = filters.brand || [];
    const exists = current.includes(brandName);
    const updated = exists ? current.filter((b) => b !== brandName) : [...current, brandName];
    onChange({ ...filters, brand: updated.length ? updated : undefined });
  };

  const handleInverterTypeToggle = (type: string) => {
    const current = filters.inverterType || [];
    const exists = current.includes(type);
    const updated = exists ? current.filter((t) => t !== type) : [...current, type];
    onChange({ ...filters, inverterType: updated.length ? updated : undefined });
  };

  const handleBatteryChemistryToggle = (chem: string) => {
    const current = filters.batteryChemistry || [];
    const exists = current.includes(chem);
    const updated = exists ? current.filter((c) => c !== chem) : [...current, chem];
    onChange({ ...filters, batteryChemistry: updated.length ? updated : undefined });
  };

  const handlePolesToggle = (pole: string) => {
    const current = filters.breakerPoles || [];
    const exists = current.includes(pole);
    const updated = exists ? current.filter((p) => p !== pole) : [...current, pole];
    onChange({ ...filters, breakerPoles: updated.length ? updated : undefined });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-6 shadow-xs">
      {/* Filter Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
          <Filter className="w-4 h-4 text-[#6D28D9]" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#6D28D9] text-white text-[10px] flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleCategorySelect(undefined)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
              !filters.category
                ? 'bg-purple-100/70 text-[#4C1D95] font-bold'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>All Categories</span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                filters.category === cat.id
                  ? 'bg-purple-100/70 text-[#4C1D95] font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className="text-[10px] text-gray-400">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Subcategories (when category is selected) */}
      {currentCategoryObj && currentCategoryObj.subcategories.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            {currentCategoryObj.name} Types
          </h4>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleSubcategorySelect(undefined)}
              className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                !filters.subcategory
                  ? 'text-[#6D28D9] font-bold'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              • All {currentCategoryObj.name}
            </button>
            {currentCategoryObj.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubcategorySelect(sub.id)}
                className={`w-full text-left px-2 py-1 text-xs rounded transition-colors flex items-center justify-between ${
                  filters.subcategory === sub.id
                    ? 'text-[#6D28D9] font-bold'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <span>• {sub.name}</span>
                <span className="text-[10px] text-gray-400">({sub.productCount})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Price Range Filter */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Price Range (BDT ৳)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ৳"
            value={filters.minPrice !== undefined ? filters.minPrice : ''}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-1/2 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 focus:bg-white"
          />
          <span className="text-gray-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Max ৳"
            value={filters.maxPrice !== undefined ? filters.maxPrice : ''}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-1/2 px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 focus:bg-white"
          />
        </div>
      </div>

      {/* 4. Brand Filter */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          Brands
        </h4>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {BRANDS.map((b) => {
            const isChecked = filters.brand?.includes(b.name);
            return (
              <label
                key={b.id}
                className="flex items-center gap-2 text-xs text-gray-700 hover:text-purple-950 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={!!isChecked}
                  onChange={() => handleBrandToggle(b.name)}
                  className="rounded text-[#6D28D9] focus:ring-purple-400 border-gray-300 w-3.5 h-3.5"
                />
                <span className="truncate">{b.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Category-Specific Technical Filters */}
      {/* Solar Wattage filter */}
      {(!filters.category || filters.category === 'solar-panels') && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Panel Power Output
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '500W+', min: 500 },
              { label: '550W+', min: 550 },
              { label: '580W+', min: 580 },
            ].map((opt) => (
              <button
                key={opt.min}
                type="button"
                onClick={() =>
                  onChange({
                    ...filters,
                    solarWattsMin: filters.solarWattsMin === opt.min ? undefined : opt.min,
                  })
                }
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                  filters.solarWattsMin === opt.min
                    ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Inverter Type Filter */}
      {(!filters.category || filters.category === 'solar-inverters') && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Inverter System Type
          </h4>
          <div className="space-y-1.5">
            {['Hybrid', 'On-Grid', 'Off-Grid'].map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!filters.inverterType?.includes(type)}
                  onChange={() => handleInverterTypeToggle(type)}
                  className="rounded text-[#6D28D9] focus:ring-purple-400 border-gray-300 w-3.5 h-3.5"
                />
                <span>{type} Inverters</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Battery Chemistry Filter */}
      {(!filters.category || filters.category === 'solar-batteries') && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Battery Chemistry
          </h4>
          <div className="space-y-1.5">
            {[
              { id: 'LiFePO4 (Lithium Iron)', label: 'Lithium LiFePO4' },
              { id: 'Lead Acid Tubular', label: 'Tubular Deep Cycle' },
            ].map((chem) => (
              <label
                key={chem.id}
                className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!filters.batteryChemistry?.includes(chem.id)}
                  onChange={() => handleBatteryChemistryToggle(chem.id)}
                  className="rounded text-[#6D28D9] focus:ring-purple-400 border-gray-300 w-3.5 h-3.5"
                />
                <span>{chem.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Circuit Breaker Poles Filter */}
      {(!filters.category || filters.category === 'electrical-protection') && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Breaker Poles
          </h4>
          <div className="flex gap-1.5">
            {['1P', '2P', '3P', '4P'].map((pole) => (
              <button
                key={pole}
                type="button"
                onClick={() => handlePolesToggle(pole)}
                className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                  filters.breakerPoles?.includes(pole)
                    ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {pole}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 6. Availability & Sale Toggles */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked || undefined })}
            className="rounded text-[#6D28D9] focus:ring-purple-400 border-gray-300 w-3.5 h-3.5"
          />
          <span>In Stock Items Only</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.onSaleOnly}
            onChange={(e) => onChange({ ...filters, onSaleOnly: e.target.checked || undefined })}
            className="rounded text-[#6D28D9] focus:ring-purple-400 border-gray-300 w-3.5 h-3.5"
          />
          <span>Special Deals & Offers Only</span>
        </label>
      </div>
    </div>
  );
};
