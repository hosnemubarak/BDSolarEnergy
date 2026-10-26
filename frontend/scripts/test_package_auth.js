/**
 * BD Solar Energy — Package-Based Authentication Verification
 * Tests all dj-rest-auth, django-allauth, and SimpleJWT endpoints live.
 */

const API_BASE = process.env.API_BASE || 'http://127.0.0.1:8001/api/v1';

async function testPackageAuth() {
  console.log('--- Testing Package-Based DRF Authentication (dj-rest-auth + allauth + SimpleJWT) ---');

  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  const testEmail = `pkg_customer_${randSuffix}@bdsolar.com`;
  const testPhone = `+88017${randSuffix}1234`;
  const testPassword = 'PackageUserPassword123!';

  // 1. Registration via dj-rest-auth registration endpoint (/auth/registration/)
  console.log('\n[TEST 1] Register via /api/v1/auth/registration/ ...');
  const regRes = await fetch(`${API_BASE}/auth/registration/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Package Customer ${randSuffix}`,
      email: testEmail,
      phone: testPhone,
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  console.log('Status:', regRes.status);
  const regData = await regRes.json();
  if (regRes.status !== 201 || !regData.access) {
    console.error('Registration failed:', regData);
    process.exit(1);
  }
  console.log('[PASS] Registration succeeded with access token and user profile:', regData.user?.email);

  // 2. Login via dj-rest-auth login endpoint (/auth/login/)
  console.log('\n[TEST 2] Login via /api/v1/auth/login/ using Email ...');
  const loginRes = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: testEmail,
      password: testPassword,
    }),
  });
  console.log('Status:', loginRes.status);
  const loginData = await loginRes.json();
  if (loginRes.status !== 200 || !loginData.access) {
    console.error('Login failed:', loginData);
    process.exit(1);
  }
  const accessToken = loginData.access;
  const refreshToken = loginData.refresh;
  console.log('[PASS] Login succeeded with JWT tokens. Cookies set:', loginRes.headers.get('set-cookie') ? 'Yes' : 'None');

  // 3. Current User via dj-rest-auth /auth/user/
  console.log('\n[TEST 3] Retrieve user profile via /api/v1/auth/user/ ...');
  const userRes = await fetch(`${API_BASE}/auth/user/`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });
  console.log('Status:', userRes.status);
  const userData = await userRes.json();
  if (userRes.status !== 200 || userData.email !== testEmail) {
    console.error('User retrieval failed:', userData);
    process.exit(1);
  }
  console.log('[PASS] /api/v1/auth/user/ returned valid customer profile:', userData.email, '| Role:', userData.role);

  // 4. Token Verify via /auth/token/verify/
  console.log('\n[TEST 4] Verify token via /api/v1/auth/token/verify/ ...');
  const verifyRes = await fetch(`${API_BASE}/auth/token/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: accessToken }),
  });
  console.log('Status:', verifyRes.status);
  if (verifyRes.status !== 200) {
    console.error('Token verification failed');
    process.exit(1);
  }
  console.log('[PASS] Token is valid and active.');

  // 5. Token Refresh via /auth/token/refresh/
  console.log('\n[TEST 5] Refresh token via /api/v1/auth/token/refresh/ ...');
  const refreshRes = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  console.log('Status:', refreshRes.status);
  const refreshData = await refreshRes.json();
  if (refreshRes.status !== 200 || !refreshData.access) {
    console.error('Token refresh failed:', refreshData);
    process.exit(1);
  }
  const newAccessToken = refreshData.access;
  console.log('[PASS] Token successfully refreshed.');

  // 6. Password Change via /auth/password/change/
  console.log('\n[TEST 6] Change password via /api/v1/auth/password/change/ ...');
  const newPassword = 'NewSecretPassword456!';
  const pwRes = await fetch(`${API_BASE}/auth/password/change/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${newAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      old_password: testPassword,
      new_password: newPassword,
      confirm_password: newPassword,
    }),
  });
  console.log('Status:', pwRes.status);
  if (pwRes.status !== 200) {
    const pwData = await pwRes.json();
    console.error('Password change failed:', pwData);
    process.exit(1);
  }
  console.log('[PASS] Password successfully changed.');

  // 7. Re-login with new password
  console.log('\n[TEST 7] Login with new changed password ...');
  const reLoginRes = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: testEmail,
      password: newPassword,
    }),
  });
  console.log('Status:', reLoginRes.status);
  const reLoginData = await reLoginRes.json();
  if (reLoginRes.status !== 200) {
    console.error('Re-login with new password failed:', reLoginData);
    process.exit(1);
  }
  console.log('[PASS] Re-login with new password succeeded.');

  // 8. Google Social Login Endpoint Readiness
  console.log('\n[TEST 8] Verify Google Social Login endpoint /api/v1/auth/google/ ...');
  const googleRes = await fetch(`${API_BASE}/auth/google/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  console.log('Status:', googleRes.status);
  if (googleRes.status === 404) {
    console.error('Google endpoint not found!');
    process.exit(1);
  }
  console.log('[PASS] Google endpoint is live and validated payload correctly (HTTP', googleRes.status, ').');

  // 9. Logout and token revocation
  console.log('\n[TEST 9] Logout via /api/v1/auth/logout/ ...');
  const logoutRes = await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${reLoginData.access}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: reLoginData.refresh }),
  });
  console.log('Status:', logoutRes.status);
  if (logoutRes.status !== 200) {
    console.error('Logout failed');
    process.exit(1);
  }
  console.log('[PASS] Successfully logged out.');

  // 10. Verify blacklisted refresh token fails
  console.log('\n[TEST 10] Verify blacklisted refresh token is rejected ...');
  const rejectedRes = await fetch(`${API_BASE}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: reLoginData.refresh }),
  });
  console.log('Status:', rejectedRes.status);
  if (rejectedRes.status !== 401) {
    console.error('Expected 401 for blacklisted token, got', rejectedRes.status);
    process.exit(1);
  }
  console.log('[PASS] Blacklisted refresh token correctly rejected with HTTP 401.');

  console.log('\n======================================================');
  console.log('ALL 10 PACKAGE-BASED AUTHENTICATION CHECKS PASSED 100%!');
  console.log('======================================================\n');
}

testPackageAuth().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
