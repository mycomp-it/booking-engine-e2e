

import { Page, expect, Locator } from '@playwright/test';

import { formatToIsoDate, waitForLoadState } from '../../../Utils/PageMethods'

import BOModificaBlocco from './BOModificaBlocco';

export default class BODisponibilitàPage {

    page: Page;
    saveButton: Locator;
    modificaBloccoButton: Locator;
    saveModal: Locator;
    saveModalButton: Locator;

    constructor(page: Page) {

        this.page = page;
        this.saveButton = this.page.locator('button.btn-warning:has-text("Salva")').first();
        this.modificaBloccoButton = this.page.getByRole('button', { name: 'Modifica in blocco' });
        this.saveModal = this.page.locator('div.modal-content');
        this.saveModalButton = this.saveModal.locator('button.btn-primary:has-text("OK")');

    }

    async goToModificaBloccoSection() {

        await this.modificaBloccoButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.modificaBloccoButton.click();
        await waitForLoadState(this.page);
        return new BOModificaBlocco(this.page);

    }

    async saveChanges() {

        await waitForLoadState(this.page);
        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveButton.click();
        await waitForLoadState(this.page);
        await this.saveModalButton.waitFor({ state: 'visible', timeout: 10000 });
        await this.saveModalButton.click();

    }

}