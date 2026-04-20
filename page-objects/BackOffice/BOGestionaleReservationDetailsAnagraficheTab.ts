import { expect, Locator, Page } from "@playwright/test";
import { formatToIsoDate, waitForLoadState } from "../../Utils/PageMethods";
import { BOAnagrafica, AnagraficaDatiTrattativa } from "./BOAnagrafica"; // Assumi che BOAnagrafica sia importabile

export default class BOGestionaleReservationDetailsAnagraficheTab {

    container: Locator;
    checkinButton: Locator;
    checkoutButton: Locator;
    page: Page;
    header: Locator;
    optionalModal: Locator;
    cancelCheckinButton: Locator;
    optionalModalsubmitButton: Locator;
    checkinDateInput: Locator;
    checkoutDateInput: Locator;
    // Locator generale per tutti i blocchi anagrafica: .tab-pubblica-sicurezza-alloggiato
    anagraficheContainer: Locator;
    private readonly trattativaNameLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = this.page.locator('.modal-content', { has: this.page.locator('.pms-detail-modal-header') });
        this.header = this.container.locator('.pms-detail-modal-header')
        this.checkinButton = this.container.locator('button#checkinBtn');
        this.checkoutButton = this.container.locator('button.checkout-btn');
        this.cancelCheckinButton = this.container.locator('#annullaCheckin');
        this.optionalModal = this.page.locator('.modal-content:not(:has(.pms-detail-modal-header))').first();
        this.optionalModalsubmitButton = this.optionalModal.locator('button.btn-success, button.btn-warning');
        this.checkinDateInput = this.page.locator('input[uib-tooltip="Data checkin"]').first();
        this.checkoutDateInput = this.page.locator('input[uib-tooltip="Data checkout"]').first();
        this.anagraficheContainer = this.container.locator('.tab-pubblica-sicurezza-alloggiato');
        this.trattativaNameLocator = this.container.locator('.nome-cliente-anag').first();
    }

    /**
     * Colleziona tutti i container anagrafica e crea un array di Page Object BOAnagrafica.
     */
    async getAnagrafiche(): Promise<BOAnagrafica[]> {
        const count = await this.anagraficheContainer.count();
        const anagraficheArray: BOAnagrafica[] = [];

        for (let i = 0; i < count; i++) {
            const anagraficaLocator = this.anagraficheContainer.nth(i);
            // Scende al div che contiene i campi di input (usando la classe).
            const formContainerLocator = anagraficaLocator.locator('.anagrafiche-container');
            const anagraficaInstance = new BOAnagrafica(this.page, formContainerLocator);

            anagraficheArray.push(anagraficaInstance);
        }

        return anagraficheArray;
    }

    // I VECCHI METODI DI RIEMPIMENTO (fillNome, fillAnagrafichePrenotante, etc.) SONO STATI RIMOSSI.
    // I VECCHI METODI getClienteContainer E getPrenotanteContainer SONO STATI RIMOSSI.

    async check() {
        await this.container.waitFor({ state: "visible" });
        await expect(this.checkinButton).toBeVisible();
    }

    async selectDates(dateInput: Locator, value?: Date) {
        await dateInput.waitFor({ state: 'visible' });
        const date = value || new Date();
        const isoDate = formatToIsoDate(date);
        await dateInput.fill(isoDate);
    }

    async extractNameSurnameDate(): Promise<AnagraficaDatiTrattativa> {
        // Logica per estrarre i dati della trattativa (mantenuta).
        try {
            await this.trattativaNameLocator.waitFor({ state: 'visible', timeout: 5000 });
            const fullText = await this.trattativaNameLocator.innerText();
            const match = fullText.match(/(.*)\s(20\d{2}-\d{2}-\d{2})/i);

            if (match) {
                const [ /* full match */, nameSurnameRaw, dateString] = match;

                const parts = nameSurnameRaw.trim().split(/\s+/);
                const surname = parts.pop() || 'COGNOME_ERR';
                const name = parts.join(' ') || 'NOME_ERR';

                const creationDate = new Date(dateString);
                return { name, surname, date: creationDate };
            }

            // Uso i tuoi vecchi default se l'estrazione fallisce
            return { name: 'TestE2E', surname: 'Emanuele_DEFAULT', date: new Date('1990-01-01') };

        } catch (error) {
            console.error("Errore nel recupero del nome trattativa, usando default:", error);
            // Uso i tuoi vecchi default in caso di errore
            return { name: 'TestE2E', surname: 'Emanuele_DEFAULT', date: new Date('1990-01-01') };
        }
    }
}