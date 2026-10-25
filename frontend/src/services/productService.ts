import { PRODUCTS } from '../data/products';
import { Product, ProductFilterParams, CategoryId } from '../types';
import { apiClient, isDemoMode } from './apiClient';

/**
 * Service to manage products.
 * Connects directly to the Django REST Framework backend API (/api/v1/products/).
 * If VITE_USE_DEMO_DATA=true, uses local demo data.
 */
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...PRODUCTS]), 80);
      });
    }

    const res: any = await apiClient('/products/?page_size=100');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getProductById(id: string): Promise<Product | null> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const product = PRODUCTS.find((p) => p.id === id);
        setTimeout(() => resolve(product ? { ...product } : null), 60);
      });
    }

    try {
      const product: Product = await apiClient(`/products/${encodeURIComponent(id)}/`);
      return product;
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const product = PRODUCTS.find((p) => p.slug === slug);
        setTimeout(() => resolve(product ? { ...product } : null), 60);
      });
    }

    try {
      const product: Product = await apiClient(`/products/${encodeURIComponent(slug)}/`);
      return product;
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getProductsByCategory(categoryId: CategoryId): Promise<Product[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const filtered = PRODUCTS.filter((p) => p.categoryId === categoryId);
        setTimeout(() => resolve(filtered), 80);
      });
    }

    const res: any = await apiClient(`/products/?category=${encodeURIComponent(categoryId)}&page_size=100`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const featured = PRODUCTS.filter((p) => p.isFeatured || p.isBestSeller);
        setTimeout(() => resolve(featured), 60);
      });
    }

    const res: any = await apiClient('/products/featured/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getNewArrivals(): Promise<Product[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const news = PRODUCTS.filter((p) => p.isNewArrival || p.badges?.includes('NEW'));
        setTimeout(() => resolve(news), 60);
      });
    }

    const res: any = await apiClient('/products/new-arrivals/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getOnSaleProducts(): Promise<Product[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const onSale = PRODUCTS.filter((p) => p.isOnSale || (p.originalPrice && p.originalPrice > p.price));
        setTimeout(() => resolve(onSale), 60);
      });
    }

    const res: any = await apiClient('/products/on-sale/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getRelatedProducts(currentProductId: string, categoryId: CategoryId, limit = 4): Promise<Product[]> {
    if (isDemoMode()) {
      return new Promise((resolve) => {
        const related = PRODUCTS.filter(
          (p) => p.categoryId === categoryId && p.id !== currentProductId
        ).slice(0, limit);
        setTimeout(() => resolve(related), 60);
      });
    }

    try {
      const res: any = await apiClient(`/products/${encodeURIComponent(currentProductId)}/related/`);
      return Array.isArray(res) ? res.slice(0, limit) : (res.results || []).slice(0, limit);
    } catch {
      // Fallback to category list if related action fails
      const catProducts = await this.getProductsByCategory(categoryId);
      return catProducts.filter((p) => p.id !== currentProductId).slice(0, limit);
    }
  },

  async searchProducts(query: string, limit = 8): Promise<Product[]> {
    if (!query.trim()) return [];

    if (isDemoMode()) {
      const q = query.toLowerCase().trim();
      return new Promise((resolve) => {
        const results = PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.shortDescription?.toLowerCase().includes(q)
        ).slice(0, limit);
        setTimeout(() => resolve(results), 80);
      });
    }

    const res: any = await apiClient(`/products/?search=${encodeURIComponent(query)}&page_size=${limit}`);
    const items: Product[] = Array.isArray(res) ? res : res.results || [];
    return items.slice(0, limit);
  },

  async filterProducts(params: ProductFilterParams): Promise<{ products: Product[]; total: number }> {
    if (isDemoMode()) {
      let filtered = [...PRODUCTS];

      if (params.category) {
        filtered = filtered.filter((p) => p.categoryId === params.category);
      }
      if (params.subcategory) {
        filtered = filtered.filter((p) => p.subcategoryId === params.subcategory);
      }
      if (params.brand && params.brand.length > 0) {
        filtered = filtered.filter((p) => params.brand?.includes(p.brand));
      }
      if (params.minPrice !== undefined) {
        filtered = filtered.filter((p) => p.price >= (params.minPrice || 0));
      }
      if (params.maxPrice !== undefined) {
        filtered = filtered.filter((p) => p.price <= (params.maxPrice || Infinity));
      }
      if (params.inStockOnly) {
        filtered = filtered.filter((p) => p.inStock);
      }
      if (params.featuredOnly) {
        filtered = filtered.filter((p) => p.isFeatured);
      }
      if (params.onSaleOnly) {
        filtered = filtered.filter((p) => p.isOnSale || (p.originalPrice && p.originalPrice > p.price));
      }
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        );
      }

      // Sorting
      if (params.sortBy) {
        switch (params.sortBy) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
          case 'popularity':
            filtered.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          case 'newest':
          default:
            break;
        }
      }

      return new Promise((resolve) => {
        setTimeout(() => resolve({ products: filtered, total: filtered.length }), 100);
      });
    }

    // Build URL query string for Django REST Framework
    const queryParts: string[] = ['page_size=100'];

    if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
    if (params.subcategory) queryParts.push(`subcategory=${encodeURIComponent(params.subcategory)}`);
    if (params.brand && params.brand.length > 0) queryParts.push(`brand=${encodeURIComponent(params.brand.join(','))}`);
    if (params.minPrice !== undefined) queryParts.push(`min_price=${params.minPrice}`);
    if (params.maxPrice !== undefined) queryParts.push(`max_price=${params.maxPrice}`);
    if (params.inStockOnly) queryParts.push('in_stock=true');
    if (params.featuredOnly) queryParts.push('is_featured=true');
    if (params.onSaleOnly) queryParts.push('is_on_sale=true');
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          queryParts.push('ordering=price');
          break;
        case 'price-desc':
          queryParts.push('ordering=-price');
          break;
        case 'rating':
          queryParts.push('ordering=-rating');
          break;
        case 'popularity':
          queryParts.push('ordering=-review_count');
          break;
        case 'newest':
          queryParts.push('ordering=-created_at');
          break;
      }
    }

    const queryString = queryParts.join('&');
    const res: any = await apiClient(`/products/?${queryString}`);
    const products: Product[] = Array.isArray(res) ? res : res.results || [];
    const total: number = Array.isArray(res) ? res.length : (res.count || products.length);

    return { products, total };
  },
};
