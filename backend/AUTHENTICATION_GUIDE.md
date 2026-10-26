# BD Solar Energy — Package-Based Authentication & Social Login Architecture Guide

This document provides a comprehensive guide to the package-based authentication architecture of **BD Solar Energy**, powered by **`dj-rest-auth`**, **`django-allauth`**, **`djangorestframework-simplejwt`**, and **Django REST Framework**.

---

## 1. Architectural Overview

The authentication system replaces previous custom views with established, battle-tested Django authentication packages:

| Package | Role in Architecture |
| :--- | :--- |
| **`dj-rest-auth` (v7.2.0+)** | Standardized REST authentication endpoints: registration, login, logout, token refresh, password change, password reset, and user details. |
| **`django-allauth` (v65.20.0+)** | Robust account management, email verification pipelines, and extensible OAuth2/OIDC social authentication adapters. |
| **`djangorestframework-simplejwt` (v5.5.0+)** | Cryptographic JWT access and refresh token issuance, rotation, and blacklisting. |
| **`djangorestframework` (v3.18.0+)** | REST API serializers, ownership-scoped viewsets, and permission enforcement (`IsAuthenticated`). |

---

## 2. API Endpoints Reference

All authentication endpoints are mounted under `/api/v1/auth/`:

| Endpoint | Method | Description | Request Payload / Query | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/registration/` | `POST` | Register a new customer account | `name`, `email`, `phone`, `password`, `confirmPassword` | No |
| `/api/v1/auth/register/` | `POST` | Backward-compatible alias for registration | `name`, `email`, `phone`, `password`, `confirmPassword` | No |
| `/api/v1/auth/login/` | `POST` | Authenticate with username, email, OR phone | `username` (or `email`), `password` | No |
| `/api/v1/auth/logout/` | `POST` | Revoke & blacklist refresh token, clear cookies | `{"refresh": "<token>"}` (or cookie) | Yes |
| `/api/v1/auth/user/` | `GET`, `PATCH` | Retrieve or partially update user profile | Profile fields (`first_name`, `last_name`, `phone`) | Yes |
| `/api/v1/auth/me/` | `GET`, `PATCH` | Backward-compatible alias for user profile | Profile fields (`first_name`, `last_name`, `phone`) | Yes |
| `/api/v1/auth/token/refresh/` | `POST` | Refresh access token & rotate refresh token | `{"refresh": "<token>"}` (or cookie) | No |
| `/api/v1/auth/token/verify/` | `POST` | Validate if a JWT access token is active | `{"token": "<access_token>"}` | No |
| `/api/v1/auth/password/change/`| `POST` | Change password for authenticated user | `old_password`, `new_password`, `confirm_password` | Yes |
| `/api/v1/auth/change-password/`| `POST` | Backward-compatible alias for password change | `old_password`, `new_password`, `confirm_password` | Yes |
| `/api/v1/auth/password/reset/` | `POST` | Initiate password reset email | `{"email": "<user_email>"}` | No |
| `/api/v1/auth/password/reset/confirm/` | `POST` | Confirm password reset using UID and token | `uid`, `token`, `new_password1`, `new_password2` | No |
| `/api/v1/auth/google/` | `POST` | Google OAuth2 Social Authentication | `{"access_token": "..."}` or `{"code": "..."}` | No |
| `/api/v1/auth/addresses/` | `GET`, `POST` | List and create saved customer delivery addresses | Customer address fields | Yes |
| `/api/v1/auth/addresses/<id>/`| `GET`, `PATCH`, `DELETE` | Retrieve, update, or remove customer address | Customer address fields | Yes |

---

## 3. JWT Lifecycle & Security Configuration

### Configuration Settings
In [`backend/config/settings.py`](file:///d:/BDSolarEnergy/backend/config/settings.py):
- **Access Token Lifetime:** 2 hours (`SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'] = timedelta(hours=2)`).
- **Refresh Token Lifetime:** 7 days (`SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'] = timedelta(days=7)`).
- **Token Rotation:** `ROTATE_REFRESH_TOKENS = True` (new refresh token issued on every refresh).
- **Token Revocation / Blacklist:** `BLACKLIST_AFTER_ROTATION = True` (old refresh token is immediately blacklisted).
- **Logout Revocation:** `LogoutView` explicitly blacklists the refresh token in the database.
- **Dual Transport:** 
  - Sets `HttpOnly`, `SameSite=Lax`, and `Secure` cookies (`bdsolar_access_token`, `bdsolar_refresh_token`).
  - Emits `access`, `refresh`, and user profile in JSON body for standard API clients and mobile/React apps.
  - Authenticates via `dj_rest_auth.jwt_auth.JWTCookieAuthentication`, inspecting cookies first and falling back to `Authorization: Bearer <token>` seamlessly.

