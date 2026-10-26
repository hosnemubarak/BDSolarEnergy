import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Grid, 
  List, 
  ArrowUpDown, 
  Search, 
  X, 
  RotateCcw,
  PackageOpen,
  ChevronDown
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product, ProductFilterParams, CategoryId } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilters } from '../components/product/ProductFilters';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useCategories } from '../context/CategoryContext';

export const ShopPage: React.FC = () => {
  const { categories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract params from URL
  const categoryParam = (searchParams.get('category') as CategoryId) || undefined;
  const subcategoryParam = searchParams.get('subcategory') || undefined;
  const brandParam = searchParams.getAll('brand');
  const searchParam = searchParams.get('search') || undefined;
  const onSaleParam = searchParams.get('onSale') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<ProductFilterParams>({
    category: categoryParam,
    subcategory: subcategoryParam,
    brand: brandParam.length ? brandParam : undefined,
    search: searchParam,
    onSaleOnly: onSaleParam || undefined,
    sortBy: 'popularity',
  });

  // Keep internal filter state synchronized if URL search parameters change
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: categoryParam,
      subcategory: subcategoryParam,
      brand: brandParam.length ? brandParam : undefined,
      search: searchParam,
      onSaleOnly: onSaleParam || undefined,
    }));
  }, [categoryParam, subcategoryParam, searchParam, onSaleParam, searchParams]);

  // Load products based on filters
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    productService.filterProducts(filters).then((res) => {
      if (isMounted) {
        setProducts(res.products);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.subcategory) count++;
    if (filters.brand?.length) count += filters.brand.length;
    if (filters.search) count++;
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
    if (filters.inStockOnly) count++;
    if (filters.onSaleOnly) count++;
    if (filters.solarWattsMin) count++;
    if (filters.inverterType?.length) count += filters.inverterType.length;
    if (filters.batteryChemistry?.length) count += filters.batteryChemistry.length;
    if (filters.breakerPoles?.length) count += filters.breakerPoles.length;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({ sortBy: 'popularity' });
    setSearchParams({});
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value as any,
    }));
  };

  const currentCategory = categories.find((c) => c.id === filters.category || c.slug === filters.category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Shop Catalog', url: '/shop' },
          ...(currentCategory
            ? [{ label: currentCategory.name, url: `/shop?category=${currentCategory.slug || currentCategory.id}` }]
            : []),
          ...(filters.subcategory
            ? [{ label: currentCategory?.subcategories.find((s) => s.id === filters.subcategory || s.slug === filters.subcategory)?.name || filters.subcategory }]
            : []),
        ]}
      />

      {/* Header Title & Summary Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {currentCategory ? currentCategory.name : 'All Solar & Electrical Equipment'}
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            {currentCategory
              ? currentCategory.description
              : 'Browse our complete catalog of certified solar panels, hybrid inverters, lithium batteries, wires, cables, and circuit breakers.'}
          </p>
          {filters.search && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-900 text-xs font-medium border border-green-200">
              <span>Matching search: <strong>"{filters.search}"</strong></span>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, search: undefined }))}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Product Count & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
            {products.length} Products Found
          </span>

          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3 py-1.5 bg-[#15803D] text-white rounded-lg text-xs font-bold shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters ({activeFilterCount})</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Sorting & Grid/List Toggle */}
      <div className="flex items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-600 shadow-xs">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold text-gray-700">Sort by:</span>
          <select
            value={filters.sortBy || 'popularity'}
            onChange={handleSortChange}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs text-gray-800 font-medium focus:outline-none focus:border-[#15803D] cursor-pointer"
          >
            <option value="popularity">Most Popular / Best Selling</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>

        <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-xs text-green-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-xs text-green-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-1 sticky top-24">
          <ProductFilters
            filters={filters}
            onChange={(updated) => setFilters(updated)}
            onReset={handleResetFilters}
            activeCount={activeFilterCount}
          />
        </aside>

        {/* Mobile Filters Modal Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="relative w-5/6 max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col p-4 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                <h3 className="font-bold text-base text-gray-900">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onChange={(updated) => setFilters(updated)}
                onReset={handleResetFilters}
                activeCount={activeFilterCount}
              />

              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="mt-6 w-full py-3 bg-[#15803D] text-white font-bold text-xs rounded-xl shadow-md"
              >
                Apply Filters ({products.length} Results)
              </button>
            </div>
          </div>
        )}

        {/* Products Grid / Results Area */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse space-y-4"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                  : 'space-y-4'
              }
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                No matching solar or electrical equipment found
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your specific filters. Try widening your price range or resetting selected brands.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
