import { SolarPackage } from '../types';
import { apiClient } from './apiClient';

export const solarPackageService = {
  async getAllPackages(): Promise<SolarPackage[]> {
    const res: any = await apiClient('/solar-packages/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getPackageBySlug(slug: string): Promise<SolarPackage | null> {
    try {
      return await apiClient(`/solar-packages/${encodeURIComponent(slug)}/`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },
};
