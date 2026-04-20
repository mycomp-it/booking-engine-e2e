import { Page, expect, Locator } from "@playwright/test";
import { waitForLoadState } from "../../../Utils/PageMethods";



export default class BOAuditReportModal {
    auditReportModal: Locator;
    roomSelector: Locator;
    updateButton: Locator;
    modalBody: Locator;
    openModalButton: Locator;
    modalAlert: Locator;
    selectionsList: Locator;
    activeContent: Locator;
    tableRows: Locator;




    closeModalButton: Locator;
    constructor(public page: Page) {
        this.page = page;
        this.auditReportModal = this.page.locator('.modal-content:has-text("Audit Report")'); // this.page.locator('.modal-content:has-text("Test E2E Riepilogo")');
        this.roomSelector = this.auditReportModal.locator('.pms-reserv-tools-select');
        this.updateButton = this.auditReportModal.getByRole('button', { name: 'Aggiorna' });
        this.modalBody = this.auditReportModal.locator('#modal-body');
        this.closeModalButton = this.page.getByRole('button', { name: 'Chiudi' });
        this.openModalButton = this.page.locator('.btn.btn-default.audit-report');
        this.modalAlert = this.auditReportModal.locator('.alert.alert-info');
        this.selectionsList = this.page.locator('ul.nav.nav-tabs li.uib-tab');
        this.activeContent = this.page.locator('.tab-pane.active');
        //   this.tableRows = this.modalBody.locator('table.printing-area tbody tr');
        this.tableRows = this.modalBody.locator('table.printing-area tbody tr:has(td)');



    }

    async isModalOpen() {

        return this.auditReportModal.isVisible({ timeout: 10000 });

    }
    async checkAllSelections() {

        /*   for () {
   
               await selection.openSelection();
               await selection.check();
   
           }
               */
    }
    private async waitForSelectionList() {
        await this.selectionsList.first().waitFor({ state: 'visible' });

        // Attendi che il conteggio delle tab si stabilizzi (cioè non cambi più) per 500ms
        let initialCount = await this.selectionsList.count();
        let currentCount = 0;
        let stabilityCounter = 0;
        const maxAttempts = 20;

        for (let i = 0; i < maxAttempts; i++) {
            await this.page.waitForTimeout(250); // Attesa per permettere al DOM di aggiornarsi
            currentCount = await this.selectionsList.count();
            if (currentCount === initialCount) {
                stabilityCounter++;
                if (stabilityCounter >= 2) { // Conteggio stabile per almeno 500ms
                    break;
                }
            } else {
                initialCount = currentCount;
                stabilityCounter = 0;
            }
        }

    }
    async getAllSelections() {

        await this.waitForSelectionList();
        return this.selectionsList.all();

    }


    async openModal() {
        await waitForLoadState(this.page);
        await this.openModalButton.click();
        await waitForLoadState(this.page);
        await this.auditReportModal.waitFor({ state: 'visible' });
        // await expect(this.planningStrutturaModal).toBeVisible({ timeout: 10000 });

    }
    async closeModal() {
        await this.closeModalButton.click();
        await waitForLoadState(this.page);
        // await expect(this.planningStrutturaModal).not.toBeVisible({ timeout: 10000 });
    }

    async clickSelection(selection: Locator) {
        await selection.click();
    }

    async checkSelection(selection: Locator) {
        //  const selectionName = await selection.textContent()
        //console.log(selectionName)
        //  await selection.click();
        await expect(selection).toHaveClass(/active/);
        const visibleTableRows = this.tableRows.filter({ has: this.page.locator(':visible') });
        if (await visibleTableRows.count() > 0) {
            await expect(visibleTableRows.first()).toBeVisible();
            const cta = visibleTableRows.locator('.pms-goto-reservation-btn').first();
            if (await cta.isVisible()) {
                const [newPage] = await Promise.all([
                    this.page.waitForEvent('popup'),
                    await cta.click()
                ]);
                await waitForLoadState(newPage);
                await newPage.close();
            }
        }
        await expect(this.activeContent).toBeVisible();
        await expect(this.activeContent.first()).not.toBeEmpty();
    }

    async updateResearch(index: number) {
        await this.updateButton.waitFor({ state: 'visible' });
        await this.updateButton.click();
        const loader = this.page.locator('.pms-manager-loading-box').nth(index);
        await loader.waitFor({ state: 'visible' });
        await loader.waitFor({ state: 'hidden' });
    }

    async selectRoom(roomName?: string) {
        const target = roomName || 'hotel pms';

        // 1. Escape dei caratteri speciali (parentesi, ecc.) per non rompere la Regex
        const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // 2. Creiamo la Regex blindata: ^ (inizio), $ (fine), 'i' (ignore case)
        const regexRigida = new RegExp(`^${escaped}$`, 'i');

        // 3. Cerchiamo l'opzione specifica all'interno della select
        const option = this.roomSelector.locator('option').filter({ hasText: regexRigida });

        // 4. Recuperiamo il testo reale (label) presente nel DOM (es. "Hotel Test (FLAVIA)")
        // Usiamo trim() per eliminare eventuali spazi bianchi causati dal rendering di Angular
        const exactLabel = (await option.innerText()).trim();

        // 5. Selezioniamo l'opzione usando la label esatta trovata
        await this.roomSelector.selectOption({ label: exactLabel });
    }

    async getIDVendor() {

    }

}