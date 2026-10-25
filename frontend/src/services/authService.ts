import { UserProfile, CustomerAddress } from '../types';
import {
  apiClient,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  ApiError,
} from './apiClient';

const AUTH_USER_KEY = 'bdsolar_auth_user_v1';

export function mapBackendUserToProfile(backendUser: any): UserProfile {
  const addresses: CustomerAddress[] = (backendUser.addresses || []).map((addr: any) => ({
    id: addr.id,
    fullName: addr.full_name || addr.fullName || '',
    phone: addr.phone || '',
    alternatePhone: addr.alternate_phone || addr.alternatePhone || '',
    division: addr.division || '',
    district: addr.district || '',
    thanaArea: addr.thana_area || addr.thanaArea || '',
    fullAddress: addr.full_address || addr.fullAddress || '',
    postalCode: addr.postal_code || addr.postalCode || '',
    isDefault: !!addr.is_default || !!addr.isDefault,
  }));

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const fullName =
    `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim() ||
    backendUser.username ||
    'Customer';

  return {
    id: backendUser.id,
    name: fullName,
    email: backendUser.email || '',
    phone: backendUser.phone || '',
    role: backendUser.role === 'admin' ? 'admin' : 'customer',
    defaultAddress: defaultAddr,
    savedAddresses: addresses,
    createdAt: backendUser.created_at || new Date().toISOString(),
  };
}

export function mapAddressToBackend(addr: CustomerAddress): any {
  return {
    full_name: addr.fullName,
    phone: addr.phone,
    alternate_phone: addr.alternatePhone || '',
    division: addr.division,
    district: addr.district,
    thana_area: addr.thanaArea,
    full_address: addr.fullAddress,
    postal_code: addr.postalCode || '',
    is_default: !!addr.isDefault,
  };
}

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getAccessToken(): string | null {
    return getAccessToken();
  },

  getRefreshToken(): string | null {
    return getRefreshToken();
  },

  isAuthenticated(): boolean {
    return !!getAccessToken();
  },

  async login(
    emailOrPhoneOrUsername: string,
    password?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      if (!emailOrPhoneOrUsername.trim() || !password) {
        return { success: false, error: 'Please enter your username/email and password.' };
      }

      const res = await apiClient<{
        access: string;
        refresh: string;
        user: any;
      }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({
          username: emailOrPhoneOrUsername.trim(),
          password,
        }),
      });

      if (!res.access) {
        return { success: false, error: 'Invalid response from server.' };
      }

      setTokens(res.access, res.refresh);

      let profile: UserProfile;
      if (res.user) {
        profile = mapBackendUserToProfile(res.user);
      } else {
        profile = await this.fetchProfile();
      }

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
      return { success: true, user: profile };
    } catch (err: any) {
      const errorMsg =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    }
  },

  async register(
    name: string,
    email: string,
    phone: string,
    password?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    try {
      if (!name.trim() || !phone.trim() || !password) {
        return { success: false, error: 'Full name, phone, and password are required.' };
      }

      const res = await apiClient<{
        user: any;
        tokens: { access: string; refresh: string };
      }>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          confirmPassword: password,
        }),
      });

      if (res.tokens?.access) {
        setTokens(res.tokens.access, res.tokens.refresh);
      }

      const profile = mapBackendUserToProfile(res.user);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
      return { success: true, user: profile };
    } catch (err: any) {
      const errorMsg =
        err instanceof ApiError
          ? err.message
          : err?.message || 'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    }
  },

  async logout(): Promise<void> {
    try {
      const refresh = getRefreshToken();
      if (refresh) {
        await apiClient('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh }),
        }).catch(() => null);
      }
    } finally {
      clearTokens();
      localStorage.removeItem(AUTH_USER_KEY);
    }
  },

  async fetchProfile(): Promise<UserProfile> {
    const rawUser = await apiClient<any>('/auth/me/');
    const profile = mapBackendUserToProfile(rawUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    return profile;
  },

  async updateProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    const payload: any = {};
    if (updated.name) {
      const parts = updated.name.trim().split(' ');
      payload.first_name = parts[0];
      payload.last_name = parts.slice(1).join(' ');
    }
    if (updated.phone) payload.phone = updated.phone;
    if (updated.email) payload.email = updated.email;

    const rawUser = await apiClient<any>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    const profile = mapBackendUserToProfile(rawUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
    return profile;
  },

  async saveAddress(address: CustomerAddress): Promise<CustomerAddress> {
    const payload = mapAddressToBackend(address);
    let raw: any;
    if (address.id && address.id.length > 20) {
      raw = await apiClient<any>(`/auth/addresses/${address.id}/`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    } else {
      raw = await apiClient<any>('/auth/addresses/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    // Refresh profile addresses
    await this.fetchProfile().catch(() => null);

    return {
      id: raw.id,
      fullName: raw.full_name || raw.fullName,
      phone: raw.phone,
      alternatePhone: raw.alternate_phone,
      division: raw.division,
      district: raw.district,
      thanaArea: raw.thana_area,
      fullAddress: raw.full_address,
      postalCode: raw.postal_code,
      isDefault: raw.is_default,
    };
  },

  async deleteAddress(addressId: string): Promise<void> {
    await apiClient(`/auth/addresses/${addressId}/`, {
      method: 'DELETE',
    });
    await this.fetchProfile().catch(() => null);
  },
};
