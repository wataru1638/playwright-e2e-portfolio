import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { uniqueEmail } from '../utils/testData';

// Maps to official Test Case 10: https://automationexercise.com/test_cases#collapse10
test('TC10: subscribing from the home page shows a success message', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.open();
  await homePage.subscribeEmail.scrollIntoViewIfNeeded();

  await homePage.subscribe(uniqueEmail());

  await expect(homePage.subscribeSuccessMessage).toBeVisible();
  await expect(homePage.subscribeSuccessMessage).toHaveText('You have been successfully subscribed!');
});

// Maps to official Test Case 11: https://automationexercise.com/test_cases#collapse11
test('TC11: subscribing from the cart page shows a success message', async ({ page }) => {
  const cartPage = new CartPage(page);
  await cartPage.open();
  await cartPage.subscribeEmail.scrollIntoViewIfNeeded();

  await cartPage.subscribe(uniqueEmail());

  await expect(cartPage.subscribeSuccessMessage).toBeVisible();
  await expect(cartPage.subscribeSuccessMessage).toHaveText('You have been successfully subscribed!');
});
