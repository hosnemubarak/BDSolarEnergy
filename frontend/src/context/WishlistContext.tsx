import React, { createContext, useContext, useState } from 'react';
import { wishlistService } from '../services/wishlistService';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => wishlistService.getStoredIds());

  const toggleWishlist = (productId: string): boolean => {
    const updated = wishlistService.toggle(productId);
    setWishlistIds(updated);
    return updated.includes(productId);
  };

  const isWishlisted = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
