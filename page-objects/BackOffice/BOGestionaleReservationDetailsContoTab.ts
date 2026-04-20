import { expect, Locator, Page } from "@playwright/test";
import { formatToIsoDate, waitForLoadState } from "../../Utils/PageMethods";
import { BOAnagrafica, AnagraficaDatiTrattativa } from "./BOAnagrafica"; // Assumi che BOAnagrafica sia importabile

export default class BOGestionaleReservationDetailsContoTab {

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
    deleteAddebitiButton: Locator;
    confirmDeleteAddebitiModal: Locator;
    confirmDeleteAddebitiButton: Locator;


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
        this.deleteAddebitiButton =  this.container.locator('button.pms-delete-voce-addebito-button').first();
        this.confirmDeleteAddebitiModal =  this.page.locator('.modal-content', { hasText: 'Confermi di voler eliminare' });
        this.confirmDeleteAddebitiButton =  this.confirmDeleteAddebitiModal.locator('button#pms-confirm-button');
    }

    async deleteAllAddebiti(){
        if(await this.deleteAddebitiButton.isEnabled()){
        await this.deleteAddebitiButton.click();
        await this.confirmDeleteAddebitiModal.waitFor({ state: 'visible' });
        await this.confirmDeleteAddebitiButton.waitFor({ state: 'visible' });
        await this.confirmDeleteAddebitiButton.click();
        await this.confirmDeleteAddebitiModal.waitFor({ state: 'hidden' });
        await waitForLoadState(this.page);
        }else{
            //console.log("Nessun addebito da eliminare");
        }

    }

}