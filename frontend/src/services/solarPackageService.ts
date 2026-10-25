import { SOLAR_PACKAGES } from '../data/solarPackages';
import { SolarPackage } from '../types';
import { apiClient, isDemoMode } from './apiClient';

export const solarPackageService = {
  async getAllPackages(): Promise<SolarPackage[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...SOLAR_PACKAGES]), 60);
      });
    }

    const res: any = await apiClient('/solar-packages/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getPackageBySlug(slug: string): Promise<SolarPackage | null> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const pkg = SOLAR_PACKAGES.find((p) => p.slug === slug);
        setTimeout(() => resolve(pkg ? { ...pkg } : null), 60);
      });
    }

    try {
      return await apiClient(`/solar-packages/${encodeURIComponent(slug)}/`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },
};
