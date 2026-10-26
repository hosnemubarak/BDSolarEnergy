import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { TopAnnouncementBar } from './TopAnnouncementBar';
import { Header } from './Header';
import { MegaMenu } from './MegaMenu';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { MobileDrawer } from './MobileDrawer';
import { CartDrawer } from '../cart/CartDrawer';
import { QuickViewModal } from '../product/QuickViewModal';
import { AuthModal } from '../auth/AuthModal';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#1F2937]">
      {/* Top Banner */}
      <TopAnnouncementBar />

      {/* Main Header */}
      <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

      {/* Desktop Mega Menu */}
      <MegaMenu />

      {/* Main Page Body */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Drawer (Menu & Categories) */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Bottom Thumb Navigation */}
      <MobileNav onOpenCategories={() => setIsMobileMenuOpen(true)} />

      {/* Global Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Global Quick View Product Modal */}
      <QuickViewModal />

      {/* Global Customer Auth / Login Modal */}
      <AuthModal />
    </div>
  );
};
