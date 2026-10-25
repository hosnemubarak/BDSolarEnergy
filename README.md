# BD Solar Energy — Full-Stack E-Commerce Platform

A production-ready full-stack e-commerce marketplace specializing in solar panels, on-grid & hybrid inverters, LiFePO4 batteries, electrical cables, circuit breakers, lighting, and solar packages tailored for Bangladesh.

Built with **React 19 + TypeScript + Vite 8** on the frontend and **Django 5 + Django REST Framework** on the backend.

---

## 1. Project Architecture

```text
bdsolarenergy/
├── frontend/                  # React 19 + TypeScript + Vite 8
│   ├── public/
│   │   └── images/            # Local high-definition SVG product illustrations
│   ├── src/
│   │   ├── components/        # UI components (Header, ProductCard, CartDrawer, etc.)
│   │   ├── context/           # React context (Cart, Wishlist, Auth, Toast, QuickView)
│   │   ├── data/              # Offline fallback / demo catalog data
│   │   ├── pages/             # Route views (Home, Shop, ProductDetail, SolarPackages, etc.)
│   │   ├── services/          # HTTP adapter service layer (productService, orderService, etc.)
│   │   ├── types/             # TypeScript domain models and interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css          # Tailwind CSS v4 design system
│   ├── package.json
│   ├── vite.config.ts
│   └── .env.example
│
├── backend/                   # Django 5.2 + Django REST Framework
│   ├── config/                # Django core configuration (settings, urls, wsgi)
│   ├── apps/
│   │   ├── products/          # Products, specifications JSONField, gallery images
│   │   ├── categories/        # Categories & Subcategories models and viewsets
│   │   ├── brands/            # Manufacturer brands models and viewsets
│   │   ├── solar_packages/    # Turnkey rooftop solar packages and component items
│   │   └── orders/            # Orders and order items with atomic stock decrement
│   ├── manage.py
│   ├── requirements.txt
│   ├── seed_data.json         # Complete initial catalog fixture
│   └── .env.example
│
├── .gitignore
├── API_SPECIFICATION.md
└── README.md
```

---

## 2. Prerequisites

- **Node.js**: `v20.0.0` or higher (verified on `v24.x`)
- **Python**: `3.10` to `3.14` (verified on `Python 3.14.7 64-bit`)
- **npm**: `v9.0.0` or higher
- **Git**

---

## 3. Quick Start (Running Both Frontend & Backend)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS:
# python3 -m venv venv
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply database migrations
python manage.py migrate

# Seed database with initial catalog (10 categories, 20 brands, 34 products, 4 packages)
python manage.py seed_db

# (Optional) Create superuser for Django Admin
python manage.py createsuperuser
# Default dev superuser: username 'admin', password 'admin123'

# Start Django development server
python manage.py runserver 127.0.0.1:8000
```

The Django REST API will be available at: **`http://127.0.0.1:8000/api/v1/`**  
The Django Admin panel will be available at: **`http://127.0.0.1:8000/admin/`**

---

### Step 2: Frontend Setup

Open a second terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install node dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Vite development server
npm run dev
```

The React frontend will be available at: **`http://localhost:5173/`** (or `http://localhost:5174/`).

---

## 4. Environment Variables

### Frontend (`frontend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000/api/v1` | Base URL pointing to the Django REST API |
| `VITE_USE_DEMO_DATA` | `false` | Set to `true` to force offline static catalog fallback |

### Backend (`backend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `SECRET_KEY` | *(dev default key)* | Django secret key (change in production) |
| `DEBUG` | `True` | Debug mode (`True` for local dev, `False` for production) |
| `ALLOWED_HOSTS` | `localhost,127.0.0.1` | Comma-separated list of permitted hostnames |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173,...` | Comma-separated list of allowed frontend origins |

---

## 5. Switching Between API Mode & Demo Mode

The frontend uses an **Adapter Service Layer Architecture**:

- **API Mode (`VITE_USE_DEMO_DATA=false`)**:
  All product catalogs, categories, brands, solar packages, and orders communicate directly with the live Django REST Framework backend. If an API request fails, an error is surfaced to the UI (no silent fallbacks).

- **Demo Mode (`VITE_USE_DEMO_DATA=true`)**:
  Useful for offline demos or client presentations when the backend is not running. All services immediately resolve from the local typed in-memory catalog with simulated latency.

---

---

## 6. Interactive OpenAPI & Swagger Documentation

The BD Solar Energy backend includes OpenAPI 3.0 schemas generated dynamically via `drf-spectacular`:

- **Interactive Swagger UI:** `http://127.0.0.1:8000/api/docs/`
- **Interactive Redoc:** `http://127.0.0.1:8000/api/redoc/`
- **Raw OpenAPI 3.0 Schema (YAML):** `http://127.0.0.1:8000/api/schema/`

---

## 7. Available REST API Endpoints

