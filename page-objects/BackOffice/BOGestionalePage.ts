import { expect, FrameLocator, Locator, Page } from '@playwright/test';
import BOLeftMenu from './BOLeftMenu';
import { formatToIsoDate, waitForLoadState } from '../../Utils/PageMethods';
import BESearchPage from '../BookingEngine/BESearchPage';
import BOOldVersionLeftMenu from './BOOldVersionLeftMenu';
import BOAuditReportModal from '../Planning/AuditReportModal/BOAuditReportModal';
import BOGestionaleReservationDetailsPage from './BOGestionaleReservationDetailsPage';

export default class BOGestionalePage {
    page: Page
    gestionaleContainer: Locator;
    gestionaleTable: Locator;
    gestionaleRows: Locator;
    gestionaleRoomModal: Locator;
    gestionaleRoomModalCTA: Locator;
    container: any;
    constructor(page: Page, mainContainer?: Locator | FrameLocator) {
        this.page = page;
        this.container = mainContainer || this.page;
        this.gestionaleContainer = this.container.locator('#wrapper');
        this.gestionaleTable = this.gestionaleContainer.locator('#pms-scheduler-table');
        this.gestionaleRows = this.gestionaleTable.locator('tbody tr');
        this.gestionaleRoomModal = this.container.locator('.modal-content:has(h3:has-text("Scegli operazione"))'/*'.modal-content'*/)
        this.gestionaleRoomModalCTA = this.gestionaleRoomModal.locator('button.btn.btn-warning.pull-right');

    }
    async check() {
        await waitForLoadState(this.container);
        await expect(this.gestionaleContainer).toBeVisible();
        await expect(this.gestionaleTable).toBeVisible();
        await this.gestionaleTable.waitFor({ state: 'visible' });
        await expect(this.gestionaleRows.first()).toBeVisible();
    }

    async selectDate(value?: Date) {
        const dateInput = this.container.locator('#start_date');
        const date = value || new Date();
        if (!value) {
            date.setDate(date.getDate() - 1);
        }
        const isoDate = formatToIsoDate(date);

        await dateInput.fill(isoDate);


    }

    async navigateDate() {
        const searchDateCta = this.container.locator('button.pms-navigate-days[uib-tooltip="Vai alla data"]');
        await searchDateCta.click();

    }

    async filterDate(value?: Date) {
        await this.selectDate(value);
        await this.navigateDate();
    }


    async getEmptyRows(): Promise<Locator> {
        await waitForLoadState(this.container);
        await this.gestionaleTable.waitFor({ state: 'visible' });
        return this.gestionaleRows.filter({ hasNot: this.container.locator('#draggable-panel') });

    }

    //    async getReservatedRows(): Promise<Locator> {
    /*  await waitForLoadState(this.container);
      await this.gestionaleTable.waitFor({ state: 'visible' });
      // Usa `hasText` con una regex per trovare le righe che contengono EE o E2E
      return this.gestionaleRows.filter({ hasText: /EE|E2E/ }).filter({ hasNotText: 'fr' });
    */
    /*
            await waitForLoadState(this.container);
            await this.gestionaleTable.waitFor({ state: 'visible' });
            return this.gestionaleRows.filter({ hasText: 'E2E'}).filter({ hasNotText: 'fr' });
          //  return this.gestionaleRows.filter({ hasText: /E2E|EE/ }).filter({ hasNotText: 'fr' });
    
        }
          
        async openReservationDetails(reservatedRows, rowIndex?, reservatedIndex?) {
    
            const row = reservatedRows.nth(rowIndex || 0);
            await expect(row).toBeVisible();
    
            //const roomLabel = row.locator('text=EE, text=E2E').nth(reservatedIndex || 0);
            const roomLabel = row.locator('text=E2E').nth(reservatedIndex || 0);
            await expect(roomLabel).toBeVisible();
            await roomLabel.dblclick();
            return new BOGestionaleReservationDetailsPage(this.page)
        }
        */
    async getAvailableRooms(): Promise<Locator> {
        await waitForLoadState(this.container);
        await this.gestionaleTable.waitFor({ state: 'visible' });

        //  const testRooms = this.gestionaleRows.filter({ has: this.page.locator('text=/EE|E2E/') });
        // const testRooms = this.gestionaleRows.locator('[data-e2e="realroom"]');
        // E poi filtra queste righe per trovare quelle che contengono l'elemento con il testo del tooltip
        // return testRooms.filter({ has: this.page.locator('[uib-tooltip]', { hasText: /Test E2e Emanuele/ }) });
        return this.page.locator('tr[data-e2e="realroom"]').filter({ has: this.page.locator('[uib-tooltip]', { hasText: /Test E2e Emanuele/ }) });

        //return testRooms.filter({ hasNotText: 'fr' });
    }

