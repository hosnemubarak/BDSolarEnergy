const WISHLIST_STORAGE_KEY = 'bdsolar_wishlist_ids_v1';

export const wishlistService = {
  getStoredIds(): string[] {
    try {
      const data = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveStoredIds(ids: string[]): void {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
    } catch (err) {
      console.warn('Could not persist wishlist to localStorage', err);
    }
  },

  toggle(id: string): string[] {
    const current = this.getStoredIds();
    const index = current.indexOf(id);
    let updated: string[];
    if (index > -1) {
      updated = current.filter((item) => item !== id);
    } else {
      updated = [...current, id];
    }
    this.saveStoredIds(updated);
    return updated;
  },

  isWishlisted(id: string): boolean {
    return this.getStoredIds().includes(id);
  },
};
