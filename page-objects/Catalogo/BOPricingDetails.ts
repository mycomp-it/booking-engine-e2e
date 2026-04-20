import { expect, Locator, Page } from '@playwright/test';

export default class BOPricingDetails {
    readonly page: Page;
    readonly container: Locator;
    readonly header: Locator;
    readonly productTitle: Locator;
    readonly pricingTabs: Locator;

    // Selettori Griglia
    readonly calendarCells: Locator;

    // Selettori Drawer (Laterale Destra)
    readonly drawer: Locator;
    readonly stockInput: Locator;
    readonly maxQuantityInput: Locator;
    readonly advanceDaysInput: Locator;
    readonly priceInput: Locator;
    readonly discountInput: Locator;

    readonly saveButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = page.locator('app-product-pricing-details, .pricing-detail-container');
        this.header = this.container.locator('.header-title-container, .page-header');
        this.productTitle = this.header.locator('h1, span.title, .product-name');
        this.pricingTabs = this.page.locator('mat-tab-group, .mat-mdc-tab-header');

        // Griglia Calendario
        this.calendarCells = page.locator('.calendar-day');

        // Drawer Selettori
        this.drawer = page.locator('.mat-drawer-inner-container, #price-editor');

        // Selettori Input basati sui mat-label (più stabili con Angular Material)
        this.stockInput = this.drawer.locator('mat-form-field:has(mat-label:has-text("Stock (Override)")) input');
        this.maxQuantityInput = this.drawer.locator('mat-form-field:has(mat-label:has-text("Quantità Max per Acquisto (Override)")) input');
        this.advanceDaysInput = this.drawer.locator('mat-form-field:has(mat-label:has-text("Giorni Anticipo Prenotazione (Override)")) input');
        this.priceInput = this.drawer.locator('mat-form-field:has(mat-label:has-text("Prezzo Fisso (Override)")) input');
        this.discountInput = this.drawer.locator('mat-form-field:has(mat-label:has-text("Sconto % (Override)")) input');

