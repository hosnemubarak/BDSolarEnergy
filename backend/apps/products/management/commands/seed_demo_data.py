import uuid
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db.models import Avg

from apps.accounts.models import CustomerAddress
from apps.products.models import Product
from apps.orders.models import Order, OrderItem
from apps.reviews.models import ProductReview
from apps.cart.models import Cart, CartItem
from apps.wishlist.models import Wishlist, WishlistItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed realistic customer accounts, orders, reviews, cart, and wishlist demo data in PostgreSQL'

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Seeding comprehensive demo data into PostgreSQL..."))

        # 1. Create Demo Users
        users_data = [
            {
                'username': 'tanvir',
                'email': 'tanvir@bdsolar.com',
                'phone': '+8801712345678',
                'first_name': 'Tanvir',
                'last_name': 'Hossain',
                'role': 'customer',
                'password': 'Password123!',
            },
            {
                'username': 'anika',
                'email': 'anika@bdsolar.com',
                'phone': '+8801819987654',
                'first_name': 'Dr. Anika',
                'last_name': 'Rahman',
                'role': 'customer',
                'password': 'Password123!',
            },
            {
                'username': 'kamal_engineer',
                'email': 'kamal@solarsolutions.bd',
                'phone': '+8801911223344',
                'first_name': 'Engr. Kamal',
                'last_name': 'Uddin',
                'role': 'customer',
                'password': 'Password123!',
            },
        ]

        created_users = {}
        for u in users_data:
            user, created = User.objects.get_or_create(
                email=u['email'],
                defaults={
                    'username': u['username'],
                    'phone': u['phone'],
                    'first_name': u['first_name'],
                    'last_name': u['last_name'],
                    'role': u['role'],
                    'is_verified': True,
                }
            )
            if created or not user.check_password(u['password']):
                user.set_password(u['password'])
                user.save()
            created_users[u['username']] = user

        tanvir = created_users['tanvir']
        anika = created_users['anika']
        kamal = created_users['kamal_engineer']

        self.stdout.write(self.style.SUCCESS(f"Created/verified {len(created_users)} customer accounts."))

        # 2. Customer Delivery Addresses
        addresses_data = [
            {
                'user': tanvir,
                'full_name': 'Md. Tanvir Hossain',
                'phone': '+8801712345678',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana_area': 'Dhanmondi, Road 27',
                'full_address': 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
                'postal_code': '1209',
                'is_default': True,
            },
            {
                'user': tanvir,
                'full_name': 'Hossain Solar Workshop',
                'phone': '+8801819987654',
                'division': 'Chittagong',
                'district': 'Chittagong',
                'thana_area': 'Pahartali Industrial Zone',
                'full_address': 'Plot 18, Block B, Pahartali Industrial Area, Chittagong',
                'postal_code': '4202',
                'is_default': False,
            },
            {
                'user': anika,
                'full_name': 'Dr. Anika Rahman',
                'phone': '+8801819987654',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana_area': 'Uttara Sector 7',
                'full_address': 'House 12, Road 4, Sector 7, Uttara, Dhaka-1230',
                'postal_code': '1230',
                'is_default': True,
            },
            {
                'user': kamal,
                'full_name': 'Engr. Kamal Uddin',
                'phone': '+8801911223344',
                'division': 'Chittagong',
                'district': 'Chittagong',
                'thana_area': 'Nasirabad GEC',
                'full_address': 'GEC Circle, Nasirabad, Chittagong',
                'postal_code': '4000',
                'is_default': True,
            },
        ]

        for addr in addresses_data:
            CustomerAddress.objects.get_or_create(
                user=addr['user'],
                full_address=addr['full_address'],
                defaults=addr
            )
        self.stdout.write(self.style.SUCCESS("Customer addresses seeded."))

        # 3. Find catalog products to use in orders and reviews
        p_trina = Product.objects.filter(slug__icontains='trina').first() or Product.objects.first()
        p_growatt = Product.objects.filter(slug__icontains='growatt').first()
        p_pylontech = Product.objects.filter(slug__icontains='pylontech').first()
        p_longi = Product.objects.filter(slug__icontains='longi').first()
        p_cable = Product.objects.filter(slug__icontains='cable').first()
        p_mcb = Product.objects.filter(slug__icontains='mcb').first() or Product.objects.filter(slug__icontains='breaker').first()
        p_huawei = Product.objects.filter(slug__icontains='huawei').first()

        # 4. Realistic Demo Orders
        orders_data = [
            {
                'user': tanvir,
                'order_number': 'BDS-2026-94812',
                'status': 'delivered',
                'payment_method': 'BKASH',
                'payment_status': 'paid',
                'courier_name': 'Steadfast Courier',
                'tracking_number': 'ST-BD-8821947',
                'estimated_delivery_date': '2026-03-15',
                'full_name': 'Md. Tanvir Hossain',
                'phone': '+8801712345678',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana_area': 'Dhanmondi, Road 27',
                'full_address': 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
                'postal_code': '1209',
                'coupon_code': 'BDSOLAR5',
                'discount': Decimal('4425.00'),
                'shipping_fee': Decimal('0.00'),
                'items': [
                    {'product': p_trina, 'qty': 4},
                    {'product': p_cable, 'qty': 1},
                ]
            },
            {
                'user': tanvir,
                'order_number': 'BDS-2026-95240',
                'status': 'shipped',
                'payment_method': 'COD',
                'payment_status': 'unpaid',
                'courier_name': 'Pathao Courier',
                'tracking_number': 'PTH-741920',
                'estimated_delivery_date': '2026-04-05',
                'full_name': 'Md. Tanvir Hossain',
                'phone': '+8801712345678',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana_area': 'Dhanmondi, Road 27',
                'full_address': 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
                'postal_code': '1209',
                'discount': Decimal('0.00'),
                'shipping_fee': Decimal('300.00'),
                'items': [
                    {'product': p_mcb, 'qty': 2},
                    {'product': p_growatt, 'qty': 1},
                ]
            },
            {
                'user': tanvir,
                'order_number': 'BDS-2026-96105',
                'status': 'processing',
                'payment_method': 'NAGAD',
                'payment_status': 'paid',
                'courier_name': 'Sundarban Courier Service',
                'tracking_number': 'SCS-DH-90112',
                'estimated_delivery_date': '2026-04-18',
                'full_name': 'Md. Tanvir Hossain',
                'phone': '+8801712345678',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana_area': 'Dhanmondi, Road 27',
                'full_address': 'House 42, Flat 5B, Road 27, Dhanmondi, Dhaka-1209',
                'postal_code': '1209',
                'discount': Decimal('0.00'),
                'shipping_fee': Decimal('500.00'),
                'items': [
                    {'product': p_pylontech, 'qty': 1},
                ]
            },
            {
                'user': anika,
                'order_number': 'BDS-2026-97300',
                'status': 'confirmed',
                'payment_method': 'COD',
                'payment_status': 'unpaid',
                'courier_name': 'RedX Delivery',
                'tracking_number': 'RDX-883011',
                'estimated_delivery_date': '2026-04-22',
                'full_name': 'Dr. Anika Rahman',
                'phone': '+8801819987654',
                'division': 'Dhaka',
                'district': 'Dhaka',
                'thana_area': 'Uttara Sector 7',
                'full_address': 'House 12, Road 4, Sector 7, Uttara, Dhaka-1230',
                'postal_code': '1230',
                'discount': Decimal('1500.00'),
                'shipping_fee': Decimal('0.00'),
                'items': [
                    {'product': p_longi, 'qty': 6},
                    {'product': p_cable, 'qty': 2},
                ]
            },
            {
                'user': kamal,
                'order_number': 'BDS-2026-98110',
                'status': 'delivered',
                'payment_method': 'BANK_TRANSFER',
                'payment_status': 'paid',
                'courier_name': 'Dedicated Cargo Freight',
                'tracking_number': 'DCF-CTG-0914',
                'estimated_delivery_date': '2026-03-28',
                'full_name': 'Engr. Kamal Uddin',
                'phone': '+8801911223344',
                'division': 'Chittagong',
                'district': 'Chittagong',
                'thana_area': 'Nasirabad GEC',
                'full_address': 'GEC Circle, Nasirabad, Chittagong',
                'postal_code': '4000',
                'discount': Decimal('5000.00'),
                'shipping_fee': Decimal('1200.00'),
                'items': [
                    {'product': p_huawei, 'qty': 1},
                    {'product': p_trina, 'qty': 10},
                    {'product': p_cable, 'qty': 4},
                ]
            },
        ]

        for od in orders_data:
            existing_order = Order.objects.filter(order_number=od['order_number']).first()
            if existing_order:
                continue

            subtotal = Decimal('0.00')
            valid_items = [it for it in od['items'] if it['product']]
            for it in valid_items:
                subtotal += it['product'].price * it['qty']

            total = subtotal - od['discount'] + od['shipping_fee']

            order = Order.objects.create(
                user=od['user'],
                order_number=od['order_number'],
                status=od['status'],
                payment_method=od['payment_method'],
                payment_status=od['payment_status'],
                courier_name=od['courier_name'],
                tracking_number=od['tracking_number'],
                estimated_delivery_date=od['estimated_delivery_date'],
                full_name=od['full_name'],
                phone=od['phone'],
                division=od['division'],
                district=od['district'],
                thana_area=od['thana_area'],
                full_address=od['full_address'],
                postal_code=od['postal_code'],
                subtotal=subtotal,
                discount=od['discount'],
                coupon_code=od.get('coupon_code', ''),
                shipping_fee=od['shipping_fee'],
                total=total,
            )

            for it in valid_items:
                p = it['product']
                OrderItem.objects.create(
                    order=order,
                    product=p,
                    raw_product_id=str(p.id),
                    name=p.name,
                    sku=p.sku,
                    price=p.price,
                    quantity=it['qty'],
                    image=p.image,
                    subtotal=p.price * it['qty']
                )

        self.stdout.write(self.style.SUCCESS("Demo orders with items and shipping tracking created."))

        # 5. Authentic Product Reviews with Verified Buyer badges
        reviews_data = [
            # Trina Solar
            {
                'product': p_trina,
                'user': tanvir,
                'reviewer_name': 'Md. Tanvir Hossain',
                'rating': 5,
                'title': 'Outstanding yield even on hazy winter days',
                'comment': 'Installed 4 panels on our Dhanmondi rooftop. The dual-glass construction is very rigid and withstands strong winds. Generating over 12 kWh per day!',
                'is_verified_purchase': True,
            },
            {
                'product': p_trina,
                'user': kamal,
                'reviewer_name': 'Engr. Kamal Uddin',
                'rating': 5,
                'title': 'Bifacial gain gives extra 15-20% boost',
                'comment': 'High efficiency TOPCon cells. Coupled with white cement painted roof, the rear side reflection gives impressive additional output during midday.',
                'is_verified_purchase': True,
            },
            {
                'product': p_trina,
                'user': None,
                'reviewer_name': 'Shamsul Alam',
                'rating': 5,
                'title': 'Original product with clean packaging',
                'comment': 'Prompt delivery inside Dhaka. Original barcode scanned and verified on Trina Solar official verification portal.',
                'is_verified_purchase': False,
            },

            # Growatt Inverter
            {
                'product': p_growatt,
                'user': tanvir,
                'reviewer_name': 'Md. Tanvir Hossain',
                'rating': 5,
                'title': 'Smooth switchover with zero flicker for computers',
                'comment': 'Can run with or without battery. Seamless UPS mode transfer time (<10ms). Runs our AC and refrigerator effortlessly.',
                'is_verified_purchase': True,
            },
            {
                'product': p_growatt,
                'user': None,
                'reviewer_name': 'Tariqul Islam',
                'rating': 4,
                'title': 'Great hybrid inverter, setup wifi takes patience',
                'comment': 'Solid performance. The ShineWiFi-F app configuration took a few tries to link to our home 2.4GHz router, but monitoring works great now.',
                'is_verified_purchase': False,
            },

            # Pylontech LiFePO4
            {
                'product': p_pylontech,
                'user': tanvir,
                'reviewer_name': 'Md. Tanvir Hossain',
                'rating': 5,
                'title': '6000 cycles with 95% DoD — true peace of mind',
                'comment': 'Upgraded from heavy tubular lead-acid batteries. The difference in size, weight, and usable capacity is night and day. CAN communication with Growatt is plug-and-play.',
                'is_verified_purchase': True,
            },
            {
                'product': p_pylontech,
                'user': None,
                'reviewer_name': 'Hasan Mahmud',
                'rating': 5,
                'title': 'Safest battery chemistry for apartment installations',
                'comment': 'LiFePO4 does not release toxic fumes or acid spills. Extremely compact rack-mount form factor.',
                'is_verified_purchase': False,
            },

            # Longi Solar Panel
            {
                'product': p_longi,
                'user': anika,
                'reviewer_name': 'Dr. Anika Rahman',
                'rating': 5,
                'title': 'Excellent low-light performance',
                'comment': 'Produces power even during overcast monsoon skies. Very happy with the aesthetic dark black look on our rooftop garden.',
                'is_verified_purchase': True,
            },

            # DC Cable
            {
                'product': p_cable,
                'user': tanvir,
                'reviewer_name': 'Md. Tanvir Hossain',
                'rating': 5,
                'title': 'Pure tinned copper with heavy insulation',
                'comment': 'Tested with multimeter under full midday load. Zero noticeable voltage drop across 35 meters run from roof to ground floor.',
                'is_verified_purchase': True,
            },

            # Circuit Breaker
            {
                'product': p_mcb,
                'user': tanvir,
                'reviewer_name': 'Md. Tanvir Hossain',
                'rating': 5,
                'title': 'Essential safety for solar DC distribution',
                'comment': 'Authentic Schneider breaker. Fast tripping response and solid rail mounting.',
                'is_verified_purchase': True,
            },

            # Huawei Commercial Inverter
            {
                'product': p_huawei,
                'user': kamal,
                'reviewer_name': 'Engr. Kamal Uddin',
                'rating': 5,
                'title': '98.6% efficiency in commercial rooftop project',
                'comment': 'Installed in a factory rooftop in Gazipur. AI-powered AFCI arc fault protection gives immense security for fire prevention.',
                'is_verified_purchase': True,
            },
        ]

        seeded_reviews_count = 0
        products_to_recalculate = set()

        for rev in reviews_data:
            if not rev['product']:
                continue
            r, created = ProductReview.objects.get_or_create(
                product=rev['product'],
                reviewer_name=rev['reviewer_name'],
                defaults={
                    'user': rev['user'],
                    'rating': rev['rating'],
                    'title': rev['title'],
                    'comment': rev['comment'],
                    'is_verified_purchase': rev['is_verified_purchase'],
                    'is_approved': True,
                }
            )
            if created:
                seeded_reviews_count += 1
                products_to_recalculate.add(rev['product'])

        # Recalculate ratings on reviewed products
        for prod in products_to_recalculate:
            avg = ProductReview.objects.filter(product=prod, is_approved=True).aggregate(Avg('rating'))['rating__avg'] or 5.0
            prod.rating = Decimal(str(round(avg, 2)))
            prod.review_count = ProductReview.objects.filter(product=prod, is_approved=True).count()
            prod.save(update_fields=['rating', 'review_count'])

        self.stdout.write(self.style.SUCCESS(f"Seeded {seeded_reviews_count} authentic customer product reviews."))

        # 6. Active Shopping Cart for Tanvir
        cart, _ = Cart.objects.get_or_create(user=tanvir)
        if p_trina and not CartItem.objects.filter(cart=cart, product=p_trina).exists():
            CartItem.objects.create(cart=cart, product=p_trina, quantity=2)
        if p_cable and not CartItem.objects.filter(cart=cart, product=p_cable).exists():
            CartItem.objects.create(cart=cart, product=p_cable, quantity=1)

        # 7. Wishlist for Tanvir
        wishlist, _ = Wishlist.objects.get_or_create(user=tanvir)
        for wp in [p_growatt, p_pylontech, p_mcb]:
            if wp and not WishlistItem.objects.filter(wishlist=wishlist, product=wp).exists():
                WishlistItem.objects.create(wishlist=wishlist, product=wp)

        self.stdout.write(self.style.SUCCESS("Cart & Wishlist demo items seeded for Tanvir."))
        self.stdout.write(self.style.SUCCESS("ALL PostgreSQL demo data seeded successfully!"))
