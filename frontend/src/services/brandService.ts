import { BRANDS } from '../data/brands';
import { Brand } from '../types';
import { apiClient, isDemoMode } from './apiClient';

export const brandService = {
  async getAllBrands(): Promise<Brand[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...BRANDS]), 50);
      });
    }

    const res: any = await apiClient('/brands/?page_size=100');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getPopularBrands(): Promise<Brand[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const popular = BRANDS.filter((b) => b.isPopular);
        setTimeout(() => resolve(popular), 50);
      });
    }

    const allBrands = await this.getAllBrands();
    return allBrands.filter((b) => b.isPopular);
  },
};
