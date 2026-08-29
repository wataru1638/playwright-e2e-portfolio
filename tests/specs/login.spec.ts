import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { uniqueEmail } from '../utils/testData';

// Maps to official Test Case 3: https://automationexercise.com/test_cases#collapse3
test.describe('Login', () => {
  test('TC03: shows an error for a non-existent email and password combination', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.login(uniqueEmail('no-such-user'), 'WrongPassword!123');

    await expect(loginPage.loginErrorMessage).toBeVisible();
    await expect(loginPage.loginErrorMessage).toHaveText('Your email or password is incorrect!');
    // The failed attempt must not navigate away from the login form.
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC03: rejects a correct-looking email with a wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();

    await loginPage.login('definitely.not.registered@example.com', 'WrongPassword!123');

    await expect(loginPage.loginErrorMessage).toHaveText('Your email or password is incorrect!');
  });
});