        // Tasto Salva (usando la classe mat-primary per precisione)
        this.saveButton = this.drawer.locator('button.mat-primary:has-text("Salva")');
        this.closeButton = this.drawer.locator('button:has-text("Chiudi")');
    }

    async verifyPageLoaded(productName: string) {
        await this.page.waitForLoadState('networkidle');
        await this.container.first().waitFor({ state: 'visible', timeout: 15000 });
        const titleLocator = this.productTitle.filter({ hasText: productName }).first();
        await expect(titleLocator).toBeVisible({ timeout: 10000 });
    }

    async getActiveCells(): Promise<Locator[]> {
        await this.calendarCells.first().waitFor({ state: 'visible', timeout: 15000 });
        const allCells = await this.calendarCells.all();

        let startIndex = 0;
        for (let i = 0; i < allCells.length; i++) {
            if (await allCells[i].evaluate(el => el.classList.contains('today'))) {
                startIndex = i;
                break;
            }
        }
        return allCells.slice(startIndex);
    }

    async testInversionSelection() {
        const activeCells = await this.getActiveCells();
        if (activeCells.length < 2) return;

        await activeCells[1].click();
        await this.page.waitForTimeout(500);
        await activeCells[0].click();
        await this.page.waitForTimeout(500);

        await expect(activeCells[1]).not.toHaveClass(/selected/);
    }

    async resetSelection() {
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
    }

    async selectRange(startIndex: number, endIndex: number) {
        const activeCells = await this.getActiveCells();

        await activeCells[startIndex].scrollIntoViewIfNeeded();
        await activeCells[startIndex].click();
        await this.page.waitForTimeout(500);

        await activeCells[endIndex].scrollIntoViewIfNeeded();
        await activeCells[endIndex].click();

        await this.drawer.waitFor({ state: 'visible' });
    }

    /**
     * Modifica i parametri nel drawer. 
     * Il tasto Salva si attiva non appena un campo viene sporcato.
     */
    async editAllParams(params: {
        stock?: string,
        maxQuantity?: string,
        advanceDays?: string,
        price?: string,
        discount?: string
    }) {
        await this.drawer.waitFor({ state: 'visible' });

        // Verifica iniziale: il tasto deve essere disabilitato se non ci sono modifiche
        await expect(this.saveButton).toBeDisabled();

        const fillField = async (locator: Locator, value: string) => {
            await locator.scrollIntoViewIfNeeded();

            // 1. Porta il cursore nel campo senza preoccuparti delle label che coprono
            await locator.focus();

            // 2. Inserisce il valore (fill svuota anche il campo automaticamente)
            await locator.fill(value);

            // 3. Simula l'uscita dal campo: questo è il momento esatto 
            // in cui Angular valida il form e abilita il tasto Salva
            await locator.press('Tab');

            // Opzionale: un micro-attesa per lasciare che il thread di Angular elabori
            await this.page.waitForTimeout(50);
        };
        if (params.stock) await fillField(this.stockInput, params.stock);
        if (params.maxQuantity) await fillField(this.maxQuantityInput, params.maxQuantity);
        if (params.advanceDays) await fillField(this.advanceDaysInput, params.advanceDays);
        if (params.price) await fillField(this.priceInput, params.price);
        if (params.discount) await fillField(this.discountInput, params.discount);

        // Verifica che il tasto sia ora attivo
        await expect(this.saveButton).toBeEnabled({ timeout: 5000 });
        await this.saveButton.click();
        await this.loader();
    }

    async verifyFullCellData(index: number, params: {
        price: number,
        discount: number,
        stock: string,
        maxQuantity: string,
        advanceDays: string
    }) {
        const activeCells = await this.getActiveCells();
        const cell = activeCells[index];
        await cell.scrollIntoViewIfNeeded();

        const expectedFinalPrice = params.price - (params.price * params.discount / 100);
        const formattedPrice = expectedFinalPrice.toFixed(2);

        // Verifica Prezzo (Gestione sconto vs prezzo pieno)
        if (params.discount > 0) {
            const discountedLoc = cell.locator('.discounted-price');
            await expect(discountedLoc).toContainText(formattedPrice);
            await expect(discountedLoc).toContainText(`(-${params.discount}%)`);
        } else {
            await expect(cell.locator('.day-price').first()).toContainText(formattedPrice);
        }

        // Verifica Stock
        if (params.stock) {
            await expect(cell.locator('.day-stock')).toContainText(`${params.stock} unità`);
        }

        // Verifica Restrizioni (Badge)
        if (params.maxQuantity) {
            await expect(cell.locator('.r-badge.r-qty')).toContainText(`Max Qtà: ${params.maxQuantity}`);
        }

        if (params.advanceDays) {
            await expect(cell.locator('.r-badge.r-advance')).toContainText(`Anticipo: ${params.advanceDays}`);
        }
    }
    /*
        async loader() {
            // Attende che eventuali spinner o loader spariscano
            await this.page.locator('app-loader, .loading-spinner, .mat-mdc-progress-spinner').waitFor({ state: 'hidden', timeout: 15000 }).catch(() => { });
            await this.page.waitForLoadState('networkidle');
        }
    
    
        */

    async loader() {
        // 1. Definiamo il locator per il testo che hai indicato
        const loaderLocator = this.page.locator('p:has-text("Caricamento disponibilità...")');

        try {
            // 2. Aspettiamo che appaia (con un timeout breve: 2 secondi)
            // Usiamo .waitFor({ state: 'visible' })
            await loaderLocator.waitFor({ state: 'visible', timeout: 2000 });

            // 3. Ora aspettiamo che sparisca
            await loaderLocator.waitFor({ state: 'hidden', timeout: 15000 });
        } catch (e) {
            // Se il loader non appare entro 2 secondi (magari il server è stato istantaneo), 
            // entriamo qui e ignoriamo l'errore per non bloccare il test.
        }

        // 4. Fondamentale: aspettiamo che non ci siano chiamate API in corso
        await this.page.waitForLoadState('networkidle');
    }
}