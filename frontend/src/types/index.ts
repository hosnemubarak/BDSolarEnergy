export type CategoryId = 
  | 'solar-panels'
  | 'solar-inverters'
  | 'solar-batteries'
  | 'solar-charge-controllers'
  | 'solar-mounting-accessories'
  | 'solar-complete-kits'
  | 'wires-cables'
  | 'electrical-protection'
  | 'switches-sockets-lighting'
  | 'electrical-installation-tools'
  | 'power-backup-accessories';

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentId: CategoryId;
  productCount?: number;
}

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  subcategories: Subcategory[];
  featuredImage?: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  country: string;
  description?: string;
  isPopular?: boolean;
}

export type ProductBadge = 'SALE' | 'NEW' | 'FEATURED' | 'BESTSELLER' | 'HOT';

export interface ProductSpecifications {
  // General Specs
  warrantyYears?: number;
  origin?: string;
  weightKg?: number;
  dimensionsMm?: string;
  certification?: string[];
  
  // Solar Panels
  ratedPowerW?: number;
  cellType?: 'Monocrystalline' | 'Polycrystalline' | 'Bifacial Mono' | 'TOPCon' | 'Half-Cut';
  moduleEfficiency?: string;
  maxVoltageVmp?: number;
  maxCurrentImp?: number;
  openCircuitVoltageVoc?: number;
  shortCircuitCurrentIsc?: number;

  // Inverters
  ratedOutputKva?: number;
  inverterType?: 'On-Grid' | 'Off-Grid' | 'Hybrid';
  phase?: 'Single Phase' | 'Three Phase';
  mpptCount?: number;
  batteryVoltageV?: number;
  pureSineWave?: boolean;

  // Solar Batteries
  batteryChemistry?: 'LiFePO4 (Lithium Iron)' | 'Lead Acid Tubular' | 'Deep Cycle Gel' | 'AGM';
  nominalVoltageV?: number;
  capacityAh?: number;
  usableEnergyKwh?: number;
  cycleLife?: string;
  dodPercentage?: number;

  // Charge Controllers
  controllerType?: 'MPPT' | 'PWM';
  maxPvInputVoltage?: number;
  ratedChargeCurrentA?: number;

  // Wires and Cables
  cableType?: 'Single Core' | 'Multi Core' | 'Solar DC PV' | 'Armoured' | 'Flexible House Wire';
  conductorMaterial?: 'Copper (Cu)' | 'Aluminum (Al)';
  crossSectionMm2?: string;
  voltageGrade?: string;
  coilLengthM?: number;

  // Protection Devices (Circuit Breakers)
  deviceType?: 'MCB' | 'MCCB' | 'RCCB' | 'SPD (Surge)' | 'ATS' | 'Changeover';
  ratedCurrentA?: number;
  poles?: '1P' | '2P' | '3P' | '4P';
  breakingCapacityKa?: number;
  tripCurve?: 'B' | 'C' | 'D';

  // Lighting & Switches
  lampType?: 'LED Bulb' | 'LED Tube' | 'LED Panel' | 'Floodlight' | 'Streetlight';
  colorTempK?: '3000K Warm' | '4000K Natural' | '6500K Daylight';
  lumenOutput?: number;
  gangs?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  currency: 'BDT';
  image: string;
  gallery: string[];
  categoryId: CategoryId;
  subcategoryId: string;
  brand: string;
  sku: string;
  stock: number;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  specifications: ProductSpecifications;
  highlights?: string[];
  badges?: ProductBadge[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  installationSupportAvailable?: boolean;
  compatibilityNotes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SolarPackageItem {
  productId: string;
  productName: string;
  quantity: number;
  category: string;
  specsSummary: string;
}

export interface SolarPackage {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  systemType: 'Residential Off-Grid' | 'Residential Hybrid' | 'Commercial On-Grid' | 'Apartment Backup';
  dailyGenerationEstimateKwh: number;
  price: number;
  originalPrice?: number;
  savingsMonthlyEstimateBdt: number;
  warrantySummary: string;
  idealFor: string;
  image: string;
  items: SolarPackageItem[];
  features: string[];
  specifications: {
    totalSolarCapacityWp: number;
    inverterCapacityKva: number;
    batteryStorageKwh?: number;
    roofSpaceRequiredSqFt: number;
  };
  installationIncluded: boolean;
  netMeteringEligible: boolean;
}

export interface CustomerAddress {
  id?: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  division: string;
  district: string;
  thanaArea: string;
  fullAddress: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  defaultAddress?: CustomerAddress;
  savedAddresses: CustomerAddress[];
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  subtotal: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  shippingAddress: CustomerAddress;
  paymentMethod: 'COD' | 'BKASH' | 'NAGAD' | 'BANK_TRANSFER';
  paymentStatus: 'PAID' | 'UNPAID';
  courierName?: string;
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
  notes?: string;
}

export interface ProductFilterParams {
  category?: CategoryId;
  subcategory?: string;
  brand?: string[];
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  onSaleOnly?: boolean;
  sortBy?: 'popularity' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  
  // Technical filters
  solarWattsMin?: number;
  solarWattsMax?: number;
  inverterType?: string[];
  batteryChemistry?: string[];
  cableSize?: string[];
  breakerPoles?: string[];
  breakerRatingAmps?: number;
}