    async openReservationDetails(availableRooms, roomIndex?, reservationIndex?) {
        const room = availableRooms.nth(roomIndex || 0);
        await expect(room).toBeVisible();
        const reservationLabel = room.locator('[uib-tooltip]').filter({ hasText: /Test E2e Emanuele/ }).nth(reservationIndex || 0);
        //  const roomLabel = row.locator('text=/E2E|EE/').nth(reservatedIndex || 0);
        await expect(reservationLabel).toBeVisible();
        await reservationLabel.dblclick();
        return new BOGestionaleReservationDetailsPage(this.page)
    }

    public async openReservationMenuByName(reservationName: string) {


        const reservationBlock = this.page.locator(`[uib-tooltip*="${reservationName}"]`).first();

        await expect(reservationBlock).toBeVisible({ timeout: 20000 });
        await reservationBlock.hover();

        const dayCell = reservationBlock.locator('xpath=./ancestor::td');

        const menuButton = dayCell
            .locator('span.menu-pr a.dropdown-toggle')
            .first();

        await menuButton.click({ force: true, timeout: 5000 });

        await this.page.waitForTimeout(500);
    }




    async deleteReservation(): Promise<void> {

        const deleteOption = this.page.locator('ul#prcontextualmenu a', { hasText: 'Elimina definitivamente' }).first();
        await deleteOption.waitFor({ state: 'visible' });
        await deleteOption.click();

        const confirmModal = this.page.locator('.modal-content', {
            has: this.page.locator('.modal-header h3', { hasText: 'Conferma operazione' })
        }).filter({
            hasText: 'verrà eliminata'
        });
        const confirmDeleteButton = confirmModal.locator('button#pms-confirm-button');


        await confirmModal.waitFor({ state: 'visible' });
        await confirmDeleteButton.click();
        await confirmModal.waitFor({ state: 'hidden' });

        await waitForLoadState(this.page);

    }

    async filterByName(name: string) {

        await this.gestionaleTable.waitFor({ state: 'visible' });
        const filterInput = this.page.locator('input[placeholder="cerca qui"]');
        await filterInput.waitFor({ state: 'visible' });

        await filterInput.fill(name);
        await filterInput.press('Enter');
        await waitForLoadState(this.page);
    }

    async isReservationVisible(reservationName: string): Promise<boolean> {

        const reservationLabel = this.page.locator(`p[uib-tooltip="${reservationName}"]`).first();
        const isVisible = await reservationLabel.isVisible({ timeout: 1000 }).catch(() => false);
        return isVisible;
    }

    async bookRoom(row?: Locator, totalDays?: number) {
        await this.selectRoom(row, totalDays);
        await this.confirmBooking();
        return new BESearchPage(this.container);
    }

    async selectRoom(row?: Locator, totalDays?: number) {

        const targetRow = row || (await this.getEmptyRows()).first();
        const daysToSelect = totalDays || 2;


        const cells = targetRow.locator('.day-cell.day');
        expect(await cells.count()).toBeGreaterThanOrEqual(daysToSelect);

        const startCell = cells.nth(0);
        const endCell = cells.nth(daysToSelect - 1);


        await startCell.dblclick();
        await startCell.hover();
        await this.container.mouse.down();
        await endCell.hover();
        await this.container.mouse.up();
        await endCell.click();
        //console.log(`Selezionate ${daysToSelect} caselle per la prenotazione.`);

    }
    async confirmBooking() {
        await this.checkRoomModal();

        await this.gestionaleRoomModalCTA.click();

    }
    async checkRoomModal() {
        await expect(this.gestionaleRoomModal).toBeVisible();
        await expect(this.gestionaleRoomModalCTA).toBeVisible();
    }
    async getAuditReportModal() {
        return new BOAuditReportModal(this.container)
    }


}