---

## 4. User Model & Data Preservation

1. **UUID Architecture:**
   - [`accounts.User`](file:///d:/BDSolarEnergy/backend/apps/accounts/models.py) uses a non-sequential `UUIDField(primary_key=True)`.
   - All relations (`CustomerAddress`, `Order`, `Cart`, `Wishlist`) maintain foreign keys to `User`.
2. **Existing Account Integrity:**
   - Existing passwords (PBKDF2 SHA256 hashes) and accounts in PostgreSQL `bdsolar_db` are preserved without schema modification.
   - All existing accounts have corresponding verified `allauth.account.models.EmailAddress` records synced.
3. **Privilege Protection:**
   - Custom adapter [`CustomAccountAdapter`](file:///d:/BDSolarEnergy/backend/apps/accounts/adapters.py) and serializer [`CustomRegisterSerializer`](file:///d:/BDSolarEnergy/backend/apps/accounts/serializers.py) enforce that public registration always assigns `role='customer'`, `is_staff=False`, `is_superuser=False`. Staff/Admin accounts can only be created via management commands or Django Admin.

---

## 5. Google Social Login Activation Guide

The backend is pre-configured and architecture-ready for Google OAuth2 login via [`apps.accounts.views.GoogleLogin`](file:///d:/BDSolarEnergy/backend/apps/accounts/views.py).

### Activation Steps (When Credentials Become Available)

#### Step 1: Create Google Cloud Credentials
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one (e.g. `BD Solar Energy`).
3. Navigate to **APIs & Services** > **OAuth consent screen**:
   - User Type: **External**
   - App Name: `BD Solar Energy`
   - Scopes: `email`, `profile`, `openid`
4. Navigate to **APIs & Services** > **Credentials**:
   - Click **Create Credentials** > **OAuth client ID**.
   - Application Type: **Web application**.
   - Name: `BD Solar Energy Web Client`.
   - **Authorized JavaScript origins:**
     - Development: `http://localhost:5173`, `http://localhost:5174`, `http://127.0.0.1:8000`
     - Production: `https://bdsolarenergy.com`, `https://www.bdsolarenergy.com`
   - **Authorized redirect URIs:**
     - Development: `http://localhost:5173/auth/google/callback`
     - Production: `https://bdsolarenergy.com/auth/google/callback`
5. Note the generated **Client ID** and **Client Secret**.

#### Step 2: Configure Environment Variables
In [`backend/.env`](file:///d:/BDSolarEnergy/backend/.env):
```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5173/auth/google/callback
```
In [`frontend/.env`](file:///d:/BDSolarEnergy/frontend/.env):
```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

#### Step 3: Frontend Invocation
The frontend [`authService.ts`](file:///d:/BDSolarEnergy/frontend/src/services/authService.ts) and [`AuthContext.tsx`](file:///d:/BDSolarEnergy/frontend/src/context/AuthContext.tsx) already provide `loginWithGoogle(codeOrToken, isAccessToken)`:

```typescript
// Example: Google Login Button handler
import { useAuth } from '../context/AuthContext';

export function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (response: any) => {
    // If using Google Identity Services (One Tap or standard OAuth code/token):
    const token = response.credential || response.access_token || response.code;
    const isToken = !response.code;
    const result = await loginWithGoogle(token, isToken);
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    <button onClick={...}>Continue with Google</button>
  );
}
```

#### Step 4: Account Linking Policy
Implemented in [`CustomSocialAccountAdapter.pre_social_login`](file:///d:/BDSolarEnergy/backend/apps/accounts/adapters.py):
- When a user logs in with Google, allauth verifies that Google marked the email as verified (`email_verified: True`).
- If an existing customer account has the same email, the adapter links the Google account to the existing account automatically.
- This prevents duplicate accounts while ensuring zero risk of account takeover from unverified third-party emails.

---

## 6. Verification and Automated Testing

Run the automated test suites:

### 1. Backend Django Unit Tests
```bash
cd backend
.\venv\Scripts\python.exe manage.py test apps.accounts
```
*Executes all 13 accounts test cases (registration, role protection, login variants, password change, token refresh/logout blacklisting, address isolation, Google endpoint validation).*

### 2. Full Backend Test Suite
```bash
cd backend
.\venv\Scripts\python.exe manage.py test
```
*Executes all 32 tests across the entire backend (accounts, products, orders, cart, categories, solar packages).*

### 3. Live Package-Based End-to-End Integration Tests
```bash
cd frontend
node scripts/test_package_auth.js
```
*Tests all 10 live HTTP endpoints against the running server.*

### 4. Frontend Type Checking & Production Build
```bash
cd frontend
npm run build
```
