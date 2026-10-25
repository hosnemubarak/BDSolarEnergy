import { UserProfile } from '../types';

const AUTH_USER_KEY = 'bdsolar_auth_user_v1';

const DEFAULT_DEMO_USER: UserProfile = {
  id: 'usr-demo-01',
  name: 'Md. Tanvir Hossain',
  email: 'tanvir.engineer@bdsolar.demo',
  phone: '+880 1712-345678',
  role: 'customer',
  createdAt: '2025-01-15T10:00:00Z',
  defaultAddress: {
    fullName: 'Md. Tanvir Hossain',
    phone: '+880 1712-345678',
    division: 'Dhaka',
    district: 'Dhaka',
    thanaArea: 'Dhanmondi, Road 27',
    fullAddress: 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
    postalCode: '1209',
    isDefault: true,
  },
  savedAddresses: [
    {
      fullName: 'Md. Tanvir Hossain',
      phone: '+880 1712-345678',
      division: 'Dhaka',
      district: 'Dhaka',
      thanaArea: 'Dhanmondi, Road 27',
      fullAddress: 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
      postalCode: '1209',
      isDefault: true,
    },
    {
      fullName: 'Hossain Solar Workshop',
      phone: '+880 1819-987654',
      division: 'Chittagong',
      district: 'Chittagong',
      thanaArea: 'Pahartali Industrial Zone',
      fullAddress: 'Plot 18, Block B, Pahartali Industrial Area, Chittagong',
      postalCode: '4202',
      isDefault: false,
    },
  ],
};

export const authService = {
  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(AUTH_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async login(emailOrPhone: string, _password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!emailOrPhone.trim()) {
          resolve({ success: false, error: 'Please enter a valid email or phone number.' });
          return;
        }

        // Simulating successful login with demo user
        const loggedUser: UserProfile = {
          ...DEFAULT_DEMO_USER,
          email: emailOrPhone.includes('@') ? emailOrPhone : DEFAULT_DEMO_USER.email,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : DEFAULT_DEMO_USER.phone,
        };

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loggedUser));
        resolve({ success: true, user: loggedUser });
      }, 400);
    });
  },

  async register(name: string, email: string, phone: string, _password?: string): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!name.trim() || !phone.trim()) {
          resolve({ success: false, error: 'Name and phone number are required.' });
          return;
        }

        const newUser: UserProfile = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: name.trim(),
          email: email.trim() || `${phone.replace(/\D/g, '')}@bdsolar.demo`,
          phone: phone.trim(),
          role: 'customer',
          createdAt: new Date().toISOString(),
          savedAddresses: [],
        };

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
        resolve({ success: true, user: newUser });
      }, 400);
    });
  },

  logout(): void {
    try {
      localStorage.removeItem(AUTH_USER_KEY);
    } catch (err) {
      console.warn('Logout error', err);
    }
  },

  updateProfile(updated: Partial<UserProfile>): UserProfile | null {
    const current = this.getCurrentUser();
    if (!current) return null;
    const merged = { ...current, ...updated };
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(merged));
    return merged;
  },
};
