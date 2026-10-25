import { Category, CategoryId } from '../types';
import { apiClient } from './apiClient';

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const res: any = await apiClient('/categories/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getCategoryById(id: CategoryId): Promise<Category | null> {
    try {
      return await apiClient(`/categories/${encodeURIComponent(id)}/`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      return await apiClient(`/categories/${encodeURIComponent(slug)}/`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },
};
