import { expect, Locator, Page } from "@playwright/test";
import { formatToIsoDate, waitForLoadState } from "../../Utils/PageMethods";
import BOGestionaleReservationDetailsAnagraficheTab from "./BOGestionaleReservationDetailsAnagraficheTab";
import BOGestionaleReservationDetailsContoTab from "./BOGestionaleReservationDetailsContoTab";
import BOGestionalePage from "./BOGestionalePage";

export default class BOGestionaleReservationDetailsPage {


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
    anagraficheLink: Locator;
    contoLink: Locator;
    cancelCheckoutButton: Locator;
    cancelCheckoutModal: Locator;
    cancelCheckoutConfirmButton: Locator;
    noShowButton: Locator;
    confirmNoShowModal: Locator;
    confirmNoShowButton: Locator;






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
        this.anagraficheLink = this.container.locator('li.lnktabanagrafica > a');
        this.contoLink = this.container.locator('li.lnktabaddebiti> a');
        this.cancelCheckoutButton = this.container.locator('#annullaCheckOut');
        this.cancelCheckoutModal = this.page.locator('.modal-content', { hasText: 'Confermi di voler annullare il checkout?' });
        this.cancelCheckoutConfirmButton = this.cancelCheckoutModal.locator('button#pms-confirm-button');
        this.noShowButton = this.container.locator('button#noShowBtn');
        this.confirmNoShowModal = this.page.locator('.modal-content', { hasText: 'Conferma no show' });
        this.confirmNoShowButton = this.confirmNoShowModal.locator('button#pms-confirm-button');


    }

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

    async getReservationName(): Promise<string> {
     
        await this.container.waitFor({ state: 'visible', timeout: 15000 });

        const generalInfoPanel = this.container.locator('.pms-generale');
        const nameLocator = generalInfoPanel
            .locator('.pms-detail-modal-pr-info', { has: this.page.locator('.profile-client') })
            .locator('shortener span')
            .first();

        const rawText = await nameLocator.innerText({ timeout: 15000 });
        const idRegex = /(E2E-\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})/;
        const match = rawText.match(idRegex);

        if (match && match[1]) {
          
            const cleanId = match[1].trim();
            //console.log(`[getReservationName] ID estratto per filtro: ${cleanId}`);
            return cleanId;
        }
        return rawText.trim();
    }

    async closeReservationDetails() {
        const closeButton = this.container.locator('i#closeReservation');
        await closeButton.click();
        await waitForLoadState(this.page);
        await this.container.waitFor({ state: 'hidden' });
        return new BOGestionalePage(this.page);
    }

    async executeCheckin(value?: Date) {
        await this.selectDates(this.checkinDateInput, value);
        await this.sendCheckin();
    }

    async sendCheckin() {
        await this.container.waitFor({ state: 'visible' })
        await this.clickCheckinCTA();
        await this.page.waitForTimeout(2000)
        await this.handleOptionalModal();
        await waitForLoadState(this.page);

    }

    async executeCheckout(value?: Date) {
        await this.selectDates(this.checkoutDateInput, value);
        await this.sendCheckout();
    }

    async sendCheckout() {
        await this.container.waitFor({ state: 'visible' })
        await this.clickCheckoutCTA();
        await this.page.waitForTimeout(2000)
        await this.handleOptionalModal();

    }

    async executeNoShow(): Promise<void> {

        await this.noShowButton.waitFor({ state: 'visible' });
        await this.noShowButton.click();

        await this.confirmNoShowModal.waitFor({ state: 'visible', timeout: 5000 });
        await this.confirmNoShowButton.click();
        await this.confirmNoShowModal.waitFor({ state: 'hidden', timeout: 10000 });
        await waitForLoadState(this.page);
    }

    async clickCheckinCTA() {
        await this.container.waitFor({ state: 'visible' });
        await this.checkinButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);
        await this.checkinButton.click();
    }
    async cancelCheckin() {
        await this.cancelCheckinButton.waitFor({ state: 'visible' });
        await expect(this.cancelCheckinButton).toBeVisible();
        await this.cancelCheckinButton.click();
    }
    async cancelCheckout() {
        await this.cancelCheckinButton.waitFor({ state: 'visible' });
        await expect(this.cancelCheckinButton).toBeVisible();
        await this.cancelCheckoutButton.click();
        await this.cancelCheckoutModal.waitFor({ state: 'visible' });
        await this.cancelCheckoutConfirmButton.waitFor({ state: 'visible' });
        await this.cancelCheckoutConfirmButton.click();
        await this.cancelCheckoutModal.waitFor({ state: 'hidden' });
        await waitForLoadState(this.page);
    }

    async clickCheckoutCTA() {
        await this.container.waitFor({ state: 'visible' });
        await this.checkoutButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);
        await this.checkoutButton.click();
    }

    async isOptionalModal() {

        const optionalModals = this.page.locator('.modal-content:visible').filter({ hasNotText: /Prenotazione/i });
        // const optionalModals= this.page.locator('.modal-content:visible').filter({ hasNot: this.page.locator('button#checkinBtn') });
        // const optionalModals = this.page.locator('.modal-content:visible').filter({ hasNot: this.page.locator('.pms-detail-modal-header') });
        //    return (await this.page.locator('.modal-content:not(:has(.pms-detail-modal-header))').count()) > 0;
        return (await optionalModals.count()) > 0;
        // return this.page.locator('.modal-content:not(:has(.pms-detail-modal-header))').isVisible();
    }
    async goToAnagrafiche() {
        return await this.clickAnagraficheLink();

    }

    async clickAnagraficheLink() {
        await this.anagraficheLink.waitFor({ state: 'visible' })
        await this.anagraficheLink.click();
        return new BOGestionaleReservationDetailsAnagraficheTab(this.page);
    }
    async goToConto() {
        return await this.clickContoLink();

    }

    async clickContoLink() {
        await this.contoLink.waitFor({ state: 'visible' })
        await this.contoLink.click();
        return new BOGestionaleReservationDetailsContoTab(this.page);
    }









    async handleOptionalModal() {
        while (await this.isOptionalModal()) {
            //console.log('Trovato un modale opzionale. Clicco per andare avanti.');
            //  const currentOptionalModal = this.page.locator('.modal-content:not(:has(.pms-detail-modal-header))').last();
            const currentOptionalModal = this.page.locator('.modal-content:visible').filter({ hasNotText: /Prenotazione/i }).last();
            //  const currentOptionalModal = this.page.locator('.modal-content:visible').filter({ hasNot: this.page.locator('.pms-detail-modal-header') })
            /*   const currentOptionalModal = this.page.locator('.modal-content', {
                   has: this.page.locator('h3#modal-title', {
                       hasText: /Gestisci anagrafiche e Checkin|Conferma età alloggiati|Conferma checkin/
                   })
               })
   */




            // Ho aggiunto il locator del modal-footer per restringere la ricerca del bottone.
            //const submitButton = currentOptionalModal.locator('.modal-footer button.btn-success, .modal-footer button.btn-warning');

            const submitButton = currentOptionalModal.locator('button', {
                hasText: /Checkin|conferma/i
            })




            await submitButton.waitFor({ state: 'visible' });

            await submitButton.click();
            await this.page.waitForTimeout(500);
        }
        //console.log('Nessun altro modale opzionale trovato. Procedura completata.');
    }


    //da vedere, non funziona il controllo sui modali perchè i bottoni sono diversi per ciascun modale, da trovare una logica da impostare per risolvere
    //idea first ma usando first potrebbe prendere il bottone di annulla invece che submit
    // aggiungere descrizioni attività su clockify oltre al tag





    /*    async handleOptionalModal() {
            while (await this.isOptionalModal()) {
                //console.log('Trovato un modale opzionale. Clicco per andare avanti.');
                await expect(this.optionalModalsubmitButton).toBeVisible();
                await this.optionalModalsubmitButton.click();
            }
            //console.log('Nessun altro modale opzionale trovato. Procedura completata.');
        }
            */
}

