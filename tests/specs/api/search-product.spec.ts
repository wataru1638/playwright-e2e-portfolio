import { test, expect } from '@playwright/test';

// Maps to official API 5: POST To Search Product
// https://automationexercise.com/api_list#api5
test('API5: POST searchProduct returns matching products for a valid keyword', async ({ request }) => {
  const response = await request.post('/api/searchProduct', {
    form: { search_product: 'top' },
  });
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.responseCode).toBe(200);
  expect(Array.isArray(body.products)).toBe(true);
  expect(body.products.length).toBeGreaterThan(0);
});

// Maps to official API 6: POST To Search Product without search_product parameter
// https://automationexercise.com/api_list#api6
test('API6: POST searchProduct without the search_product parameter is a bad request', async ({ request }) => {
  const response = await request.post('/api/searchProduct');
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.responseCode).toBe(400);
  expect(body.message).toBe('Bad request, search_product parameter is missing in POST request.');
});
