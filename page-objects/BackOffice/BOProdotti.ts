import { expect, Locator, Page } from '@playwright/test';
import path from 'path';

export type DatesRequirement = 'fixed' | 'date' | 'date_range';

const DATES_REQUIREMENT_LABELS: Record<DatesRequirement, string> = {
    fixed: 'Fisso (senza date)',
    date: 'Data specifica',
    date_range: 'Range di date',
};

export interface ProductTranslation {
    name?: string;
    shortDescription?: string;
    longDescription?: string;
}

export interface ProductCreateOptions {
    productName: string;
    categoryName: string;
    pianoTariffarioName: string;
    datesRequirement: DatesRequirement;
    price: string;
    translations: {
        it: { name: string; shortDescription: string; longDescription?: string };
        en?: ProductTranslation;
        de?: ProductTranslation;
        fr?: ProductTranslation;
        es?: ProductTranslation;
    };
    // Optional with defaults
    stock?: number;
    numberOfPeople?: number;
    availabilityStartDate?: string; // YYYY-MM-DD
    availabilityEndDate?: string;   // YYYY-MM-DD
    // Conditional on datesRequirement
    advanceBookingDays?: number;    // date, date_range only
    maxConsecutiveDays?: number;    // date_range only
    maxQuantityPerPurchase?: number;
}

const PRODUCT_IMAGE_PATH = path.resolve(__dirname, '../../Assets/Prodotto_Icona.png');

const LANG_LABELS: Record<string, string> = {
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    es: 'ES',
};

export default class BOProdotti {
    readonly page: Page;
    readonly table: Locator;
    readonly rows: Locator;
    readonly filterInput: Locator;
    readonly categoryColumnCells: Locator;

    constructor(page: Page) {
        this.page = page;
        this.table = page.locator('app-product-list table');
        this.rows = this.table.locator('tbody tr[role="row"]');
        this.filterInput = page.locator('app-product-list input[placeholder*="Cerca"]');
        this.categoryColumnCells = this.rows.locator('.mat-column-category');
    }

    async getProductCount(): Promise<number> {
        return await this.rows.count();
    }

