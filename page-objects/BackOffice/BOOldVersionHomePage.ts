import { expect, Page, Locator } from '@playwright/test';
import { waitForLoadState } from '../../Utils/PageMethods';

export default class BOOldVersionHomePage {
    page: Page
    leftMenu: Locator
    logo: Locator

    constructor(page: Page) {
        this.page = page;
        this.leftMenu = this.page.locator('#side-menu');
        this.logo = this.leftMenu.locator('#logo');
    }

    async check() {
        await waitForLoadState(this.page);
        await expect(this.leftMenu).toBeVisible();
        await expect(this.logo).toBeVisible();
    }
}