import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, CustomerAddress } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhoneOrUsername: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (codeOrToken: string, isAccessToken?: boolean) => Promise<{ success: boolean; error?: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  saveAddress: (address: CustomerAddress) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.fetchProfile();
          if (mounted) {
            setUser(profile);
          }
        } catch {
          if (mounted) {
            authService.logout();
            setUser(null);
          }
        }
      }
      if (mounted) {
        setIsLoading(false);
      }
    }

    initAuth();

    const handleExpired = () => {
      authService.logout();
      setUser(null);
    };

    window.addEventListener('bdsolar:auth-expired', handleExpired);

    return () => {
      mounted = false;
      window.removeEventListener('bdsolar:auth-expired', handleExpired);
    };
  }, []);

  const login = async (emailOrPhoneOrUsername: string, password?: string) => {
    const res = await authService.login(emailOrPhoneOrUsername, password);
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

  const loginWithGoogle = async (codeOrToken: string, isAccessToken = false) => {
    const res = await authService.loginWithGoogle(codeOrToken, isAccessToken);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, error: res.error || 'Google login failed.' };
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    return await authService.changePassword(oldPassword, newPassword);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    try {
      const fresh = await authService.updateProfile(updated);
      setUser(fresh);
    } catch (err) {
      console.error('Failed to update profile', err);
      throw err;
    }
  };

  const saveAddress = async (address: CustomerAddress) => {
    try {
      await authService.saveAddress(address);
      const fresh = await authService.fetchProfile();
      setUser(fresh);
    } catch (err) {
      console.error('Failed to save address', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && authService.isAuthenticated(),
        isLoading,
        login,
        register,
        loginWithGoogle,
        changePassword,
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
