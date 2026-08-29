import { test, expect, APIRequestContext } from '@playwright/test';
import { buildTestUser, TestUser } from '../../api/testUser';

// Maps to official APIs 7-10 (Verify Login):
// https://automationexercise.com/api_list#api7
test.describe.serial('Verify login', () => {
  let request: APIRequestContext;
  let user: TestUser;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({ baseURL: 'https://automationexercise.com' });
    user = buildTestUser();
    const created = await request.post('/api/createAccount', { form: user });
    expect((await created.json()).responseCode).toBe(201);
  });

  test.afterAll(async () => {
    // Always clean up the throwaway account, even if an assertion above failed.
    await request.delete('/api/deleteAccount', { form: { email: user.email, password: user.password } });
    await request.dispose();
  });

  // API 7: POST To Verify Login with valid details
  test('API7: valid credentials are recognized', async () => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: user.email, password: user.password },
    });
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User exists!');
  });

  // API 8: POST To Verify Login without email parameter
  test('API8: a missing email parameter is a bad request', async () => {
    const response = await request.post('/api/verifyLogin', { form: { password: user.password } });
    const body = await response.json();
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  // API 9: DELETE To Verify Login
  test('API9: DELETE is not a supported method', async () => {
    const response = await request.delete('/api/verifyLogin');
    const body = await response.json();
    expect(body.responseCode).toBe(405);
    expect(body.message).toBe('This request method is not supported.');
  });

  // API 10: POST To Verify Login with invalid details
  test('API10: an unregistered email/password pair is not found', async () => {
    const response = await request.post('/api/verifyLogin', {
      form: { email: buildTestUser().email, password: 'WrongPassword!123' },
    });
    const body = await response.json();
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  });
});
