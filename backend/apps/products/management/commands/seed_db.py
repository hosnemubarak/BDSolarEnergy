import json
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.conf import settings
from django.db import transaction

from apps.categories.models import Category, Subcategory
from apps.brands.models import Brand
from apps.products.models import Product, ProductImage
from apps.solar_packages.models import SolarPackage, SolarPackageItem


class Command(BaseCommand):
    help = 'Seeds database with realistic solar & electrical equipment catalog with UUID primary keys'

    def handle(self, *args, **options):
        json_path = settings.BASE_DIR / 'seed_data.json'
        if not json_path.exists():
            self.stderr.write(self.style.ERROR(f"Seed file not found at {json_path}"))
            return

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        self.stdout.write("Beginning database seeding with UUID schema...")

        with transaction.atomic():
            # 1. Categories and Subcategories
            categories_count = 0
            subcategories_count = 0
            for idx, cat_data in enumerate(data.get('categories', [])):
                cat_slug = cat_data['slug']
                category, _ = Category.objects.update_or_create(
                    slug=cat_slug,
                    defaults={
                        'name': cat_data['name'],
                        'description': cat_data.get('description', ''),
                        'icon_name': cat_data.get('iconName', 'Sun'),
                        'featured_image': cat_data.get('featuredImage', '/images/solar-panel.svg'),
                        'display_order': idx,
                        'is_active': True,
                    }
                )
                categories_count += 1

                for s_idx, sub_data in enumerate(cat_data.get('subcategories', [])):
                    Subcategory.objects.update_or_create(
                        slug=sub_data['slug'],
                        defaults={
                            'name': sub_data['name'],
                            'category': category,
                            'display_order': s_idx,
                            'is_active': True,
                        }
                    )
                    subcategories_count += 1

            self.stdout.write(self.style.SUCCESS(
                f"Seeded {categories_count} Categories and {subcategories_count} Subcategories."
            ))

            # 2. Brands
            brands_count = 0
            for b_data in data.get('brands', []):
                Brand.objects.update_or_create(
                    slug=b_data['slug'],
                    defaults={
                        'name': b_data['name'],
                        'country': b_data.get('country', ''),
                        'description': b_data.get('description', ''),
                        'logo': b_data.get('logo', ''),
                        'is_popular': b_data.get('isPopular', False),
                        'is_active': True,
                    }
                )
                brands_count += 1

            self.stdout.write(self.style.SUCCESS(f"Seeded {brands_count} Brands."))

            # 3. Products
            products_count = 0
            for p_data in data.get('products', []):
                cat_id = p_data.get('categoryId')
                subcat_id = p_data.get('subcategoryId')
                brand_name = p_data.get('brand', '')

                # Resolve category by slug or id
                category = Category.objects.filter(slug=cat_id).first()
                if not category:
                    category = Category.objects.first()

                # Resolve subcategory by slug
                subcategory = Subcategory.objects.filter(slug=subcat_id).first()

                # Resolve brand by name or slug
                brand = Brand.objects.filter(name__iexact=brand_name).first()
                if not brand:
                    brand_slug = brand_name.lower().replace(' ', '-')
                    brand, _ = Brand.objects.get_or_create(
                        slug=brand_slug,
                        defaults={'name': brand_name}
                    )

                product, _ = Product.objects.update_or_create(
                    slug=p_data['slug'],
                    defaults={
                        'legacy_id': p_data['id'],
                        'name': p_data['name'],
                        'sku': p_data.get('sku', f"SKU-{p_data['id']}"),
                        'description': p_data.get('description', ''),
                        'short_description': p_data.get('shortDescription', ''),
                        'price': Decimal(str(p_data['price'])),
                        'original_price': Decimal(str(p_data['originalPrice'])) if p_data.get('originalPrice') else None,
                        'currency': p_data.get('currency', 'BDT'),
                        'image': p_data.get('image', '/images/solar-panel.svg'),
                        'category': category,
                        'subcategory': subcategory,
                        'brand': brand,
                        'stock': p_data.get('stock', 20),
                        'in_stock': p_data.get('inStock', True),
                        'rating': Decimal(str(p_data.get('rating', 4.8))),
                        'review_count': p_data.get('reviewCount', 10),
                        'specifications': p_data.get('specifications', {}),
                        'highlights': p_data.get('highlights', []),
                        'badges': p_data.get('badges', []),
                        'is_featured': p_data.get('isFeatured', False),
                        'is_bestseller': p_data.get('isBestSeller', False),
                        'is_on_sale': p_data.get('isOnSale', False),
                        'is_new_arrival': p_data.get('isNewArrival', False),
                        'installation_support_available': p_data.get('installationSupportAvailable', True),
                        'compatibility_notes': p_data.get('compatibilityNotes', ''),
                        'is_active': True,
                    }
                )

                # Gallery images
                ProductImage.objects.filter(product=product).delete()
                gallery = p_data.get('gallery', [p_data.get('image', '/images/solar-panel.svg')])
                for idx, img_url in enumerate(gallery):
                    ProductImage.objects.create(
                        product=product,
                        image=img_url,
                        display_order=idx,
                        is_primary=(idx == 0)
                    )

                products_count += 1

            self.stdout.write(self.style.SUCCESS(f"Seeded {products_count} Products with gallery images."))

            # 4. Solar Packages
            packages_count = 0
            for pkg_data in data.get('solarPackages', []):
                package, _ = SolarPackage.objects.update_or_create(
                    slug=pkg_data['slug'],
                    defaults={
                        'legacy_id': pkg_data['id'],
                        'title': pkg_data['title'],
                        'tagline': pkg_data.get('tagline', ''),
                        'system_type': pkg_data.get('systemType', 'Residential Hybrid'),
                        'daily_generation_estimate_kwh': Decimal(str(pkg_data.get('dailyGenerationEstimateKwh', 0))),
                        'price': Decimal(str(pkg_data['price'])),
                        'original_price': Decimal(str(pkg_data['originalPrice'])) if pkg_data.get('originalPrice') else None,
                        'savings_monthly_estimate_bdt': Decimal(str(pkg_data.get('savingsMonthlyEstimateBdt', 0))),
                        'warranty_summary': pkg_data.get('warrantySummary', ''),
                        'ideal_for': pkg_data.get('idealFor', ''),
                        'image': pkg_data.get('image', '/images/solar-package.svg'),
                        'features': pkg_data.get('features', []),
                        'specifications': pkg_data.get('specifications', {}),
                        'installation_included': pkg_data.get('installationIncluded', True),
                        'net_metering_eligible': pkg_data.get('netMeteringEligible', False),
                        'is_active': True,
                    }
                )

                SolarPackageItem.objects.filter(package=package).delete()
                for item_data in pkg_data.get('items', []):
                    prod = Product.objects.filter(legacy_id=item_data.get('productId')).first()
                    SolarPackageItem.objects.create(
                        package=package,
                        product=prod,
                        raw_product_id=item_data.get('productId', ''),
                        product_name=item_data.get('productName', ''),
                        quantity=item_data.get('quantity', 1),
                        category=item_data.get('category', ''),
                        specs_summary=item_data.get('specsSummary', ''),
                    )

                packages_count += 1

            self.stdout.write(self.style.SUCCESS(f"Seeded {packages_count} Solar Packages with component items."))

        self.stdout.write(self.style.SUCCESS("Database seeding with UUID architecture completed successfully!"))
