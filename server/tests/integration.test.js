const assert = require('assert');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ${colors.red}✗${colors.reset} ${name}`);
    console.error(`    ${colors.red}Error:${colors.reset}`, err.message);
    failed++;
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const fetchOptions = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, fetchOptions);
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { status: res.status, ok: res.ok, data };
}

async function runAllTests() {
  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log(`  THE BOOKMARKET: COMPREHENSIVE TEST SUITE`);
  console.log(`========================================${colors.reset}\n`);

  // --- HEALTH CHECK ---
  console.log(`${colors.bold}1. Health & Server Infrastructure${colors.reset}`);
  await test('GET /health returns 200 with status "ok"', async () => {
    const res = await request('/health');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'ok');
    assert.ok(typeof res.data.uptime === 'number');
  });

  // --- AUTHENTICATION TESTS ---
  console.log(`\n${colors.bold}2. Authentication & Security${colors.reset}`);

  const testEmail = `testuser_${Date.now()}@example.com`;
  let authToken = '';
  let authUserId = '';

  await test('POST /api/auth/register fails if required fields are missing', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: { name: 'Incomplete User' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('POST /api/auth/register fails if password is too short (<6 chars)', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Short Pass',
        email: `short_${Date.now()}@example.com`,
        password: '123',
        phoneOrWhatsApp: '+14155551234',
        city: 'Austin, TX',
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('POST /api/auth/register successfully creates user & returns JWT', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Jordan Lee',
        email: testEmail,
        password: 'password123',
        phoneOrWhatsApp: '+14155559876',
        city: 'Portland, OR',
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token, 'Token must be returned');
    assert.ok(res.data.user, 'User payload must be returned');
    assert.strictEqual(res.data.user.email, testEmail);
    assert.strictEqual(res.data.user.password, undefined, 'Password must not be returned');

    authToken = res.data.token;
    authUserId = res.data.user._id;
  });

  await test('POST /api/auth/register prevents duplicate email registration', async () => {
    const res = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Jordan Duplicate',
        email: testEmail,
        password: 'password123',
        phoneOrWhatsApp: '+14155559876',
        city: 'Portland, OR',
      },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('POST /api/auth/login succeeds with valid credentials', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'password123',
      },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.token);
    assert.strictEqual(res.data.user.email, testEmail);
  });

  await test('POST /api/auth/login fails with wrong password', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: testEmail,
        password: 'wrong_password',
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  await test('POST /api/auth/login fails with unregistered email', async () => {
    const res = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'nobody_exists_here@domain.com',
        password: 'password123',
      },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  await test('GET /api/auth/me succeeds with valid Bearer token', async () => {
    const res = await request('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.user.email, testEmail);
  });

  await test('GET /api/auth/me rejects request without token (401)', async () => {
    const res = await request('/api/auth/me');
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  await test('GET /api/auth/me rejects request with forged token (401)', async () => {
    const res = await request('/api/auth/me', {
      headers: { Authorization: 'Bearer forged.invalid.token' },
    });
    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.data.success, false);
  });

  // --- BOOK MARKETPLACE TESTS ---
  console.log(`\n${colors.bold}3. Book Catalog & Filtering${colors.reset}`);

  await test('GET /api/books returns paginated listings', async () => {
    const res = await request('/api/books?limit=5');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(Array.isArray(res.data.data));
    assert.ok(res.data.pagination);
    assert.ok(res.data.pagination.total >= 10);
  });

  await test('GET /api/books filters accurately by genre', async () => {
    const res = await request('/api/books?genre=Engineering%20%26%20CS');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length > 0);
    res.data.data.forEach((b) => {
      assert.strictEqual(b.genre, 'Engineering & CS');
    });
  });

  await test('GET /api/books filters accurately by condition', async () => {
    const res = await request('/api/books?condition=Brand%20New');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    res.data.data.forEach((b) => {
      assert.strictEqual(b.condition, 'Brand New');
    });
  });

  await test('GET /api/books filters accurately by price range', async () => {
    const res = await request('/api/books?minPrice=10&maxPrice=25');
    assert.strictEqual(res.status, 200);
    res.data.data.forEach((b) => {
      assert.ok(b.price >= 10 && b.price <= 25);
    });
  });

  await test('GET /api/books search query matches title or author', async () => {
    const res = await request('/api/books?search=Data-Intensive');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.data.length >= 1);
    assert.ok(res.data.data[0].title.includes('Data-Intensive'));
  });

  // --- CRUD & SELLER OWNERSHIP TESTS ---
  console.log(`\n${colors.bold}4. Listing CRUD & Seller Ownership Control${colors.reset}`);

  let createdBookId = '';

  await test('POST /api/books creates new listing for authenticated user', async () => {
    const res = await request('/api/books', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        title: 'Introduction to Algorithms (CLRS 4th Edition)',
        author: 'Thomas H. Cormen',
        isbn: '9780262046305',
        genre: 'Engineering & CS',
        condition: 'Like New',
        price: 45,
        originalPrice: 95,
        description: 'Hardcover algorithms textbook. Clean pages, no highlighting, tight binding.',
        city: 'Portland, OR',
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.title, 'Introduction to Algorithms (CLRS 4th Edition)');
    assert.strictEqual(res.data.data.status, 'available');
    assert.strictEqual(res.data.data.seller._id, authUserId);
    createdBookId = res.data.data._id;
  });

  await test('GET /api/books/:id fetches book with populated seller info', async () => {
    const res = await request(`/api/books/${createdBookId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.strictEqual(res.data.data.seller.name, 'Jordan Lee');
    assert.strictEqual(res.data.data.seller.phoneOrWhatsApp, '+14155559876');
  });

  await test('PATCH /api/books/:id/status allows owner to update status to "reserved"', async () => {
    const res = await request(`/api/books/${createdBookId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}` },
      body: { status: 'reserved' },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.status, 'reserved');
  });

  await test('PATCH /api/books/:id/status rejects unauthorized user (403)', async () => {
    // Log in with demo seller
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'seller@bookmarket.com', password: 'password123' },
    });
    const demoSellerToken = loginRes.data.token;

    // Attempt to mutate Jordan Lee's book
    const res = await request(`/api/books/${createdBookId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${demoSellerToken}` },
      body: { status: 'sold' },
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.data.success, false);
  });

  await test('GET /api/books/my/listings returns owner listings & calculated stats', async () => {
    const res = await request('/api/books/my/listings', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length >= 1);
    assert.ok(res.data.stats);
    assert.strictEqual(typeof res.data.stats.totalListings, 'number');
    assert.strictEqual(typeof res.data.stats.estimatedRevenue, 'number');
  });

  await test('DELETE /api/books/:id rejects unauthorized deletion attempt (403)', async () => {
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: { email: 'buyer@bookmarket.com', password: 'password123' },
    });
    const buyerToken = loginRes.data.token;

    const res = await request(`/api/books/${createdBookId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${buyerToken}` },
    });
    assert.strictEqual(res.status, 403);
  });

  await test('DELETE /api/books/:id allows owner to remove listing', async () => {
    const res = await request(`/api/books/${createdBookId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
  });

  await test('GET /api/books/:id returns 404 after deletion', async () => {
    const res = await request(`/api/books/${createdBookId}`);
    assert.strictEqual(res.status, 404);
  });

  // --- DIRECT PEER BUY INQUIRIES & DUAL BUYER/SELLER ROLE ---
  console.log(`\n${colors.bold}5. Direct Peer Buy Inquiries & Dual Buyer/Seller Roles${colors.reset}`);

  // Create another listing with Jordan Lee (acting as seller)
  const bookForInquiryRes = await request('/api/books', {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: {
      title: 'Operating Systems: Three Easy Pieces',
      author: 'Remzi H. Arpaci-Dusseau',
      genre: 'Engineering & CS',
      condition: 'Like New',
      price: 20,
      originalPrice: 40,
      description: 'Clear textbook on virtualization, concurrency, and persistence.',
      city: 'Portland, OR',
    },
  });
  const bookForInquiryId = bookForInquiryRes.data.data._id;

  // Login as Maya Lin (buyer@bookmarket.com)
  const buyerLogin = await request('/api/auth/login', {
    method: 'POST',
    body: { email: 'buyer@bookmarket.com', password: 'password123' },
  });
  const buyerToken = buyerLogin.data.token;

  await test('POST /api/books/:id/inquire allows a buyer to submit a direct purchase inquiry', async () => {
    const res = await request(`/api/books/${bookForInquiryId}/inquire`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        message: 'Hi Jordan, can we meet at the downtown public library tomorrow at 4 PM?',
        preferredMeetup: 'Downtown Public Library',
      },
    });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.inquiry);
    assert.strictEqual(res.data.inquiry.buyerName, 'Maya Lin');
    assert.strictEqual(res.data.inquiry.buyerEmail, 'buyer@bookmarket.com');
    assert.strictEqual(res.data.seller.name, 'Jordan Lee');
  });

  await test('POST /api/books/:id/inquire prevents a seller from inquiring on their own listing (400)', async () => {
    const res = await request(`/api/books/${bookForInquiryId}/inquire`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` }, // Jordan Lee attempting to buy his own book
      body: { message: 'Attempting self-buy' },
    });
    assert.strictEqual(res.status, 400);
    assert.strictEqual(res.data.success, false);
  });

  await test('GET /api/books/my/inquiries returns buyer direct purchase inquiries with seller contact', async () => {
    const res = await request('/api/books/my/inquiries', {
      headers: { Authorization: `Bearer ${buyerToken}` },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.success, true);
    assert.ok(res.data.data.length >= 1);
    const found = res.data.data.find((item) => item.book._id === bookForInquiryId);
    assert.ok(found, 'Buyer must see their direct buy inquiry');
    assert.strictEqual(found.book.seller.name, 'Jordan Lee');
    assert.ok(found.book.seller.phoneOrWhatsApp);
  });

  await test('GET /api/books/my/listings returns incoming buyer inquiry on seller dashboard', async () => {
    const res = await request('/api/books/my/listings', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert.strictEqual(res.status, 200);
    const targetBook = res.data.data.find((b) => b._id === bookForInquiryId);
    assert.ok(targetBook);
    assert.ok(targetBook.inquiries && targetBook.inquiries.length >= 1);
    assert.strictEqual(targetBook.inquiries[0].buyerName, 'Maya Lin');
    assert.strictEqual(targetBook.inquiries[0].preferredMeetup, 'Downtown Public Library');
  });

  await test('PATCH /api/books/:bookId/inquiries/:inquiryId allows seller to accept inquiry & auto-reserve book', async () => {
    const listingsRes = await request('/api/books/my/listings', {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const targetBook = listingsRes.data.data.find((b) => b._id === bookForInquiryId);
    const inquiryId = targetBook.inquiries[0]._id;

    const res = await request(`/api/books/${bookForInquiryId}/inquiries/${inquiryId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}` },
      body: { status: 'accepted' },
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.data.status, 'accepted');
    assert.strictEqual(res.data.bookStatus, 'reserved');
  });

  // Cleanup test book
  await request(`/api/books/${bookForInquiryId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${authToken}` },
  });

  // --- SUMMARY REPORT ---
  console.log(`\n${colors.bold}${colors.cyan}========================================`);
  console.log(`  TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log(`========================================${colors.reset}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
