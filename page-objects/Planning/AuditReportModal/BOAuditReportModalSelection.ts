import { Locator, Page, expect } from "@playwright/test";

export default class BOAuditReportModalSelection {
    private page: Page;
    private modal: Locator;
    openSelectionLink: Locator;
    modalBody: Locator;
    tableRows: Locator;
    private modalAlert: Locator;

    constructor(page: Page, auditReportModal: Locator) {
        this.page = page;
        this.modal = auditReportModal;
        this.modalAlert = //this.planningStrutturaModal.locator('.alert.alert-info', { has: this.planningStrutturaModal.locator('li.uib-tab[index="1"]', { hasText: 'Checkin' }) });
        this.openSelectionLink = //this.planningStrutturaModal.locator('li.uib-tab', { hasText: 'Checkin' });
        this.modalBody = this.modal.locator('#modal-body').first();
        this.tableRows = this.modalBody.locator('table.printing-area tbody tr');
    }

    async openSelection() {
        await this.openSelectionLink.click();

    }
    async check() {
        // await this.modalAlert.waitFor({ state: 'visible' });
        // await expect(this.modalAlert).toBeVisible();
        if (await this.tableRows.count() > 0) {
            await expect(this.tableRows.first()).toBeVisible();
        }
    }
}






