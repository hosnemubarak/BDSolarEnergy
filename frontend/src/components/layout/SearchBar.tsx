import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import { useCategories } from '../../context/CategoryContext';
import { formatBDT } from '../../utils/currency';

interface SearchBarProps {
  className?: string;
  onSearchSubmitted?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className = '', onSearchSubmitted }) => {
  const { categories } = useCategories();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search for suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const results = await productService.searchProducts(query, 6);
        // filter by category if chosen
        const filtered =
          selectedCategory === 'all'
            ? results
            : results.filter((p) => p.categoryId === selectedCategory);
        setSuggestions(filtered);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timeout);
  }, [query, selectedCategory]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsOpen(false);
    onSearchSubmitted?.();
    const catQuery = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
    navigate(`/shop?search=${encodeURIComponent(query.trim())}${catQuery}`);
  };

  const handleSuggestionClick = (product: Product) => {
    setIsOpen(false);
    setQuery('');
    onSearchSubmitted?.();
    navigate(`/product/${product.slug}`);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center w-full h-11 bg-white rounded-lg border-2 border-green-200 hover:border-green-400 focus-within:border-[#16A34A] focus-within:ring-2 focus-within:ring-green-100 transition-all shadow-sm overflow-hidden"
      >
        {/* Category selector dropdown for desktop */}
        <div className="hidden lg:flex items-center h-full border-r border-green-200 bg-[#F0FDF4] px-3 shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer pr-2"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.slug} value={c.slug || c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Input box */}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search solar panels, inverters, LiFePO4 batteries, cables, breakers..."
          className="flex-1 h-full px-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
        />

        {/* Clear query button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Submit Search Button */}
        <button
          type="submit"
          className="h-full px-4 sm:px-5 bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center transition-colors shrink-0 font-medium text-xs sm:text-sm gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
          {isLoading && suggestions.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              <span>Searching catalog...</span>
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Product Suggestions ({suggestions.length})
              </div>
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-green-50/60 cursor-pointer transition-colors border-b border-gray-100 last:border-none"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-md border border-gray-200 shrink-0 bg-gray-50"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/solar-panel.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <span className="text-green-700 font-medium">{item.brand}</span>
                      <span>•</span>
                      <span className="font-mono text-gray-400 truncate">{item.sku}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-gray-900">
                      {formatBDT(item.price)}
                    </div>
                    {item.originalPrice && (
                      <div className="text-xs text-gray-400 line-through">
                        {formatBDT(item.originalPrice)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className="p-2 border-t border-gray-100 bg-gray-50/70">
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="w-full py-1.5 text-xs font-semibold text-green-700 hover:text-green-900 flex items-center justify-center gap-1.5"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 text-center text-xs text-gray-500">
              No products found matching "{query}". Try checking the spelling or search by model number.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
