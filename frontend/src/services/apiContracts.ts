/**
 * BD Solar Energy — API Contract Specification
 *
 * This document defines the HTTP REST API contracts that will replace
 * the in-memory/localStorage demo services when connecting to a production backend.
 */

export { API_BASE_URL } from './apiClient';

export const API_ENDPOINTS = {
  // Products
  GET_PRODUCTS: '/api/v1/products',
  GET_PRODUCT_BY_SLUG: (slug: string) => `/api/v1/products/${slug}`,
  GET_PRODUCT_BY_ID: (id: string) => `/api/v1/products/id/${id}`,
  GET_FEATURED_PRODUCTS: '/api/v1/products/featured',
  GET_RELATED_PRODUCTS: (id: string) => `/api/v1/products/${id}/related`,
  SEARCH_PRODUCTS: '/api/v1/products/search',

  // Categories & Brands
  GET_CATEGORIES: '/api/v1/categories',
  GET_CATEGORY_BY_SLUG: (slug: string) => `/api/v1/categories/${slug}`,
  GET_BRANDS: '/api/v1/brands',

  // Solar Packages & Sizing
  GET_SOLAR_PACKAGES: '/api/v1/solar-packages',
  GET_SOLAR_PACKAGE_BY_SLUG: (slug: string) => `/api/v1/solar-packages/${slug}`,
  CALCULATE_SYSTEM_SIZING: '/api/v1/solar-calculator/estimate',

  // Authentication & Profile
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  GET_CURRENT_USER: '/api/v1/auth/me',
  UPDATE_PROFILE: '/api/v1/auth/profile',

  // Cart & Inventory
  SYNC_CART: '/api/v1/cart/sync',
  VALIDATE_STOCK: '/api/v1/inventory/validate-stock',
  VALIDATE_COUPON: '/api/v1/coupons/validate',

  // Orders & Checkout
  CREATE_ORDER: '/api/v1/orders',
  GET_USER_ORDERS: '/api/v1/orders',
  GET_ORDER_BY_NUMBER: (orderNumber: string) => `/api/v1/orders/${orderNumber}`,
  TRACK_ORDER: (trackingNumber: string) => `/api/v1/orders/track/${trackingNumber}`,
};