### Authentication & User Profiles (`/api/v1/auth/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register/` | Register new customer account (returns user object + JWT tokens) |
| `POST` | `/api/v1/auth/login/` | Obtain JWT access and refresh token pair |
| `POST` | `/api/v1/auth/token/refresh/` | Refresh access token with rotation |
| `POST` | `/api/v1/auth/logout/` | Blacklist refresh token upon user logout |
| `GET` | `/api/v1/auth/me/` | Retrieve current authenticated user profile |
| `PATCH` | `/api/v1/auth/me/` | Update profile information |
| `POST` | `/api/v1/auth/change-password/` | Change password with current password verification |
| `GET`/`POST` | `/api/v1/auth/addresses/` | List and create customer delivery addresses (single default address rule) |

### Products & Catalog (`/api/v1/products/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/products/` | Filter, search, and paginate product catalog |
| `GET` | `/api/v1/products/{id_or_slug}/` | Product details by UUID, slug, SKU, or legacy ID |
| `GET` | `/api/v1/products/featured/` | Featured & bestseller products |
| `GET` | `/api/v1/products/new-arrivals/` | New arrivals listing |
| `GET` | `/api/v1/products/on-sale/` | Products with discounts / originalPrice |
| `GET` | `/api/v1/products/live-search/?q=` | Autocomplete search for header search bar |
| `GET` | `/api/v1/products/{id_or_slug}/related/` | Related products in the same category |

### Categories & Brands (`/api/v1/categories/`, `/api/v1/brands/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/categories/` | All categories with nested subcategories & product counts (N+1 query optimized) |
| `GET` | `/api/v1/categories/{slug}/` | Category details by slug |
| `GET` | `/api/v1/brands/` | All brands with product counts and popularity flags |
| `GET` | `/api/v1/brands/{slug}/` | Brand details by slug |

### Solar Packages (`/api/v1/solar-packages/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/solar-packages/` | Turnkey residential & commercial solar packages |
| `GET` | `/api/v1/solar-packages/{slug}/` | Package details and included bill of materials |

### Shopping Cart (`/api/v1/cart/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/cart/` | Retrieve user cart (or session-based guest cart) |
| `POST` | `/api/v1/cart/items/` | Add item or increment quantity (validates stock availability) |
| `PATCH` | `/api/v1/cart/items/{id}/` | Update quantity of cart item |
| `DELETE` | `/api/v1/cart/items/{id}/` | Remove item from cart |
| `DELETE` | `/api/v1/cart/` | Clear shopping cart |

### Wishlist (`/api/v1/wishlist/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/wishlist/` | Retrieve user or guest wishlist |
| `POST` | `/api/v1/wishlist/` | Toggle product in wishlist |
| `DELETE` | `/api/v1/wishlist/{item_id}/` | Remove item from wishlist |

### Orders & Checkout (`/api/v1/orders/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/orders/` | Place order (atomic checkout, row locking, stock deduction, price verification) |
| `GET` | `/api/v1/orders/` | Authenticated customer order history (customer data isolation enforced) |
| `GET` | `/api/v1/orders/{orderNumber}/` | Detailed order summary for authorized customer or staff |
| `GET` | `/api/v1/orders/track/{orderNumber}/` | Public order tracking by order reference or courier tracking number |

### Customer Reviews (`/api/v1/reviews/`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/reviews/?product={id_or_slug}` | Approved reviews for product |
| `POST` | `/api/v1/reviews/` | Submit review (verifies buyer purchase history & recalculates product rating) |

---

## 8. Running Automated Tests

### Backend Test Suite
```bash
cd backend
.\venv\Scripts\python.exe manage.py test
```
Runs 25 automated unit and integration tests verifying:
- UUID primary keys across models (`accounts.User`, `Product`, `Order`, `Cart`, `Wishlist`, `SolarPackage`, etc.)
- JWT registration, login, token rotation, blacklisting logout, and password change
- Customer address constraints (single default address per customer)
- Shopping cart stock validation and session-to-user cart merging
- Wishlist toggle and deletion
- Atomic order creation, row-level locking (`select_for_update`), and stock deduction
- Customer data isolation (401 for anonymous list, 404 for cross-user order retrieval)
- Public order tracking by order reference or courier tracking number
- Customer product review creation, verified buyer flag, and rating aggregation

### Full-Stack Integration Verification
```bash
cd frontend
node scripts/test_integration.js
```
Runs 10 end-to-end integration assertions verifying CORS headers, live REST endpoints, order creation, tracking, and frontend HTTP responsiveness.

### Frontend Production Build
```bash
cd frontend
npm run build
```
Compiles TypeScript and bundles via Vite with 0 errors.

---

## 9. Configuring PostgreSQL for Production

For production deployment with PostgreSQL:

1. Install `psycopg2-binary`:
   ```bash
   pip install psycopg2-binary
   ```
2. Set `DATABASE_URL` in `backend/.env`:
   ```bash
   DATABASE_URL=postgres://bd_solar_user:db_password@localhost:5432/bdsolar_db
   ```
   Or set explicit connection variables: `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`.
3. Set `DEBUG=False` and configure your domain in `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`.
4. Apply migrations: `python manage.py migrate`.
5. Seed initial catalog: `python manage.py seed_db`.
