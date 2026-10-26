import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Share2, 
  RotateCcw,
  Zap,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'compatibility' | 'warranty'>('specs');
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    if (slug) {
      productService.getProductBySlug(slug).then(async (found) => {
        if (!isMounted) return;
        setProduct(found);
        if (found) {
          setSelectedImage(found.image);
          setQuantity(1);
          const related = await productService.getRelatedProducts(found.id, found.categoryId, 4);
          if (isMounted) setRelatedProducts(related);
        }
        setIsLoading(false);
      });
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-[#15803D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for may have been retired or moved.</p>
        <Link
          to="/shop"
          className="px-6 py-2.5 bg-[#15803D] text-white text-xs font-bold rounded-xl inline-block"
        >
          Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const specs = product.specifications;

  const handleAddToCart = () => {
    const res = addItem(product, quantity);
    if (res.success) {
      showToast(`Added ${quantity}x "${product.name}" to cart.`, 'success');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleBuyNow = () => {
    const res = addItem(product, quantity);
    if (res.success) {
      navigate('/checkout');
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Product link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Shop', url: '/shop' },
          { label: product.categoryId, url: `/shop?category=${product.categoryId}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-5 sm:p-8 rounded-3xl border border-gray-200 shadow-xs">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 relative group">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/solar-panel.svg';
              }}
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="absolute top-4 left-4 px-2.5 py-1 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm">
                Save ৳{(product.originalPrice - product.price).toLocaleString('en-BD')}
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#15803D] scale-105 shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 opacity-70'
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/images/solar-panel.svg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing, Specs & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            {/* Brand, SKU and Wishlist */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded">
                  {product.brand}
                </span>
                <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2 rounded-lg border transition-colors ${
                    wishlisted
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-rose-50/50'
                  }`}
                  title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="mt-3 flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} size={15} />
              <div className="flex items-center gap-2 text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>In Stock ({product.stock} units)</span>
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="mt-4 p-4 bg-[#F0FDF4] rounded-2xl border border-green-100 flex items-baseline justify-between flex-wrap gap-3">
              <div>
                <span className="text-3xl font-black text-[#16A34A]">
                  ৳{product.price.toLocaleString('en-BD')}
                </span>
                {product.originalPrice && (
                  <span className="ml-3 text-sm text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString('en-BD')}
                  </span>
                )}
                <div className="text-[11px] text-gray-500 mt-0.5">
                  VAT & Import duty included. Free shipping for orders above ৳50,000.
                </div>
              </div>

              {specs.warrantyYears && (
                <div className="text-right">
                  <span className="px-3 py-1 bg-white text-green-900 text-xs font-bold rounded-lg border border-green-200 shadow-xs inline-flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                    <span>{specs.warrantyYears} Years Warranty</span>
                  </span>
                </div>
              )}
            </div>

            {/* Highlights bullets */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mt-4 space-y-1.5">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Key Technical Features:
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center justify-between border border-gray-300 rounded-xl bg-gray-50 px-2 py-1 shrink-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-gray-900 font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-gray-200 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4 text-[#16A34A]" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery & Assurance Strip */}
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-green-700" />
                <span>Fast delivery across Bangladesh</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-green-700" />
                <span>7-day return policy for defects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Description, Compatibility, Warranty */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex border-b border-gray-200 gap-4 sm:gap-8 overflow-x-auto">
          {[
            { id: 'specs', label: 'Technical Specifications' },
            { id: 'description', label: 'Product Overview' },
            { id: 'compatibility', label: 'System Compatibility Guide' },
            { id: 'warranty', label: 'Warranty & Logistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-bold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#15803D] text-[#15803D]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SPECS TABLE */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-gray-900">
              Verified Technical Specifications
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-gray-200 rounded-xl overflow-hidden">
                <tbody className="divide-y divide-gray-100">
                  {/* General */}
                  <tr className="bg-gray-50 font-semibold text-gray-700">
                    <td className="p-3 w-1/3">Brand & Manufacturer</td>
                    <td className="p-3 font-normal text-gray-900">{product.brand} ({specs.origin || 'Tier-1 Certified'})</td>
                  </tr>
                  <tr>
                    <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Model / SKU Number</td>
                    <td className="p-3 font-mono text-gray-900">{product.sku}</td>
                  </tr>

                  {/* Solar Panels */}
                  {specs.ratedPowerW && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Rated Output (Pmax)</td>
                      <td className="p-3 font-bold text-green-900">{specs.ratedPowerW} Watts</td>
                    </tr>
                  )}
                  {specs.cellType && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Photovoltaic Cell Technology</td>
                      <td className="p-3">{specs.cellType}</td>
                    </tr>
                  )}
                  {specs.moduleEfficiency && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Module Conversion Efficiency</td>
                      <td className="p-3 font-bold text-emerald-700">{specs.moduleEfficiency}</td>
                    </tr>
                  )}
                  {specs.maxVoltageVmp && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Maximum Power Voltage (Vmp)</td>
                      <td className="p-3">{specs.maxVoltageVmp} V</td>
                    </tr>
                  )}
                  {specs.maxCurrentImp && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Maximum Power Current (Imp)</td>
                      <td className="p-3">{specs.maxCurrentImp} A</td>
                    </tr>
                  )}
                  {specs.openCircuitVoltageVoc && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Open Circuit Voltage (Voc)</td>
                      <td className="p-3">{specs.openCircuitVoltageVoc} V</td>
                    </tr>
                  )}
                  {specs.shortCircuitCurrentIsc && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Short Circuit Current (Isc)</td>
                      <td className="p-3">{specs.shortCircuitCurrentIsc} A</td>
                    </tr>
                  )}

                  {/* Inverters */}
                  {specs.ratedOutputKva && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Inverter Rated Output Power</td>
                      <td className="p-3 font-bold text-green-900">{specs.ratedOutputKva} kVA</td>
                    </tr>
                  )}
                  {specs.inverterType && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Inverter Topology</td>
                      <td className="p-3">{specs.inverterType} ({specs.pureSineWave ? 'Pure Sine Wave' : 'Modified'})</td>
                    </tr>
                  )}
                  {specs.phase && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">AC Phase Configuration</td>
                      <td className="p-3">{specs.phase}</td>
                    </tr>
                  )}
                  {specs.batteryVoltageV && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">DC Battery Bank Voltage</td>
                      <td className="p-3 font-bold">{specs.batteryVoltageV} VDC</td>
                    </tr>
                  )}

                  {/* Batteries */}
                  {specs.batteryChemistry && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Battery Chemistry / Type</td>
                      <td className="p-3">{specs.batteryChemistry}</td>
                    </tr>
                  )}
                  {specs.capacityAh && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Storage Capacity (Ah)</td>
                      <td className="p-3 font-bold text-green-900">{specs.capacityAh} Ah</td>
                    </tr>
                  )}
                  {specs.usableEnergyKwh && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Usable Storage Energy</td>
                      <td className="p-3 font-bold text-emerald-700">{specs.usableEnergyKwh} kWh</td>
                    </tr>
                  )}
                  {specs.cycleLife && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Cycle Life Endurance</td>
                      <td className="p-3">{specs.cycleLife}</td>
                    </tr>
                  )}

                  {/* Cables */}
                  {specs.crossSectionMm2 && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Cable Conductor Size</td>
                      <td className="p-3 font-bold text-green-900">{specs.crossSectionMm2}</td>
                    </tr>
                  )}
                  {specs.conductorMaterial && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Conductor Metal</td>
                      <td className="p-3">{specs.conductorMaterial}</td>
                    </tr>
                  )}
                  {specs.voltageGrade && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Voltage Grade</td>
                      <td className="p-3">{specs.voltageGrade}</td>
                    </tr>
                  )}

                  {/* Circuit Breakers */}
                  {specs.ratedCurrentA && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Rated Current (In)</td>
                      <td className="p-3 font-bold text-green-900">{specs.ratedCurrentA} Amps ({specs.poles})</td>
                    </tr>
                  )}
                  {specs.breakingCapacityKa && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Breaking Capacity (Icu)</td>
                      <td className="p-3">{specs.breakingCapacityKa} kA</td>
                    </tr>
                  )}

                  {/* Dimensions & Weight */}
                  {specs.dimensionsMm && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Physical Dimensions</td>
                      <td className="p-3">{specs.dimensionsMm}</td>
                    </tr>
                  )}
                  {specs.weightKg && (
                    <tr>
                      <td className="p-3 bg-gray-50/50 font-semibold text-gray-700">Net Weight</td>
                      <td className="p-3">{specs.weightKg} kg</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW */}
        {activeTab === 'description' && (
          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p>{product.description}</p>
            <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-green-900 font-medium">
              💡 Need technical advice? Our solar engineering team is available on WhatsApp and Phone for single-line diagram review.
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM COMPATIBILITY */}
        {activeTab === 'compatibility' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Solar Engineering Compatibility Notice</span>
              </div>
              <p className="text-xs leading-relaxed">
                {product.compatibilityNotes ||
                  'Always calculate open-circuit string voltage (Voc) at minimum winter ambient temperature in your region to prevent damaging MPPT inputs. Ensure battery charging voltage profiles match your inverter manufacturer specifications.'}
              </p>
            </div>

            <div className="text-xs text-gray-600 space-y-2">
              <h4 className="font-bold text-gray-900">Standard Guidelines:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Never exceed maximum inverter DC input voltage (Vmax).</li>
                <li>Use designated Solar DC 4mm² or 6mm² dual-insulated tinned copper cables for all array strings.</li>
                <li>Install a DC Surge Protective Device (SPD) and double-pole DC breaker between solar panels and inverter.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: WARRANTY */}
        {activeTab === 'warranty' && (
          <div className="space-y-4 text-xs sm:text-sm text-gray-700">
            <h4 className="font-bold text-gray-900 text-sm">Official Warranty Protection</h4>
            <p>
              This product is backed by an official {specs.warrantyYears || 1}-Year Manufacturer Warranty against manufacturing and component defects.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block">Warranty Claim Process</span>
                <span className="text-gray-500">Bring the equipment with original invoice to our Motijheel service center or dispatch via registered courier.</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <span className="font-bold text-gray-900 block">Shipping & Wooden Crating</span>
                <span className="text-gray-500">Glass panels and heavy batteries are packed in reinforced wooden pallets to prevent damage during transit.</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
              Related Equipment & Accessories
            </h3>
            <Link
              to={`/shop?category=${product.categoryId}`}
              className="text-xs font-bold text-[#15803D] hover:underline"
            >
              Browse Category &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Purchase Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] text-gray-500 block">Total Price</span>
          <span className="text-base font-black text-gray-900">
            ৳{(product.price * quantity).toLocaleString('en-BD')}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Stepper */}
          <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-1.5 py-0.5">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-xs font-bold text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="p-1 text-gray-600 hover:text-gray-900"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-xs active:scale-95"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
