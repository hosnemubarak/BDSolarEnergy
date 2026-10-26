async function runIntegrationTests() {
  console.log('--- Starting BD Solar Energy Full-Stack Integration Verification ---');
  let passed = 0;
  let failed = 0;

  async function check(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  const API_BASE = process.env.API_BASE || 'http://127.0.0.1:8001/api/v1';

  // 1. Backend root
  await check('Backend API root status is online', async () => {
    const res = await fetch(`${API_BASE}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error(`Expected online status, got ${data.status}`);
  });

  // 2. CORS header check
  await check('CORS headers allow frontend origin', async () => {
    const res = await fetch(`${API_BASE}/products/`, {
      headers: { Origin: 'http://localhost:5173' }
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    if (allowOrigin !== 'http://localhost:5173') {
      throw new Error(`Expected access-control-allow-origin: http://localhost:5173, got: ${allowOrigin}`);
    }
  });

  // 3. Products endpoint
  await check('Products list endpoint returns seeded catalog', async () => {
    const res = await fetch(`${API_BASE}/products/`);
    const data = await res.json();
    const count = data.count || (Array.isArray(data) ? data.length : 0);
    if (count < 30) throw new Error(`Expected at least 30 products, got ${count}`);
    const items = data.results || data;
    if (!items[0].specifications) throw new Error('Missing specifications field on product');
    if (!items[0].gallery || items[0].gallery.length === 0) throw new Error('Missing gallery images');
  });

  // 4. Featured products
  await check('Featured products endpoint returns products', async () => {
    const res = await fetch(`${API_BASE}/products/featured/`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error('Expected non-empty featured list');
  });

  // 5. Categories endpoint
  await check('Categories endpoint returns hierarchical categories with subcategories', async () => {
    const res = await fetch(`${API_BASE}/categories/`);
    const data = await res.json();
    const items = data.results || data;
    if (items.length < 10) throw new Error(`Expected at least 10 categories, got ${items.length}`);
    if (!items[0].subcategories || items[0].subcategories.length === 0) throw new Error('Missing subcategories');
  });

  // 6. Brands endpoint
  await check('Brands endpoint returns popular brands', async () => {
    const res = await fetch(`${API_BASE}/brands/`);
    const data = await res.json();
    const items = data.results || data;
    if (items.length < 15) throw new Error(`Expected at least 15 brands, got ${items.length}`);
  });

  // 7. Solar packages endpoint
  await check('Solar packages endpoint returns pre-engineered packages', async () => {
    const res = await fetch(`${API_BASE}/solar-packages/`);
    const data = await res.json();
    const items = data.results || data;
    if (items.length < 4) throw new Error(`Expected at least 4 solar packages, got ${items.length}`);
    if (!items[0].items || items[0].items.length === 0) throw new Error('Missing package components');
  });

  // 8. Order creation with backend calculation
  let createdOrderNumber = '';
  await check('Order creation endpoint recalculates pricing and saves order', async () => {
    const payload = {
      fullName: 'Ahsan Habib',
      phone: '+880 1812-987654',
      division: 'Dhaka',
      district: 'Dhaka',
      thanaArea: 'Gulshan 2',
      fullAddress: 'Road 55, House 14',
      paymentMethod: 'COD',
      couponCode: 'BDSOLAR5',
      items: [
        { productId: 'prod-sp-01', quantity: 2 }
      ]
    };

    const res = await fetch(`${API_BASE}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173'
      },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201) {
      const err = await res.text();
      throw new Error(`Expected 201 Created, got ${res.status}: ${err}`);
    }

    const order = await res.json();
    createdOrderNumber = order.orderNumber;
    if (!createdOrderNumber.startsWith('BDS-')) throw new Error(`Invalid orderNumber: ${createdOrderNumber}`);
    if (order.subtotal !== 37000) throw new Error(`Expected subtotal 37000, got ${order.subtotal}`);
    // 5% of 37000 = 1850 discount -> total = 35150
    if (order.discount !== 1850) throw new Error(`Expected discount 1850, got ${order.discount}`);
    if (order.total !== 35150) throw new Error(`Expected total 35150, got ${order.total}`);
  });

  // 9. Order tracking
  await check('Order tracking endpoint finds newly created order', async () => {
    const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(createdOrderNumber)}/`);
    if (!res.ok) throw new Error(`Failed to track order: HTTP ${res.status}`);
    const order = await res.json();
    if (order.orderNumber !== createdOrderNumber) throw new Error('Mismatched orderNumber in tracking');
  });

  // 10. Frontend Dev Server
  await check('Frontend dev server responds with HTTP 200', async () => {
    const res = await fetch('http://localhost:5173/');
    if (!res.ok) throw new Error(`Frontend returned HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('BD Solar Energy')) throw new Error('Frontend index HTML missing title');
  });

  console.log('---------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runIntegrationTests();
