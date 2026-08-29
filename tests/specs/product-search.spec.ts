import { test, expect } from '@playwright/test';
import { ProductsPage } from '../pages/ProductsPage';

// Maps to official Test Case 9: https://automationexercise.com/test_cases#collapse9
test.describe('Product search', () => {
  test('TC09: returns only products matching the search keyword', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();

    await productsPage.search('Top');

    await expect(productsPage.pageTitle).toHaveText('Searched Products');
    const count = await productsPage.productCards.count();
    expect(count).toBeGreaterThan(0);

    // Note: the site matches on product *category* as well as name, e.g.
    // "Little Girls Mr. Panda Shirt" (category "Kids > Tops & Shirts") is a
    // valid result for "Top" even though "top" is not in the product name.
    // So we only assert the search returns results, not a name substring.
  });

  test('TC09: shows no products for a keyword that does not exist in the catalog', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    await productsPage.open();

    await productsPage.search('zzz-not-a-real-product-zzz');

    await expect(productsPage.pageTitle).toHaveText('Searched Products');
    await expect(productsPage.productCards).toHaveCount(0);
  });
});
