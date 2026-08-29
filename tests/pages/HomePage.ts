import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly subscribeEmail: Locator;
  readonly subscribeButton: Locator;
  readonly subscribeSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.subscribeEmail = page.locator('#susbscribe_email');
    this.subscribeButton = page.locator('#subscribe');
    this.subscribeSuccessMessage = page.locator('#success-subscribe');
  }

  async open() {
    await this.goto('/');
  }

  async subscribe(email: string) {
    await this.subscribeEmail.fill(email);
    await this.subscribeButton.click();
  }
}
