import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartRows: Locator;
  readonly emptyCartMessage: Locator;
  readonly subscribeEmail: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartRows = page.locator('#cart_info tbody tr');
    this.emptyCartMessage = page.getByText('Cart is empty!');
    this.subscribeEmail = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscribeSuccessMessage = page.locator('#success-subscribe');
  }

  async open() {
    await this.goto('/view_cart');
  }

  rowByProductId(productId: number): Locator {
    return this.page.locator(`#product-${productId}`);
  }

  async removeByProductId(productId: number) {
    await this.page.locator(`.cart_quantity_delete[data-product-id="${productId}"]`).click();
  }

  async quantityByProductId(productId: number): Promise<string> {
    return (await this.rowByProductId(productId).locator('.cart_quantity button').innerText()).trim();
  }

  async totalPriceByProductId(productId: number): Promise<string> {
    return (await this.rowByProductId(productId).locator('.cart_total_price').innerText()).trim();
  }

  async subscribe(email: string) {
    await this.subscribeEmail.fill(email);
    await this.subscribeButton.click();
  }
}
