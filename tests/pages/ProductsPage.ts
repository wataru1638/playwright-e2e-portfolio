import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly pageTitle: Locator;
  readonly productCards: Locator;
  readonly cartModal: Locator;
  readonly cartModalTitle: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');
    this.pageTitle = page.locator('.title.text-center');
    this.productCards = page.locator('.product-image-wrapper');
    this.cartModal = page.locator('.modal-content');
    this.cartModalTitle = page.locator('.modal-title');
    this.viewCartLink = page.locator('.modal-content a[href="/view_cart"]');
    this.continueShoppingButton = page.locator('.close-modal');
  }

  async open() {
    await this.goto('/products');
  }

  async search(keyword: string) {
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }

  productCardByName(name: string): Locator {
    return this.productCards.filter({ hasText: name });
  }

  async addToCartByProductId(productId: number) {
    await this.page.locator(`a.add-to-cart[data-product-id="${productId}"]`).first().click();
  }

  async addToCartByName(name: string) {
    const card = this.productCardByName(name);
    await card.hover();
    await card.locator('a.add-to-cart').first().click();
  }
}
