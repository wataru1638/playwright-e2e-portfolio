import { test, expect, APIRequestContext } from '@playwright/test';
import { buildTestUser, TestUser } from '../../api/testUser';

// Maps to official APIs 11-14 (account CRUD), run as one serial lifecycle so
// each step operates on the same throwaway account created in the first test.
// https://automationexercise.com/api_list#api11
test.describe.serial('Account lifecycle', () => {
  let request: APIRequestContext;
  let user: TestUser;
  let accountCreated = false;

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({ baseURL: 'https://automationexercise.com' });
    user = buildTestUser();
  });

  test.afterAll(async () => {
    // Defensive cleanup: if the delete step (API12) didn't run because an
    // earlier step failed, make sure we don't leave a test account behind.
    if (accountCreated) {
      await request.delete('/api/deleteAccount', { form: { email: user.email, password: user.password } });
    }
    await request.dispose();
  });

  // API 11: POST To Create/Register User Account
  test('API11: creating an account with all required fields succeeds', async () => {
    const response = await request.post('/api/createAccount', { form: user });
    const body = await response.json();
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');
    accountCreated = true;
  });

  // API 14: GET user account detail by email
  test('API14: the created account can be looked up by email', async () => {
    const response = await request.get('/api/getUserDetailByEmail', { params: { email: user.email } });
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.user).toEqual(
      expect.objectContaining({ email: user.email, name: user.name, company: user.company })
    );
  });

  // API 13: PUT METHOD To Update User Account
  test('API13: updating the account persists the new company name', async () => {
    const updated = { ...user, company: 'Updated Portfolio Co.' };
    const putResponse = await request.put('/api/updateAccount', { form: updated });
    const putBody = await putResponse.json();
    expect(putBody.responseCode).toBe(200);
    expect(putBody.message).toBe('User updated!');

    const getResponse = await request.get('/api/getUserDetailByEmail', { params: { email: user.email } });
    const getBody = await getResponse.json();
    expect(getBody.user.company).toBe('Updated Portfolio Co.');
  });

  // API 12: DELETE METHOD To Delete User Account
  test('API12: deleting the account removes it', async () => {
    const response = await request.delete('/api/deleteAccount', { form: { email: user.email, password: user.password } });
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('Account deleted!');
    accountCreated = false;
  });
});
