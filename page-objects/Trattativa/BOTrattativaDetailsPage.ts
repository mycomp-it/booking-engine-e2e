import { Page, FrameLocator, Locator, expect } from '@playwright/test';
import { waitForLoadState } from '../../Utils/PageMethods';
import { TrattativaPreventivoStatus, TrattativaActions } from '../../Utils/TrattativaEnums';
import BOLeftMenu from '../BackOffice/BOLeftMenu';

export default class BOTrattativaDetailsPage {
    container: Locator | FrameLocator;
    trattativaDetailsContainer: Locator;
    trattativaIdTitle: Locator;
    trattativaPreventivoStatusSelector: Locator;
    modifyTrattativaButton: Locator;
    modifyTrattativaModal: Locator;
    modifyTrattativaModalActionSelector: Locator;
    modifyTrattativaModalNotesContainer: Locator;
    modifyTrattativaModalSaveCTA: Locator;
    deleteTrattativaCTA: Locator;
    confirmDeletionCTA: Locator;
    deleteSuccessAlert: Locator;

    leftMenu: BOLeftMenu

    constructor(public page: Page, container?) {
        this.page = page;
        this.container = container || this.page;
        this.trattativaDetailsContainer = this.container.locator('#wrapper')
        this.trattativaIdTitle = this.trattativaDetailsContainer.locator('h1.alert');
        this.trattativaPreventivoStatusSelector = this.trattativaDetailsContainer.locator('select[name="stato"]')
        this.modifyTrattativaButton = this.trattativaDetailsContainer.locator('a.btn-warning[data-target="#ajaxnewstatemodal"]')
        this.modifyTrattativaModal = this.trattativaDetailsContainer.locator('#ajaxnewstatemodal')
        this.modifyTrattativaModalActionSelector = this.modifyTrattativaModal.locator('select#selazione')
        this.modifyTrattativaModalNotesContainer = this.modifyTrattativaModal.locator('textarea[name="note"]');
        this.modifyTrattativaModalSaveCTA = this.modifyTrattativaModal.locator('input[type="submit"][value="Salva"]')
        this.deleteTrattativaCTA = this.trattativaDetailsContainer.locator('a[href*="action=cancella"]');
        this.confirmDeletionCTA = this.page.locator('.swal2-confirm');
        this.deleteSuccessAlert = this.page.locator('p.alert.alert-danger', {
            hasText: 'ATTENZIONE. Trattativa inesistente'
        });
    }
    async check() {
        await expect(this.trattativaDetailsContainer).toBeVisible()
        //await expect(this.trattativaPreventivoStatusSelector).toBeVisible()
        await expect(this.modifyTrattativaButton).toBeVisible()



    }
    async checkModal() {
        await expect(this.modifyTrattativaModal).toBeVisible()
        await expect(this.modifyTrattativaModalActionSelector).toBeVisible()
        await expect(this.modifyTrattativaModalNotesContainer).toBeVisible()
        await expect(this.modifyTrattativaModalSaveCTA).toBeVisible()
        await expect(this.modifyTrattativaModalSaveCTA).toBeEnabled()


    }
    async checkIDs(id: string) {
        await waitForLoadState(this.page);
        await expect(this.trattativaIdTitle).toBeVisible({ timeout: 15000 });
        const pageTitleText = await this.trattativaIdTitle.textContent();
        let titleId: string | null = null;

        if (pageTitleText) {
            // Estrai l'ID usando la regex: cerca "(Id XXXXX)"
            const match = pageTitleText.match(/\(Id (\d+)\)/);
            if (match && match[1]) {
                titleId = match[1];
            }
        }
        expect(titleId).not.toBeNull()
        expect(titleId).toBe(id);
        // console.log(`Controllo ID trattativa completato con successo. ID: ${titleId}`);
    }
    async getTrattativaIdFromTitle(): Promise<string | null> {
        await waitForLoadState(this.page);
        await expect(this.trattativaIdTitle).toBeVisible({ timeout: 15000 });
        const pageTitleText = await this.trattativaIdTitle.textContent();
        let titleId: string | null = null;

        if (pageTitleText) {
            const match = pageTitleText.match(/\(Id (\d+)\)/);
            if (match && match[1]) {
                titleId = match[1];
            }
        }
        return titleId;
    }
    async changePreventivoTrattativaStatus(statusValue?) {
        await this.trattativaPreventivoStatusSelector.selectOption({ value: statusValue || TrattativaPreventivoStatus.ACCETTATO });
        await waitForLoadState(this.page);
        // console.log(`Stato del preventivo modificato con successo in: ${statusValue}`);

    }
    async moveTrattativaTo(action?, message?) {
        await this.clickModifyTrattativaButton()
        await this.ModifyTrattativaSelectAction(action)
        await this.fillModificaTrattativaNotes(message)
        await this.clickModifyTrattativaSaveCTA()
    }
    async deleteTrattativa() {
        await this.deleteTrattativaCTA.waitFor({ state: 'visible' });
        await this.deleteTrattativaCTA.click();
        await this.confirmDeletionCTA.waitFor({ state: 'visible' });
        await this.confirmDeletionCTA.click();
        await waitForLoadState(this.page);
        await expect(this.deleteSuccessAlert).toBeVisible({ timeout: 10000 });

    }
    async clickModifyTrattativaButton() {
        await this.scrollUntilLoaded(await this.modifyTrattativaButton)
        await this.modifyTrattativaButton.click();
        await waitForLoadState(this.page)
        await this.checkModal()
        //   console.log('Modale di modifica trattativa aperto')

    }
    async ModifyTrattativaSelectAction(actionValue?) {
        await this.scrollUntilLoaded(await this.modifyTrattativaModalActionSelector)
        await this.modifyTrattativaModalActionSelector.selectOption({ value: actionValue || TrattativaActions.SPOSTA_IN_CLIENTI });
        //  console.log(`Azione selezionata: ${actionValue}`);
    }
    async fillModificaTrattativaNotes(message?) {
        const messageValue = message || 'clienti';
        await this.scrollUntilLoaded(await this.modifyTrattativaModalNotesContainer)
        await this.modifyTrattativaModalNotesContainer.fill(`messo in ${messageValue} automaticamente da test E2E`);
        //    console.log('Note inserite');


    }
    async clickModifyTrattativaSaveCTA() {
        await this.modifyTrattativaModalSaveCTA.click();
        await expect(this.modifyTrattativaModal).toBeHidden({ timeout: 10000 });
        await waitForLoadState(this.page);
        //     console.log('Modifiche salvate');


    }
    async scrollUntilLoaded(target: Locator) {
        await target.scrollIntoViewIfNeeded({ timeout: 25000 })
    }

}
