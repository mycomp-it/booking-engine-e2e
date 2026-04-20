import { expect, Locator, Page } from '@playwright/test';
import BOHomePage from './BOHomePage';
import { waitForLoadState } from '../../Utils/PageMethods';

export default class BOLoginPage {
    loginFormContainer: Locator;
    clientIdContainer: Locator;
    usernameContainer: Locator
    passwordContainer: Locator;
    submitButton: Locator;
    passwordreminderModal: Locator;

    constructor(public page: Page) {
        this.page = page;
        this.loginFormContainer = this.page.locator('#formlogin');
        this.clientIdContainer = this.loginFormContainer.locator('input[name="idcliente"]');
        this.usernameContainer = this.loginFormContainer.locator('input[name="username"]');
        this.passwordContainer = this.loginFormContainer.locator('#pwdlogin');
        this.submitButton = this.loginFormContainer.locator('button[type="submit"]:has-text("Login")');
        this.passwordreminderModal = this.page.locator('.swal2-modal');
    }

    async open(startUrl?: string) {
        await this.page.goto(startUrl || process.env.BASE_URL + '/.b2butenti' || '');
    }

    async login(clientId: string, username: string, password: string) {
        if (!await this.isLoggedIn()) {
            await this.clientIdContainer.fill(clientId);
            await this.usernameContainer.fill(username);
            await this.passwordContainer.fill(password);
            await this.submitButton.click();
        }
        await waitForLoadState(this.page);
        await this.checkOptionalPasswordReminderModal();
        return new BOHomePage(this.page);
    }
    async isLoggedIn() {
        return await this.loginFormContainer.isHidden();
    }

    async checkAfterLogin() {
        await expect(await this.isLoggedIn).toBe(true);
    }

    async getLoginFormContainer() {
        return this.loginFormContainer;
    }
    async checkOptionalPasswordReminderModal() {
        if (await this.passwordreminderModal.isVisible()) {
            console.log('La password sta per scadere, cambiarla al più presto!');
            await this.page.keyboard.press('Escape');

        };
    }

    async getHomePage() {
        if (!await this.isLoggedIn()) {
            throw new Error('User is not logged in. Please call the login() method first.');
        }
        return new BOHomePage(this.page);
    }

}