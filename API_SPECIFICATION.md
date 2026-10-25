# BD Solar Energy — Backend API Specification & Integration Handover Guide

This document defines the complete architectural contracts and REST API endpoints required to transition the **BD Solar Energy** frontend from the current service-isolated demo layer to a production backend (Node.js/Express, Python/FastAPI, Go, or Laravel).

---

## 1. Architectural Design & Zero-UI Refactoring Guarantee

The frontend was designed with an explicit **Service Layer Abstraction Pattern**:
- All UI components (e.g. `ProductCard`, `ShopPage`, `SystemBuilderPage`, `CheckoutPage`, `CartDrawer`) interact **only** through service modules in `src/services/`.
- No UI component directly references static arrays or hardcoded mock constants.
- Every service function returns a standard typed `Promise<T>`.

### Replacing Demo Services with Live Backend
To switch from local demo data to a real backend API:
1. Update `src/services/apiContracts.ts` with your live API base URL (e.g. `https://api.bdsolarenergy.com.bd`).
2. Inside `src/services/productService.ts` (and corresponding services), replace the simulated `setTimeout` block with standard `fetch` or `axios` calls:

```typescript
// Example: Transitioning productService.getAllProducts()
import { API_ENDPOINTS } from './apiContracts';

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_PRODUCTS}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },
  // ...
};
```

---

## 2. API Endpoints Specification

### A. Products & Catalog

#### 1. List / Filter Products
- **Endpoint:** `GET /api/v1/products`
- **Query Parameters:**
  - `category` (optional, string): e.g. `solar-panels`, `solar-inverters`, `wires-cables`
  - `subcategory` (optional, string): e.g. `bifacial-panels`
  - `brand` (optional, string array): e.g. `Trina Solar`, `Growatt`
  - `search` (optional, string): keyword across title, brand, SKU
  - `minPrice` / `maxPrice` (optional, number): price filter in BDT
  - `inStockOnly` (optional, boolean): true
  - `onSaleOnly` (optional, boolean): true
  - `sortBy` (optional, string): `popularity` | `newest` | `price-asc` | `price-desc` | `rating`
  - `solarWattsMin` / `solarWattsMax` (optional, number)
  - `inverterType` (optional, string): `Hybrid` | `On-Grid` | `Off-Grid`
  - `batteryChemistry` (optional, string): `LiFePO4` | `Tubular`
  - `breakerPoles` (optional, string): `1P` | `2P` | `3P` | `4P`
- **Response Format:**
```json
{
  "total": 42,
  "products": [
    {
      "id": "prod-sp-01",
      "name": "Trina Solar Vertex S+ 585W Dual Glass Bifacial Solar Panel",
      "slug": "trina-solar-vertex-s-plus-585w-bifacial",
      "price": 18500,
      "originalPrice": 20200,
      "currency": "BDT",
      "image": "https://...",
      "gallery": ["https://..."],
      "categoryId": "solar-panels",
      "subcategoryId": "bifacial-panels",
      "brand": "Trina Solar",
      "sku": "TS-TSM-NEG19RC.20-585",
      "stock": 45,
      "inStock": true,
      "rating": 4.9,
      "reviewCount": 38,
      "specifications": {
        "ratedPowerW": 585,
        "cellType": "Bifacial Mono",
        "moduleEfficiency": "22.3%",
        "maxVoltageVmp": 39.4,
        "maxCurrentImp": 14.85,
        "openCircuitVoltageVoc": 47.6,
        "shortCircuitCurrentIsc": 15.75,
        "warrantyYears": 25
      }
    }
  ]
}
```

#### 2. Get Product by Slug
- **Endpoint:** `GET /api/v1/products/:slug`
- **Response:** Complete `Product` object.

#### 3. Autocomplete Search
- **Endpoint:** `GET /api/v1/products/search?q=:query&limit=8`
- **Response:** Array of matched lightweight product items.

---

### B. Categories & Brands

#### 1. Get Categories Hierarchy
- **Endpoint:** `GET /api/v1/categories`
- **Response:** Array of categories with nested subcategories and live product count.

#### 2. Get Brands
- **Endpoint:** `GET /api/v1/brands`
- **Response:** Array of brand profiles with country of origin and popular status.

---

### C. Solar Packages & Sizing Engine

#### 1. Turnkey Solar Packages
- **Endpoint:** `GET /api/v1/solar-packages`
- **Response:** Array of pre-engineered packages including included components list, estimated daily generation (kWh/day), and monthly savings.

#### 2. Solar Sizing Calculator Engine
- **Endpoint:** `POST /api/v1/solar-calculator/estimate`
- **Request Body:**
```json
{
  "monthlyBillBdt": 6500,
  "billReductionPercent": 80,
  "needBatteryBackup": true
}
```
- **Response:** Calculated recommended Solar kWp, panel count, inverter capacity (kVA), battery storage (kWh), and 25-year cumulative savings in BDT.

---

### D. Customer Authentication & Profile

#### 1. Customer Login
- **Endpoint:** `POST /api/v1/auth/login`
- **Request Body:** `{ "identifier": "phone_or_email", "password": "..." }`
- **Response:** `{ "token": "jwt_token...", "user": { "id": "...", "name": "...", "phone": "...", "savedAddresses": [...] } }`

#### 2. Customer Registration
- **Endpoint:** `POST /api/v1/auth/register`
- **Request Body:** `{ "name": "...", "phone": "...", "email": "...", "password": "..." }`

---

### E. Orders & Checkout

#### 1. Create Order
- **Endpoint:** `POST /api/v1/orders`
- **Headers:** `Authorization: Bearer <token>` (or guest session header)
- **Request Body:**
```json
{
  "items": [
    { "productId": "prod-sp-01", "quantity": 6, "price": 18500 }
  ],
  "subtotal": 111000,
  "discount": 5550,
  "couponCode": "BDSOLAR5",
  "shippingFee": 0,
  "total": 105450,
  "paymentMethod": "COD",
  "shippingAddress": {
    "fullName": "Md. Tanvir Hossain",
    "phone": "+880 1712-345678",
    "division": "Dhaka",
    "district": "Dhaka",
    "thanaArea": "Dhanmondi, Road 27",
    "fullAddress": "House 42, Flat 5B, Road 27, Dhanmondi, Dhaka",
    "postalCode": "1209"
  },
  "notes": "Please deliver to rooftop."
}
```
- **Response:** `{ "orderNumber": "BDS-2026-94812", "status": "CONFIRMED", "estimatedDeliveryDate": "2026-03-15" }`

---

## 3. Bangladesh Logistics & Payment Gateway Hooks

When ready for live payment gateways in Bangladesh:
1. **bKash Checkout URL:** Call bKash Create Payment API inside `services/orderService.ts` before creating the order.
2. **Nagad Direct Checkout:** Integrate Nagad Payment Gateway redirect URL.
3. **Courier API Integration:** Plug in Steadfast Courier API (`POST https://user.steadfast.com.bd/api/v1/create_order`) or Pathao Merchant API for automated tracking numbers and label printing.
