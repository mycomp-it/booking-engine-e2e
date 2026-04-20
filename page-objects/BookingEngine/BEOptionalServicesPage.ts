import { Page, Locator, expect } from '@playwright/test';

export default class BEOptionalServicesPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isOptionalServices() {
        try {
            await expect(this.page.locator('#bookaccleft')).toBeVisible();
        } catch (error) {
            await this.goToForm()
        }
    }

    async goToForm() {
        await this.page.click('button[type="submit"]');
    }
}