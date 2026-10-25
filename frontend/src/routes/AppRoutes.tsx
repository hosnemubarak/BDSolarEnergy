import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { SolarPackagesPage } from '../pages/SolarPackagesPage';
import { SystemBuilderPage } from '../pages/SystemBuilderPage';
import { CalculatorPage } from '../pages/CalculatorPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { AccountPage } from '../pages/AccountPage';
import { WishlistPage } from '../pages/WishlistPage';
import { AboutPage } from '../pages/AboutPage';
import { ContactPage } from '../pages/ContactPage';
import { FaqPage } from '../pages/FaqPage';
import { ShippingPolicyPage, WarrantyPolicyPage } from '../pages/PolicyPages';
import { NotFoundPage } from '../pages/NotFoundPage';

// Scroll to top automatically when navigating between routes
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:slug" element={<ProductDetailPage />} />
          <Route path="solar-packages" element={<SolarPackagesPage />} />
          <Route path="system-builder" element={<SystemBuilderPage />} />
          <Route path="solar-calculator" element={<CalculatorPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="shipping-policy" element={<ShippingPolicyPage />} />
          <Route path="warranty-policy" element={<WarrantyPolicyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
};
