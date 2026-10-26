# Frontend Data Architecture

In accordance with full-stack requirements, all dynamic business data (products, categories, subcategories, brands, solar packages, pricing, inventory, and reviews) is served authoritatively by the Django REST Framework backend API (`/api/v1/`).

The frontend runtime contains zero static business datasets or mock arrays.
Sample development products are managed through backend fixtures and management commands (`python manage.py seed_db`).
