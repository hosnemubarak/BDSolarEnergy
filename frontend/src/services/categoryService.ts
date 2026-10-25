import { CATEGORIES } from '../data/categories';
import { Category, CategoryId } from '../types';
import { apiClient, isDemoMode } from './apiClient';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...CATEGORIES]), 60);
      });
    }

    const res: any = await apiClient('/categories/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getCategoryById(id: CategoryId): Promise<Category | null> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const category = CATEGORIES.find((c) => c.id === id);
        setTimeout(() => resolve(category ? { ...category } : null), 60);
      });
    }

    try {
      return await apiClient(`/categories/${encodeURIComponent(id)}/`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const category = CATEGORIES.find((c) => c.slug === slug);
        setTimeout(() => resolve(category ? { ...category } : null), 60);
      });
    }

    try {
      return await apiClient(`/categories/${encodeURIComponent(slug)}/`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },
};
