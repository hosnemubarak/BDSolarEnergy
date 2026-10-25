/**
 * BD Solar Energy — Production HTTP & JWT API Client
 *
 * Handles:
 * - Direct REST API communication with Django REST Framework backend
 * - Automatic JWT Bearer Authorization header injection
 * - Transparent 401 JWT token refresh and request replay
 * - Session ID propagation for guest cart & wishlist persistence
 */

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'
).replace(/\/$/, '');

export const ACCESS_TOKEN_KEY = 'bdsolar_access_token';
export const REFRESH_TOKEN_KEY = 'bdsolar_refresh_token';
export const SESSION_KEY = 'bdsolar_session_id';

export const getAccessToken = (): string | null => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getRefreshToken = (): string | null => {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setTokens = (access: string, refresh?: string): void => {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  } catch (err) {
    console.warn('Failed to persist JWT tokens', err);
  }
};

export const clearTokens = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (err) {
    console.warn('Failed to clear JWT tokens', err);
  }
};

export const getOrCreateSessionId = (): string => {
  try {
    let sid = localStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return 'sess_fallback_temp';
  }
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface CustomRequestInit extends RequestInit {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

export async function apiClient<T>(
  endpoint: string,
  options: CustomRequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  // Inject session ID for guest cart / wishlist
  const sessionId = getOrCreateSessionId();
  if (sessionId && !headers.has('X-Session-ID')) {
    headers.set('X-Session-ID', sessionId);
  }

  // Inject JWT Bearer Token if available
  const token = getAccessToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized -> Attempt token refresh
    if (response.status === 401 && !options._retry && !url.includes('/auth/login') && !url.includes('/auth/token/refresh')) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshResp = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ refresh: refreshToken }),
            });

            if (refreshResp.ok) {
              const refreshData = await refreshResp.json();
              const newAccess = refreshData.access;
              const newRefresh = refreshData.refresh || refreshToken;
              setTokens(newAccess, newRefresh);
              isRefreshing = false;
              onRefreshed(newAccess);
            } else {
              isRefreshing = false;
              clearTokens();
              window.dispatchEvent(new CustomEvent('bdsolar:auth-expired'));
              throw new ApiError('Session expired. Please log in again.', 401);
            }
          } catch (refreshErr) {
            isRefreshing = false;
            clearTokens();
            window.dispatchEvent(new CustomEvent('bdsolar:auth-expired'));
            throw refreshErr;
          }
        }

        // Wait for token refresh to resolve and retry original request
        return new Promise<T>((resolve, reject) => {
          refreshSubscribers.push(async (newToken: string) => {
            try {
              const retryHeaders = new Headers(options.headers || {});
              if (!retryHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
                retryHeaders.set('Content-Type', 'application/json');
              }
              retryHeaders.set('Accept', 'application/json');
              retryHeaders.set('Authorization', `Bearer ${newToken}`);
              if (sessionId) retryHeaders.set('X-Session-ID', sessionId);

              const retryResponse = await fetch(url, {
                ...options,
                headers: retryHeaders,
                _retry: true,
              } as RequestInit);

              if (!retryResponse.ok) {
                const errData = await retryResponse.json().catch(() => null);
                reject(new ApiError(errData?.detail || 'Retry request failed', retryResponse.status, errData));
                return;
              }
              if (retryResponse.status === 204) {
                resolve({} as T);
                return;
              }
              resolve(await retryResponse.json());
            } catch (retryErr) {
              reject(retryErr);
            }
          });
        });
      }
    }

    if (!response.ok) {
      let errorBody: any;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }

      let message = `HTTP Error ${response.status}: ${response.statusText}`;
      if (errorBody && typeof errorBody === 'object') {
        if (errorBody.detail) {
          message = errorBody.detail;
        } else if (errorBody.message) {
          message = errorBody.message;
        } else {
          // Format validation errors (e.g. {"password": ["..."]})
          const firstKey = Object.keys(errorBody)[0];
          if (firstKey) {
            const val = errorBody[firstKey];
            message = Array.isArray(val) ? `${firstKey}: ${val.join(' ')}` : `${firstKey}: ${val}`;
          }
        }
      }

      throw new ApiError(message, response.status, errorBody);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check if the Django backend server is running.', 408);
    }
    throw err;
  }
}
