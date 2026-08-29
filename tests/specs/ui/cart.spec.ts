import { test, expect } from '@playwright/test';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

const BLUE_TOP = { id: 1, name: 'Blue Top', unitPrice: 500 };
const MEN_TSHIRT = { id: 2, name: 'Men Tshirt', unitPrice: 400 };

// Maps to official Test Case 12: https://automationexercise.com/test_cases#collapse12
test('TC12: adding two products from the listing page shows both in the cart', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.open();

  await productsPage.addToCartByProductId(BLUE_TOP.id);
  await productsPage.continueShoppingButton.click();
  await productsPage.addToCartByProductId(MEN_TSHIRT.id);
  await productsPage.viewCartLink.click();

  const cartPage = new CartPage(page);
  await expect(cartPage.cartRows).toHaveCount(2);
  await expect(cartPage.rowByProductId(BLUE_TOP.id)).toContainText(BLUE_TOP.name);
  await expect(cartPage.rowByProductId(MEN_TSHIRT.id)).toContainText(MEN_TSHIRT.name);
  await expect(cartPage.totalPriceByProductId(BLUE_TOP.id)).resolves.toBe(`Rs. ${BLUE_TOP.unitPrice}`);
});

// Maps to official Test Case 13: https://automationexercise.com/test_cases#collapse13
test('TC13: the quantity chosen on the product page carries over to the cart total', async ({ page }) => {
  const quantity = 4;
  await page.goto(`/product_details/${BLUE_TOP.id}`);
  await page.locator('#quantity').fill(String(quantity));
  await page.locator('button.cart').click();
  await page.locator('.modal-content a[href="/view_cart"]').click();

  const cartPage = new CartPage(page);
  await expect(cartPage.rowByProductId(BLUE_TOP.id)).toBeVisible();
  await expect(cartPage.quantityByProductId(BLUE_TOP.id)).resolves.toBe(String(quantity));
  await expect(cartPage.totalPriceByProductId(BLUE_TOP.id)).resolves.toBe(
    `Rs. ${BLUE_TOP.unitPrice * quantity}`
  );
});

// Maps to official Test Case 17: https://automationexercise.com/test_cases#collapse17
test('TC17: removing a product from the cart leaves it empty', async ({ page }) => {
  const productsPage = new ProductsPage(page);
  await productsPage.open();
  await productsPage.addToCartByProductId(BLUE_TOP.id);
  await productsPage.viewCartLink.click();

  const cartPage = new CartPage(page);
  await expect(cartPage.rowByProductId(BLUE_TOP.id)).toBeVisible();

  await cartPage.removeByProductId(BLUE_TOP.id);

  await expect(cartPage.rowByProductId(BLUE_TOP.id)).toHaveCount(0);
  await expect(cartPage.emptyCartMessage).toBeVisible();
});
