const API_BASE = 'http://127.0.0.1:8000/api/v1';

async function postJSON(endpoint, payload, token) {
  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function getJSON(endpoint, token) {
  const headers = { 'Accept': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers,
  });

  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

async function run() {
  console.log('--- Testing JWT Authentication End-to-End ---');

  // 1. Login with superuser admin
  const adminLogin = await postJSON('/auth/login/', {
    username: 'admin',
    password: 'admin123',
  });
  console.log('[TEST 1] Admin Login Status:', adminLogin.status);
  if (adminLogin.status !== 200 || !adminLogin.data.access) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminLogin.data));
  }
  console.log('[PASS] Admin received access & refresh tokens.');

  // 2. Fetch authenticated profile /api/v1/auth/me/
  const meRes = await getJSON('/auth/me/', adminLogin.data.access);
  console.log('[TEST 2] /api/v1/auth/me/ Status:', meRes.status, '| User:', meRes.data.username, '| Role:', meRes.data.role);
  if (meRes.status !== 200) {
    throw new Error('Me profile fetch failed: ' + JSON.stringify(meRes.data));
  }
  console.log('[PASS] /api/v1/auth/me/ verified authenticated user profile.');

  // 3. Register a new customer
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newCustomerEmail = `customer_${randomSuffix}@bdsolar.com`;
  const regRes = await postJSON('/auth/register/', {
    name: 'Shakib Al Hasan',
    email: newCustomerEmail,
    phone: `+880181234${randomSuffix}`,
    password: 'SecurePassword123!',
  });
  console.log('[TEST 3] Customer Registration Status:', regRes.status);
  if (regRes.status !== 201 || !regRes.data.tokens?.access) {
    throw new Error('Customer registration failed: ' + JSON.stringify(regRes.data));
  }
  console.log('[PASS] Customer registered and received JWT tokens directly.');

  // 4. Login with email instead of username
  const emailLogin = await postJSON('/auth/login/', {
    username: newCustomerEmail,
    password: 'SecurePassword123!',
  });
  console.log('[TEST 4] Login via Email Status:', emailLogin.status);
  if (emailLogin.status !== 200 || !emailLogin.data.access) {
    throw new Error('Email login failed: ' + JSON.stringify(emailLogin.data));
  }
  console.log('[PASS] Customer successfully logged in using email identifier.');

  // 5. Refresh token
  const refreshRes = await postJSON('/auth/token/refresh/', {
    refresh: emailLogin.data.refresh,
  });
  console.log('[TEST 5] Token Refresh Status:', refreshRes.status);
  if (refreshRes.status !== 200 || !refreshRes.data.access) {
    throw new Error('Token refresh failed');
  }
  console.log('[PASS] Access token successfully refreshed.');

  console.log('\nAll 5 JWT Authentication checks PASSED successfully!');
}

run().catch((err) => {
  console.error('[FAIL]', err.message);
  process.exit(1);
});
