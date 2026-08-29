import { test, expect } from '@playwright/test';

// Maps to official API 1: Get All Products List
// https://automationexercise.com/api_list#api1
test('API1: GET productsList returns the product catalog', async ({ request }) => {
  const response = await request.get('/api/productsList');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
  expect(body.products[0]).toEqual(
    expect.objectContaining({ id: expect.any(Number), name: expect.any(String), price: expect.any(String) })
  );
});

// Maps to official API 2: POST To All Products List
// https://automationexercise.com/api_list#api2
test('API2: POST productsList is rejected even though the transport status is 200', async ({ request }) => {
  const response = await request.post('/api/productsList');

  // NOTE: this API always answers with HTTP 200 and encodes the real
  // result in the JSON body's `responseCode` field — the documented
  // "Response Code: 405" is NOT the transport status code. A test that
  // asserts `response.status() === 405` here would fail even though the
  // API is behaving exactly as documented.
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.responseCode).toBe(405);
  expect(body.message).toBe('This request method is not supported.');
});
