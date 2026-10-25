import { Brand } from '../types';
import { apiClient } from './apiClient';

export const brandService = {
  async getAllBrands(): Promise<Brand[]> {
    const res: any = await apiClient('/brands/?page_size=100');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getPopularBrands(): Promise<Brand[]> {
    const allBrands = await this.getAllBrands();
    return allBrands.filter((b) => b.isPopular);
  },
};
