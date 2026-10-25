import React, { createContext, useContext, useState } from 'react';
import { UserProfile, CustomerAddress } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  saveAddress: (address: CustomerAddress) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const login = async (emailOrPhone: string, password?: string) => {
    const res = await authService.login(emailOrPhone, password);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed.' };
  };

  const register = async (name: string, email: string, phone: string, password?: string) => {
    const res = await authService.register(name, email, phone, password);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed.' };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const fresh = authService.updateProfile(updated);
    if (fresh) setUser(fresh);
  };

  const saveAddress = (address: CustomerAddress) => {
    if (!user) return;
    const existing = user.savedAddresses || [];
    const updated = [address, ...existing.filter((a) => a.phone !== address.phone || a.fullAddress !== address.fullAddress)];
    const newUser = {
      ...user,
      defaultAddress: address.isDefault ? address : user.defaultAddress || address,
      savedAddresses: updated,
    };
    updateProfile(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        saveAddress,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
