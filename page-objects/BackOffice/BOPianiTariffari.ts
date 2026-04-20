import { expect, Locator, Page } from '@playwright/test';

export interface RatePlanTranslation {
    name?: string;
    shortDescription?: string;
    longDescription?: string;
}

export interface RatePlanCreateOptions {
    name: string;
    description?: string;
    translations: {
        it: { name: string; shortDescription: string; longDescription?: string };
        en?: RatePlanTranslation;
        de?: RatePlanTranslation;
        fr?: RatePlanTranslation;
        es?: RatePlanTranslation;
    };
}

const LANG_LABELS: Record<string, string> = {
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    es: 'ES',
};

export default class BOPianiTariffari {
    readonly page: Page;
    readonly table: Locator;
    readonly rows: Locator;
    readonly filterInput: Locator;
    readonly categoryColumnCells: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table.rate-plans-table');
        this.rows = this.table.locator('tbody tr[role="row"]');
        this.filterInput = page.getByRole('textbox', { name: 'Cerca per nome' });
        this.categoryColumnCells = this.rows.locator('td.cdk-column-name');
    }

    async getPianiTariffariCount(): Promise<number> {
        return await this.rows.count();
    }

    private async save() {
        const submitButton = this.page.locator('button[type="submit"][form="ratePlanForm"]');
        await submitButton.click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' });
        await this.table.waitFor({ state: 'visible' }).catch(() => { });
    }

    async filterByText(text: string) {
        await this.filterInput.waitFor({ state: 'visible' });
        await this.filterInput.clear();
        await this.filterInput.fill(text);
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
    }

    async verifyAllVisiblePlansHaveName(expectedName: string) {
        await this.categoryColumnCells.first().waitFor({ state: 'visible' });
        const count = await this.rows.count();
        for (let i = 0; i < count; i++) {
            const text = await this.categoryColumnCells.nth(i).innerText();
            expect(text.toLowerCase()).toContain(expectedName.toLowerCase());
        }
    }

    async open() {
        await this.page.goto(
            '/.it.b2baziende?menuactive=catalogo&id=3&submenuactive=listiniprodotti&currentview=rate-plans&action=vieweshopvendor&ng=%2Frate-plans',
            { waitUntil: 'networkidle', timeout: 60000 }
        );
        await this.filterInput.waitFor({ state: 'visible', timeout: 30000 });
    }

    async create(options: RatePlanCreateOptions) {
        console.log('Creazione piano tariffario:', options.name);
        await this.page.getByRole('button', { name: 'Nuovo Piano Tariffario' }).click();

        // Internal name and optional description
        await this.page.locator('input[formcontrolname="name"]').first().fill(options.name);
        if (options.description) {
            await this.page.locator('textarea[formcontrolname="description"]').fill(options.description);
        }

        // Italian translation (active tab by default)
        const activeTab = this.page.locator('.mat-mdc-tab-body-active');
        await activeTab.locator('input[formcontrolname="name"]').fill(options.translations.it.name);
        await activeTab.locator('textarea[formcontrolname="shortDescription"]').fill(options.translations.it.shortDescription);
        if (options.translations.it.longDescription) {
            await activeTab.locator('textarea[formcontrolname="longDescription"]').fill(options.translations.it.longDescription);
        }

        // Other language translations
        for (const [lang, translation] of Object.entries(options.translations)) {
            if (lang === 'it' || !translation) continue;
            const tabLabel = LANG_LABELS[lang];
            if (!tabLabel) continue;
            await this.page.locator('.mat-mdc-tab-label-content, .mdc-tab__text-label', { hasText: tabLabel }).click();
            const langTab = this.page.locator('.mat-mdc-tab-body-active');
            if (translation.name) await langTab.locator('input[formcontrolname="name"]').fill(translation.name);
            if (translation.shortDescription) await langTab.locator('textarea[formcontrolname="shortDescription"]').fill(translation.shortDescription);
            if (translation.longDescription) await langTab.locator('textarea[formcontrolname="longDescription"]').fill(translation.longDescription);
        }

        // Start watching for snackbar BEFORE save() to avoid race condition:
        // snackbar may appear and auto-dismiss during save()'s loader/table waits.
        const snackbarPromise = this.page.locator('mat-snack-bar-container')
            .filter({ hasText: 'Piano Tariffario creato con successo' })
            .waitFor({ state: 'visible', timeout: 30000 });
        await this.save();
        await snackbarPromise;
        await this.table.waitFor({ state: 'visible', timeout: 15000 });
        await this.filterByText(options.name);
        const count = await this.getPianiTariffariCount();
        expect(count).toBeGreaterThan(0);
        console.log(`✅ Piano Tariffario creato: "${options.name}" con ${count} risultato/i dopo il filtro.`);
    }

    async edit(pianoName: string) {
        await this.filterByText(pianoName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: pianoName })
        }).first();
        await targetRow.locator('button mat-icon:has-text("edit")').click();
        await this.page.locator('app-rate-plan-form').waitFor({ state: 'visible' });
    }

    async changeStatus(pianoName: string, statusName: string) {
        await this.edit(pianoName);

        const statusSelect = this.page.locator('mat-select[formcontrolname="status"]');
        await statusSelect.scrollIntoViewIfNeeded();

        const currentStatus = await statusSelect.innerText();
        if (currentStatus.trim() === statusName) {
            await this.page.locator('button:has-text("Annulla")').click();
            return;
        }

        const panel = this.page.locator('.mat-mdc-select-panel, .mat-select-panel');
        await expect(async () => {
            await statusSelect.click({ delay: 100 });
            await panel.waitFor({ state: 'visible', timeout: 3000 });
        }).toPass({ intervals: [1000], timeout: 10000 });

        const targetOption = this.page.locator('mat-option').filter({
            hasText: new RegExp(`^\\s*${statusName}\\s*$`, 'i')
        }).first();
        await targetOption.waitFor({ state: 'visible' });
        await targetOption.click();

        await this.save();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
    }

    async archive(pianoName: string) {
        await this.filterByText(pianoName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: pianoName })
        }).first();
        await targetRow.locator('button mat-icon:has-text("archive")').click({ force: true });
        // Some BO versions show a confirmation dialog; others archive directly without one
        const confirmButton = this.page.locator('mat-dialog-container button:has-text("Archivia")');
        const dialogAppeared = await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
        if (dialogAppeared) {
            await confirmButton.click();
        }
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        console.log(`✅ Piano Tariffario "${pianoName}" archiviato.`);
    }

    async showArchived() {
        const toggleButton = this.page.locator('button').filter({ hasText: /Mostra Archiviate|Mostra Archiviati/ });
        await toggleButton.click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        await expect(this.page.locator('button').filter({ hasText: /Nascondi Archiviate|Nascondi Archiviati/ })).toBeVisible();
        console.log('📂 Vista piani archiviati attivata.');
    }

    async delete(pianoName: string) {
        await this.filterByText(pianoName);
        await this.page.waitForTimeout(1000);

        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: pianoName })
        }).first();

        if (await targetRow.count() === 0) {
            throw new Error(`Impossibile trovare il piano "${pianoName}" da eliminare negli archivi.`);
        }

        const deleteButton = targetRow.locator('button mat-icon:has-text("delete")');
        await deleteButton.scrollIntoViewIfNeeded();
        await deleteButton.click();

        const confirmButton = this.page.locator('mat-dialog-container button').filter({ hasText: /Elimina|Conferma/ });
        await confirmButton.waitFor({ state: 'visible', timeout: 5000 });
        await confirmButton.click();

        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        await this.page.waitForSelector('mat-dialog-container', { state: 'detached', timeout: 5000 });
        await expect(this.rows.filter({ hasText: pianoName }).first()).toHaveCount(0);
        console.log(`✅ Rate plan deleted: "${pianoName}"`);
       // console.log(`🗑️ Piano Tariffario "${pianoName}" rimosso definitivamente.`);
    }
}
