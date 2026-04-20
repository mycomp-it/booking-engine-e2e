import { Page, expect, Locator } from '@playwright/test';

export default class BOListiniPage {

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

}