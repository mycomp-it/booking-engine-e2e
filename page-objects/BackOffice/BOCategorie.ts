import { expect, Locator, Page } from '@playwright/test';
import path from 'path';

export interface CategoryTranslation {
    name?: string;
}

export interface CategoryCreateOptions {
    name: string;
    translations: {
        it: { name: string };
        en?: CategoryTranslation;
        de?: CategoryTranslation;
        fr?: CategoryTranslation;
        es?: CategoryTranslation;
    };
}

const CATEGORY_IMAGE_PATH = path.resolve(__dirname, '../../Assets/Categoria_Icona.png');

const LANG_LABELS: Record<string, string> = {
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    es: 'ES',
};

export default class BOCategorie {
    readonly page: Page;
    readonly table: Locator;
    readonly rows: Locator;
    readonly filterInput: Locator;
    readonly categoryColumnCells: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('table.categories-table');
        this.rows = this.table.locator('tbody tr[role="row"]');
        this.filterInput = page.getByPlaceholder('Cerca per nome...');
        this.categoryColumnCells = this.rows.locator('.cdk-column-name');
    }

    private async save() {
        const submitButton = this.page.locator('button[type="submit"][form="categoryForm"]');
        await submitButton.click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' });
        await this.table.waitFor({ state: 'visible' }).catch(() => { });
    }

    async getCategoryCount(): Promise<number> {
        return await this.rows.count();
    }

    async filterByText(text: string) {
        await this.filterInput.clear();
        await this.filterInput.fill(text);
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
    }

    async verifyAllVisibleProductsHaveCategory(expectedCategory: string) {
        const count = await this.rows.count();
        for (let i = 0; i < count; i++) {
            const categoryText = await this.categoryColumnCells.nth(i).innerText();
            expect(categoryText.toLowerCase()).toContain(expectedCategory.toLowerCase());
        }
    }

    async open() {
        await this.page.goto(
            process.env.BASE_URL + '/.it.b2baziende?menuactive=catalogo&id=3&submenuactive=listiniprodotti&currentview=dashboard&action=vieweshopvendor&ng=%2Fcategories',
            { waitUntil: 'networkidle', timeout: 60000 }
        );
        await this.filterInput.waitFor({ state: 'visible', timeout: 30000 });
    }

    async create(options: CategoryCreateOptions) {
        console.log('Creazione categoria:', options.name);
        await this.page.getByRole('button', { name: 'Nuova Categoria' }).click();

        // Internal name
        await this.page.locator('input[formcontrolname="name"]').first().fill(options.name);

        // Italian translation (active tab by default)
        const activeTab = this.page.locator('.mat-mdc-tab-body-active');
        await activeTab.locator('input[formcontrolname="name"]').fill(options.translations.it.name);

        // Other language translations
        for (const [lang, translation] of Object.entries(options.translations)) {
            if (lang === 'it' || !translation?.name) continue;
            const tabLabel = LANG_LABELS[lang];
            if (!tabLabel) continue;
            await this.page.locator('.mat-mdc-tab-label-content, .mdc-tab__text-label', { hasText: tabLabel }).click();
            const langTab = this.page.locator('.mat-mdc-tab-body-active');
            await langTab.locator('input[formcontrolname="name"]').fill(translation.name);
        }

        // Image upload (always uses the default asset)
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.getByRole('button', { name: 'Carica Immagine' }).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(CATEGORY_IMAGE_PATH);

        // Wait for image upload snackbar: the Angular form control is set only after
        // this snackbar fires — waitForLoadState('networkidle') is not sufficient.
        const imageSnackBar = this.page.locator('mat-snack-bar-container', { hasText: 'Immagine caricata con successo' });
        await imageSnackBar.waitFor({ state: 'visible', timeout: 15000 });
        await imageSnackBar.waitFor({ state: 'hidden', timeout: 10000 });

        // Start watching for creation snackbar BEFORE save() to avoid race condition.
        const snackbarPromise = this.page.locator('mat-snack-bar-container')
            .filter({ hasText: 'Categoria creata con successo' })
            .waitFor({ state: 'visible', timeout: 30000 });
        await this.save();
        await snackbarPromise;
        await this.table.waitFor({ state: 'visible', timeout: 15000 });
        await this.filterByText(options.name);
        const count = await this.getCategoryCount();
        expect(count).toBeGreaterThan(0);
        console.log(`✅ Categoria creata: "${options.name}" con ${count} risultato/i dopo il filtro.`);
    }

    async edit(categoryName: string) {
        await this.filterByText(categoryName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: categoryName })
        }).first();
        await targetRow.locator('mat-icon:has-text("edit")').click();
        await this.page.locator('app-category-form').waitFor({ state: 'visible' });
    }

    async changeStatus(categoryName: string, statusName: string) {
        await this.edit(categoryName);

        const statusSelect = this.page.locator('mat-select[formcontrolname="status"]');
        await statusSelect.scrollIntoViewIfNeeded();

        const currentStatus = await statusSelect.innerText();
        if (currentStatus.trim() === statusName) {
            await this.page.locator('button:has-text("Annulla")').click();
        } else {
            const panel = this.page.locator('.mat-mdc-select-panel, .mat-select-panel');
            await expect(async () => {
                await statusSelect.click({ delay: 100 });
                await panel.waitFor({ state: 'visible', timeout: 3000 });
            }).toPass({ intervals: [1000], timeout: 10000 });

            const targetOption = this.page.locator('mat-option').filter({ hasText: new RegExp(`^\\s*${statusName}\\s*$`, 'i') }).first();
            await targetOption.waitFor({ state: 'visible' });
            await targetOption.click();
            await this.save();
        }

        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
    }

    async archive(categoryName: string) {
        await this.filterByText(categoryName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: categoryName })
        }).first();
        await targetRow.locator('button mat-icon:has-text("archive")').click({ force: true });
        // Some BO versions show a confirmation dialog; others archive directly without one
        const confirmButton = this.page.locator('mat-dialog-container button:has-text("Archivia")');
        const dialogAppeared = await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
        if (dialogAppeared) {
            await confirmButton.click();
        }
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        console.log(`✅ Categoria "${categoryName}" archiviata.`);
    }

    async showArchivedCategories() {
        const toggleButton = this.page.locator('button:has-text("Mostra Archiviati")');
        await toggleButton.click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        await expect(this.page.locator('button:has-text("Nascondi Archiviati")')).toBeVisible();
        console.log('📂 Vista archiviati attivata.');
    }

    async delete(categoryName: string) {
        await this.filterByText(categoryName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: categoryName })
        }).first();
        await targetRow.locator('button[color="warn"] mat-icon:has-text("delete")').click();
        await this.page.locator('mat-dialog-container button:has-text("Elimina")').click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' });
        await expect(this.rows.filter({ hasText: categoryName }).first()).toHaveCount(0);
        console.log(`✅ Category deleted: "${categoryName}"`);
    }
}
