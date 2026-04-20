import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import { waitForLoadState } from '../../Utils/PageMethods';
import BOTrattativaDetailsPage from './BOTrattativaDetailsPage';

export default class BOTutteTrattativePage {
    page: Page;
    container: Locator | FrameLocator;
    tutteTrattativeContainer: Locator;
    tutteTrattativePagination: Locator;
    tutteTrattativeTable: Locator;
    tutteTrattativeFilter: Locator;
    tutteTrattativeRows: Locator;
    tutteTrattativeRowIdContainer: Locator
    tutteTrattativeUserFilter: Locator;
    tutteTrattativeFilterSubmit: Locator;

    constructor(page: Page, container?: any) {
        this.page = page;
        this.container = container || this.page
        this.tutteTrattativeContainer = this.container.locator('#wrapper');
        this.tutteTrattativeFilter = this.tutteTrattativeContainer.locator('#topinfo-right');
        this.tutteTrattativeUserFilter = this.tutteTrattativeFilter.locator('select#incaricato');
        this.tutteTrattativeFilterSubmit = this.tutteTrattativeFilter.locator('input[type="submit"][value="Filtra"]');
        this.tutteTrattativePagination = this.tutteTrattativeContainer.locator('#pagination');
        this.tutteTrattativeTable = this.tutteTrattativeContainer.locator('#listtratt');
        this.tutteTrattativeRows = this.tutteTrattativeTable.locator('tbody tr');
        this.tutteTrattativeRowIdContainer = this.tutteTrattativeRows.locator('.priority');
    }

    async check() {
        await waitForLoadState(this.page);
        await expect(this.tutteTrattativeContainer).toBeVisible();
        await this.checkFilter();
        await this.checkPagination();
        await this.checkTable();

    }
    async checkFilter() {
        await expect(this.tutteTrattativeFilter).toBeVisible();
    }
    async checkPagination() {
        for (let i = 0; i < await this.tutteTrattativePagination.count(); i++) {
            await expect(await this.tutteTrattativePagination.nth(i)).toBeVisible();
        }

    }/*
    async getFirstTrattativaId() {
        const firstRowId = await this.tutteTrattativeRowIdContainer.first().textContent();
        return firstRowId ? firstRowId.trim() : 'errore id non trovato';
    }
    async getLastTrattativaId(trattativaLocator?: Locator) {

        const firstRowId = await trattativaLocator || await this.tutteTrattativeRows.last().textContent();
        return firstRowId ? firstRowId.trim() : 'errore id non trovato';



    }
    async openFirstTrattativa() {

        await this.tutteTrattativeRows.first().locator('.vedi-tratt').click();
        return new BOTrattativaDetailsPage(this.page);

    }
    async openTrattativaById(trattativaId?: string) {

        const trattativa = this.tutteTrattativeTable.locator(`tr:has(td.priority:has-text("${trattativaId || await this.getFirstTrattativaId()}"))`);

        // Attendi che la riga sia visibile. Se non lo è, il test fallirà.
        await expect(trattativa).toBeVisible();
        await expect(trattativa.locator('a.vedi-tratt')).toBeVisible();
        await trattativa.locator('a.vedi-tratt').click();
        console.log(`Aperta la trattativa con ID: ${trattativaId}`);
        return new BOTrattativaDetailsPage(this.page);
    }
        */

    async getFirstTrattativaId(trattativaLocator?: Locator) {
        const locator = trattativaLocator || this.tutteTrattativeRows;
        const firstRowId = await locator.first().locator('.priority').textContent();
        return firstRowId ? firstRowId.trim() : 'errore id non trovato';
    }
    async getLastTrattativaId(trattativaLocator?: Locator) {
        const locator = trattativaLocator || this.tutteTrattativeRows;
        const lastRowId = await locator.last().locator('.priority').textContent();
        return lastRowId ? lastRowId.trim() : 'errore id non trovato';
    }

  
    async openTrattativaById(trattativaId?: string) {
        const rowLocator = this.tutteTrattativeTable.locator(`tr:has(td.priority:has-text("${trattativaId|| await this.getFirstTrattativaId()}"))`);
        await expect(rowLocator).toBeVisible();
        const vediTrattLink = rowLocator.locator('a.vedi-tratt');
        await expect(vediTrattLink).toBeVisible();
        await vediTrattLink.click();
        //console.log(`Aperta la trattativa con ID: ${trattativaId|| await this.getFirstTrattativaId()}`);
        return new BOTrattativaDetailsPage(this.page);
    }









    async checkTestedTrattative() {
        await this.filterTrattativeByUser('Test E2E');
        await waitForLoadState(this.page);
        await this.page.waitForTimeout(1500);
        await this.checkTable();
        await waitForLoadState(this.page);
        await waitForLoadState(this.page);
        await this.page.waitForTimeout(1500);
        const rowCount = await this.tutteTrattativeRows.count();

        expect(rowCount).toBeGreaterThan(0);

    }
    async filterTrattative(filter?: any) {
        const filterValue = filter|| /Nuov/i ;
        const newTrattativeRows = this.tutteTrattativeRows.filter({ hasText: filterValue });
        //console.log(`Trovate ${await newTrattativeRows.count()} trattative 'Nuove' per 'Test E2E'.`);
        if (await newTrattativeRows.count() === 0) {
            throw new Error(`Nessuna trattativa ${filterValue} trovata per l'utente 'Test E2E'.`);
        } else {
            return newTrattativeRows
        }
    }
    

    async submitFilter() {
        await this.tutteTrattativeFilterSubmit.click();
    }
    async filterTrattativeByUser(user: string) {
        await waitForLoadState(this.page);
        await this.tutteTrattativeUserFilter.selectOption({ label: user });
        await waitForLoadState(this.page);
        await this.submitFilter()
    }

    async checkTable() {
        await expect(this.tutteTrattativeTable).toBeVisible();

        //console.log(`Number of rows in the table: ${await this.tutteTrattativeRows.count()}`);
        expect(await this.tutteTrattativeRows.count()).toBeGreaterThan(0);


        for (let i = 0; i < await this.tutteTrattativeRows.count(); i++) {
            const row = this.tutteTrattativeTable.locator(`tbody tr:nth-child(${i + 1})`);
            await expect(row).toBeVisible();
            await waitForLoadState(this.page);
            const cells = await row.locator('td').count();
            expect(cells).toBeGreaterThan(0);
            for (let j = 0; j < cells; j++) {
                const cell = row.locator(`td:nth-child(${j + 1})`);
                // await expect(cell).toBeVisible();
            }
        }

    }
}
