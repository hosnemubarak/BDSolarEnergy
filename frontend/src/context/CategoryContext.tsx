import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category, Brand } from '../types';
import { categoryService } from '../services/categoryService';
import { brandService } from '../services/brandService';

interface CategoryContextType {
  categories: Category[];
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
  getCategoryById: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getBrandBySlug: (slug: string) => Brand | undefined;
  refreshCatalogData: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catList, brandList] = await Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands(),
      ]);
      setCategories(catList);
      setBrands(brandList);
    } catch (err: any) {
      console.error('Failed to load categories/brands from API', err);
      setError(err?.message || 'Failed to load catalog data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id || c.slug === id);
  };

  const getCategoryBySlug = (slug: string) => {
    return categories.find((c) => c.slug === slug || c.id === slug);
  };

  const getBrandBySlug = (slug: string) => {
    return brands.find((b) => b.slug === slug || b.id === slug || b.name === slug);
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        brands,
        isLoading,
        error,
        getCategoryById,
        getCategoryBySlug,
        getBrandBySlug,
        refreshCatalogData: loadData,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
