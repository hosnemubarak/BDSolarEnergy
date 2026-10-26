import { Product, ProductFilterParams, CategoryId } from '../types';
import { apiClient } from './apiClient';

/**
 * Service to manage products.
 * Connects directly to the Django REST Framework backend API (/api/v1/products/).
 */
export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const res: any = await apiClient('/products/?page_size=100');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product: Product = await apiClient(`/products/${encodeURIComponent(id)}/`);
      return product;
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const product: Product = await apiClient(`/products/${encodeURIComponent(slug)}/`);
      return product;
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  },

  async getProductsByCategory(categoryId: CategoryId): Promise<Product[]> {
    const res: any = await apiClient(`/products/?category=${encodeURIComponent(categoryId)}&page_size=100`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return [];
    const res: any = await apiClient(`/products/?ids=${encodeURIComponent(ids.join(','))}&page_size=100`);
    return Array.isArray(res) ? res : res.results || [];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const res: any = await apiClient('/products/featured/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getNewArrivals(): Promise<Product[]> {
    const res: any = await apiClient('/products/new-arrivals/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getOnSaleProducts(): Promise<Product[]> {
    const res: any = await apiClient('/products/on-sale/');
    return Array.isArray(res) ? res : res.results || [];
  },

  async getRelatedProducts(currentProductId: string, categoryId: CategoryId, limit = 4): Promise<Product[]> {
    try {
      const res: any = await apiClient(`/products/${encodeURIComponent(currentProductId)}/related/`);
      return Array.isArray(res) ? res.slice(0, limit) : (res.results || []).slice(0, limit);
    } catch {
      const catProducts = await this.getProductsByCategory(categoryId);
      return catProducts.filter((p) => p.id !== currentProductId).slice(0, limit);
    }
  },

  async searchProducts(query: string, limit = 8): Promise<Product[]> {
    if (!query.trim()) return [];
    const res: any = await apiClient(`/products/?search=${encodeURIComponent(query)}&page_size=${limit}`);
    const items: Product[] = Array.isArray(res) ? res : res.results || [];
    return items.slice(0, limit);
  },

  async filterProducts(params: ProductFilterParams): Promise<{ products: Product[]; total: number }> {
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
