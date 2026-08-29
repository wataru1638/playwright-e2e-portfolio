import { test, expect } from '@playwright/test';

// Maps to official API 3: Get All Brands List
// https://automationexercise.com/api_list#api3
test('API3: GET brandsList returns the brand catalog', async ({ request }) => {
  const response = await request.get('/api/brandsList');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.brands)).toBe(true);
  expect(body.brands.length).toBeGreaterThan(0);
});

// Maps to official API 4: PUT To All Brands List
// https://automationexercise.com/api_list#api4
test('API4: PUT brandsList reports an unsupported method in the response body', async ({ request }) => {
  const response = await request.put('/api/brandsList');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.responseCode).toBe(405);
  expect(body.message).toBe('This request method is not supported.');
});