    async filterByText(text: string) {
        await this.filterInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.filterInput.clear();
        await this.filterInput.fill(text);
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        await this.page.waitForTimeout(1000); // Wait for potential UI updates after filtering
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
            process.env.BASE_URL + '/.it.b2baziende?menuactive=catalogo&id=3&submenuactive=listiniprodotti&currentview=dashboard&action=vieweshopvendor&ng=%2Fproducts',
            { waitUntil: 'networkidle', timeout: 60000 }
        );
        await this.filterInput.waitFor({ state: 'visible', timeout: 30000 });
    }

    async create(options: ProductCreateOptions) {
        console.log('Creazione prodotto:', options.productName);
        await this.page.locator('button:has(mat-icon:has-text("add"))').click();

        // 1. Internal name (first field)
        await this.page.locator('input[formcontrolname="name"]').first().fill(options.productName);

        // 2. datesRequirement — select before filling conditional fields
        const drSelect = this.page.locator('mat-select[formcontrolname="datesRequirement"]');
        await drSelect.scrollIntoViewIfNeeded();
        await drSelect.click();
        const drLabel = DATES_REQUIREMENT_LABELS[options.datesRequirement];
        await this.page.getByRole('option', { name: drLabel }).click();
        await this.page.keyboard.press('Escape');
        await this.page.waitForSelector('.cdk-overlay-pane', { state: 'hidden', timeout: 5000 }).catch(() => { });

        // 3. Price
        const priceField = this.page.locator('input[formcontrolname="price"]');
        await priceField.fill(options.price);

        // 4. Stock (optional, default 1)
        if (options.stock !== undefined) {
            await this.page.locator('input[formcontrolname="stock"]').fill(String(options.stock));
        }

        // 5. Number of people (optional, default 1)
        if (options.numberOfPeople !== undefined) {
            await this.page.locator('input[formcontrolname="numberOfPeople"]').fill(String(options.numberOfPeople));
        }

        // 6. Availability dates (optional — form has defaults)
        if (options.availabilityStartDate) {
            const startField = this.page.locator('input[formcontrolname="availabilityStartDate"]');
            await startField.fill(options.availabilityStartDate);
        }
        if (options.availabilityEndDate) {
            const endField = this.page.locator('input[formcontrolname="availabilityEndDate"]');
            await endField.fill(options.availabilityEndDate);
        }

        // 7. Conditional: maxQuantityPerPurchase
        if (options.maxQuantityPerPurchase !== undefined) {
            await this.page.locator('input[formcontrolname="maxQuantityPerPurchase"]').fill(String(options.maxQuantityPerPurchase));
        }

        // 8. Conditional: advanceBookingDays (date, date_range only)
        if (options.advanceBookingDays !== undefined && options.datesRequirement !== 'fixed') {
            await this.page.locator('input[formcontrolname="advanceBookingDays"]').fill(String(options.advanceBookingDays));
        }

        // 9. Conditional: maxConsecutiveDays (date_range only)
        if (options.maxConsecutiveDays !== undefined && options.datesRequirement === 'date_range') {
            await this.page.locator('input[formcontrolname="maxConsecutiveDays"]').fill(String(options.maxConsecutiveDays));
        }

        // 10. Category (multi-select)
        const categorySelect = this.page.locator('mat-select[formcontrolname="categoryIds"]');
        await categorySelect.scrollIntoViewIfNeeded();
        await categorySelect.click({ force: true });
        await this.page.locator('mat-option').filter({ hasText: options.categoryName }).click();
        await this.page.keyboard.press('Escape');

        // 11. Rate plan (single-select)
        const ratePlanField = this.page.locator('mat-form-field').filter({ hasText: 'Piano Tariffario' });
        await ratePlanField.locator('.mat-mdc-form-field-flex').click();
        const overlay = this.page.locator('.cdk-overlay-pane').last();
        await overlay.waitFor({ state: 'visible', timeout: 10000 });
        const planOption = this.page.locator('mat-option').filter({ hasText: options.pianoTariffarioName });
        await planOption.scrollIntoViewIfNeeded();
        await planOption.waitFor({ state: 'visible' });
        await planOption.click();

        // 12. Translations — Italian (active tab by default)
        const activeTab = this.page.locator('.mat-mdc-tab-body-active');
        await activeTab.locator('input[formcontrolname="name"]').fill(options.translations.it.name);
        const descField = activeTab.locator('textarea[formcontrolname="description"], textarea[formcontrolname="shortDescription"]');
        if (await descField.count() > 0) {
            await descField.first().fill(options.translations.it.shortDescription);
        }
        if (options.translations.it.longDescription) {
            const longDescField = activeTab.locator('textarea[formcontrolname="longDescription"]');
            if (await longDescField.count() > 0) {
                await longDescField.fill(options.translations.it.longDescription);
            }
        }

        // Other language translations
        for (const [lang, translation] of Object.entries(options.translations)) {
            if (lang === 'it' || !translation) continue;
            const tabLabel = LANG_LABELS[lang];
            if (!tabLabel) continue;
            await this.page.locator('.mat-mdc-tab-label-content, .mdc-tab__text-label', { hasText: tabLabel }).click();
            const langTab = this.page.locator('.mat-mdc-tab-body-active');
            if (translation.name) await langTab.locator('input[formcontrolname="name"]').fill(translation.name);
            if (translation.shortDescription) {
                const sdf = langTab.locator('textarea[formcontrolname="description"], textarea[formcontrolname="shortDescription"]');
                if (await sdf.count() > 0) await sdf.first().fill(translation.shortDescription);
            }
            if (translation.longDescription) {
                const ldf = langTab.locator('textarea[formcontrolname="longDescription"]');
                if (await ldf.count() > 0) await ldf.fill(translation.longDescription);
            }
        }

        // 13. Image upload (always uses the default asset)
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator('app-image-uploader[formcontrolname="imageUrl"] button').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(PRODUCT_IMAGE_PATH);

        const snackBar = this.page.locator('mat-snack-bar-container', { hasText: 'Immagine caricata con successo' });
        await snackBar.waitFor({ state: 'visible', timeout: 15000 });
        await snackBar.waitFor({ state: 'hidden', timeout: 10000 });

        // 14. Save
        const saveButton = this.page.locator('button[type="submit"][form="productForm"]');
        await expect(saveButton).toBeEnabled({ timeout: 10000 });
        await saveButton.click();

        await this.page.locator('mat-snack-bar-container', { hasText: 'Prodotto creato con successo' }).waitFor({ state: 'visible', timeout: 15000 });
        await this.table.waitFor({ state: 'visible', timeout: 15000 });
        await this.filterByText(options.productName);
        const count = await this.getProductCount();
        expect(count).toBeGreaterThan(0);
        console.log(`✅ Prodotto creato: "${options.productName}" con ${count} risultato/i dopo il filtro.`);

    }

    private async save() {
        const submitButton = this.page.locator('button[type="submit"][form="productForm"]');
        await submitButton.click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' });
        await this.table.waitFor({ state: 'visible' }).catch(() => { });
    }

    async edit(productName: string) {
        await this.filterByText(productName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td', { hasText: productName })
        }).first();
        await targetRow.locator('button mat-icon:has-text("edit")').click();
        await this.page.locator('app-product-form').waitFor({ state: 'visible' });
    }

    async changeStatus(productName: string, statusName: string) {
        await this.edit(productName);

        const statusSelect = this.page.locator('mat-select[formcontrolname="status"]');
        await statusSelect.scrollIntoViewIfNeeded();

        const currentStatus = await statusSelect.innerText();
        if (currentStatus.trim() === statusName) {
            await this.page.locator('button:has-text("Annulla")').click();
            return;
        }

        await expect(async () => {
            await statusSelect.click();
            const panel = this.page.locator('.mat-mdc-select-panel, .mat-select-panel');
            await panel.waitFor({ state: 'visible', timeout: 3000 });
        }).toPass({ intervals: [1000], timeout: 10000 });

        const targetOption = this.page.locator('mat-mdc-option, mat-option').filter({
            hasText: new RegExp(`^\\s*${statusName}\\s*$`, 'i')
        });
        await targetOption.waitFor({ state: 'visible', timeout: 5000 });
        await targetOption.click();
        await this.save();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
    }

    async archive(productName: string) {
        await this.filterByText(productName);
        const targetRow = this.rows.filter({
            has: this.page.locator('td.cdk-column-name', { hasText: productName })
        }).first();
        await targetRow.locator('button mat-icon:has-text("archive")').click({ force: true });
        // Some BO versions show a confirmation dialog; others archive directly without one
        const confirmButton = this.page.locator('mat-dialog-container button:has-text("Archivia")');
        const dialogAppeared = await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false);
        if (dialogAppeared) {
            await confirmButton.click();
        }
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        console.log(`✅ Prodotto "${productName}" archiviato.`);
    }

    async showArchivedProducts() {
        const toggleButton = this.page.locator('button').filter({ hasText: /Mostra Archiviati|Visualizza Archiviati/ });
        await toggleButton.click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
    }

    async delete(productName: string) {
        await this.filterByText(productName);
        const targetRow = this.rows.first();
        await targetRow.locator('button[color="warn"] mat-icon:has-text("delete")').click();
        await this.page.locator('mat-dialog-container button:has-text("Elimina")').click();
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });
        await expect(this.rows.filter({ hasText: productName }).first()).toHaveCount(0);
        console.log(`✅ Product deleted: "${productName}"`);

    }
}
