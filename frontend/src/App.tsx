import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { QuickViewProvider } from './context/QuickViewContext';
import { CategoryProvider } from './context/CategoryContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CategoryProvider>
          <CartProvider>
            <WishlistProvider>
              <QuickViewProvider>
                <ToastProvider>
                  <AppRoutes />
                </ToastProvider>
              </QuickViewProvider>
            </WishlistProvider>
          </CartProvider>
        </CategoryProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
