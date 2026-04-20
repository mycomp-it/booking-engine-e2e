import { expect, Locator, Page } from '@playwright/test';

export default class BOPricing {
    readonly page: Page;
    readonly productCards: Locator;

    constructor(page: Page) {
        this.page = page;
        // Le card sono mat-card (Material)
        this.productCards = page.locator('mat-card');
    }

    async open() {
        // Navigazione diretta all'URL del pricing
        await this.page.goto('/.it.b2baziende?menuactive=catalogo&id=3&submenuactive=listiniprodotti&currentview=pricing&action=vieweshopvendor&ng=%2Fpricing');
        await this.page.waitForLoadState('networkidle');
        // Attendiamo che almeno una card sia visibile per essere sicuri che la lista sia carica
        await this.productCards.first().waitFor({ state: 'visible', timeout: 15000 });
    }

    /**
     * Trova la card corrispondente al prodotto cercato scorrendo tutte quelle presenti.
     * Poiché non c'è un filtro di ricerca, Playwright filtrerà la collezione di locator.
     */
    async managePriceForProduct(productName: string) {
        // 1. Attendiamo che la griglia sia visibile e che almeno una card sia presente
        // Spesso in MyGuestCare il caricamento è segnalato da un loader
        await this.page.locator('app-loader').waitFor({ state: 'hidden' }).catch(() => { });

        // Attendiamo che le card siano visibili (almeno la prima)
        await this.productCards.first().waitFor({ state: 'visible', timeout: 20000 });

        // 2. Selezione logica: cerchiamo tra tutte le card quella che contiene il mat-card-title con il nome esatto
        // L'utente ha confermato che il nome è in mat-card-title
        const targetCard = this.productCards.filter({
            has: this.page.locator('mat-card-title', { hasText: productName })
        }).first();

        // 3. Verifica visibilità e scroll (necessario se ci sono molte offerte)
        await targetCard.scrollIntoViewIfNeeded();
        await expect(targetCard).toBeVisible({ timeout: 10000 });

        // 4. Click sul pulsante "Gestisci Prezzi" all'interno della card corretta
        const manageButton = targetCard.locator('button', { hasText: 'Gestisci Prezzi' });
        await manageButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}
