import { expect, Locator, Page } from "@playwright/test";
import { FrameLocator } from "@playwright/test";
import BESearchPage from "../BookingEngine/BESearchPage";



export default class BONewTrattativaByPhone {
    trattativaPhoneContainer: Locator;
    accomodationtypeSelectionContainer: Locator;
    submitAccomodationButton: Locator;
    accomodationTypeErrorMessageContainer: Locator;
    container: Locator | FrameLocator;

    constructor(public page: Page, container?: any) {
        this.page = page;
        this.container = container || this.page
        this.trattativaPhoneContainer = this.container.locator('#wrapper')
        this.accomodationtypeSelectionContainer = this.container.locator('select[name="idvendor"]:not([disabled])').first();
        this.submitAccomodationButton = this.trattativaPhoneContainer.locator('input[type="submit"][value="Continua"]');
        this.accomodationTypeErrorMessageContainer = this.trattativaPhoneContainer.locator('#idvendor-error')

    }

    async selectAccomodationType(accomodationName?: string) {
        const target = accomodationName || 'hotel pms';

        // 1. Creiamo la Regex blindata per il match esatto (case-insensitive + escape)
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexRigida = new RegExp(`^${escaped}$`, 'i');

        // 2. Cerchiamo l'opzione all'interno della select specifica
        // NOTA: Poiché è un Select2, la select è nascosta, ma Playwright 
        // riesce spesso a interagire con selectOption anche se è nascosta.
        const option = this.accomodationtypeSelectionContainer.locator('option').filter({ hasText: regexRigida });

        // Prendiamo la label esatta presente nell'HTML (per gestire maiuscole/minuscole)
        const exactLabel = await option.innerText();

        // 3. Selezioniamo l'opzione
        // Usiamo force: true se Playwright si lamenta che la select è nascosta (Select2)
        await this.accomodationtypeSelectionContainer.selectOption({ label: exactLabel.trim() });
    }
    async submitAccomodationRequest() {

        await this.clickSubmitAccomodationButton()
        return new BESearchPage(this.page)
    }
    async clickSubmitAccomodationButton() {
        await this.submitAccomodationButton.click()
    }
    async check() {
        await this.accomodationtypeSelectionContainer.first().waitFor({ state: 'visible' });
        // await expect(this.accomodationtypeSelectionContainer).toBeVisible()
        await expect(this.submitAccomodationButton).toBeVisible()
        await expect(this.submitAccomodationButton).toBeEnabled()
    }
    async checkAccomodationTypeErrorMessage() {
        return await this.accomodationTypeErrorMessageContainer.isVisible()
    }
}