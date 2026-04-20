import { Page, Locator, expect, FrameLocator, Frame } from '@playwright/test';
import BOLeftMenu from '../BackOffice/BOLeftMenu';
import { waitForLoadState } from '../../Utils/PageMethods';
import { skip } from 'node:test';
import BOAuditReportModal from './AuditReportModal/BOAuditReportModal';
export default class BOPlanningStrutturaPage {
    page: Page;
    schedulerTable: Locator;
    leftMenu: BOLeftMenu;
    tableTbodies: Locator;
    tbodyHeaderRows: Locator;
    roomRows: Locator;

    planningStrutturaModal: Locator;
    planningStrtturaOpenModalButton: Locator;
    planningStrtturaCloseModalButton: Locator;
    container: Locator | FrameLocator;

    constructor(page: Page, container?) {
        this.page = page;
        this.container = container || this.page
        this.schedulerTable = this.container.locator('#pms-scheduler-table');
        this.tableTbodies = this.schedulerTable.locator('tbody');
        this.tbodyHeaderRows = this.schedulerTable.locator('tbody > tr.sticky-top-4');
        this.roomRows = this.schedulerTable.locator('tbody tr[data-e2e="realroom"]');
        
    }
    /*
        async check() {
            await this.page.waitForLoadState('networkidle');
          //  await this.leftMenu.check();
            await expect(this.schedulerTable).toBeVisible();
            await this.checkTR(await this.checkTBodies());
        }
    
      
        private async checkTBodies() {
            const tbodyCount = await this.tableTbodies.count();
            expect(tbodyCount).toBeGreaterThan(0)
            return tbodyCount;
        }
    
        private async checkTR(tbodyCount){
            for (let i = 0; i < tbodyCount; i++) {
                const currentTbody = this.tableTbodies.nth(i);
                const headerRowForCurrentTbody = currentTbody.locator('> tr.sticky-top-4');
                await expect(headerRowForCurrentTbody).toBeVisible({ timeout: 10000 });
                await expect(headerRowForCurrentTbody).toHaveCount(1)
              //  await expect(headerRowForCurrentTbody.locator('.vendorNameClass')).toContainText('HOTEL PMS');
                const roomRowsInCurrentTbody = currentTbody.locator('tr[data-e2e="realroom"]');
                const roomRowCount = await roomRowsInCurrentTbody.count();
               await expect(await roomRowsInCurrentTbody.count()).toBeGreaterThan(0)
                for (let j = 0; j < roomRowCount; j++) {
                    const firstTdOfRoomRow = roomRowsInCurrentTbody.nth(j).locator('td.room-number').first();
                    await expect(firstTdOfRoomRow).not.toBeEmpty();
                }
            }
                */


    async check() {
        await waitForLoadState(this.page);
        await this.schedulerTable.waitFor({ state: 'visible', timeout: 20000 });
        await expect(this.schedulerTable).toBeVisible({ timeout: 20000 });
        await this.checkTbodies()
        await this.checkTR(this.tableTbodies.first());
        await this.checkTR(this.tableTbodies.last());


    }

    async countTbodies(): Promise<number> {
        const tbodyCount = await this.tableTbodies.count();
        return tbodyCount;
    }
    async checkTbodies() {
        await expect(this.tableTbodies.first()).toBeVisible({ timeout: 15000 });
        expect(await this.countTbodies()).toBeGreaterThan(0);
    }

    async checkTR(currentTbody): Promise<void> {
        const headerRowForCurrentTbody = currentTbody.locator('> tr.sticky-top-4');
        await expect(headerRowForCurrentTbody).toBeVisible({ timeout: 15000 });
        await expect(headerRowForCurrentTbody).toHaveCount(1);
        const roomRowsInCurrentTbody = currentTbody.locator('tr[data-e2e="realroom"]');
        //   await expect(roomRowsInCurrentTbody.nth(i)).toBeVisible({ timeout: 15000 });
        const roomRowCount = await this.roomRowsCount(roomRowsInCurrentTbody);
        expect(roomRowCount).toBeGreaterThan(0);

        //TD
        for (let j = 0; j < roomRowCount; j++) {
            const firstTdOfRoomRow = roomRowsInCurrentTbody.nth(j).locator('td.room-number').first();
            await expect(firstTdOfRoomRow).toBeVisible({ timeout: 5000 });

            await expect(firstTdOfRoomRow).not.toBeEmpty();
        }

    }
    async roomRowsCount(roomRowsInCurrentTbody) {
        const roomRowCount = await roomRowsInCurrentTbody.count();
        return roomRowCount;
    }
   
    async getAuditReportModal(){

          return new BOAuditReportModal(this.page);
    }
    async closeModal() {
        await this.planningStrtturaCloseModalButton.click();

    }

    /*  private async  checkTBodies(){
           const tbodyCount = await this.tableTbodies.count();
           expect(tbodyCount).toBeGreaterThan(0)
           return tbodyCount;
       }
      private async checkTR(tbodyCount){
              for (let i = 0; i < tbodyCount; i++) {
               const currentTbody = this.tableTbodies.nth(i);
   
               // Verifica che il TBODY abbia un TR di intestazione (i.e., il TR con il nome del vendor/hotel)
               const headerRowForCurrentTbody = currentTbody.locator('> tr.sticky-top-4');
               await expect(headerRowForCurrentTbody).toBeVisible({ timeout: 10000 }); // Aumentato il timeout per sicurezza
               await expect(headerRowForCurrentTbody).toHaveCount(1, `Il tbody ${i} deve avere una singola riga di intestazione.`);
   
               // Verifica che il TR di intestazione abbia un link con il nome del vendor/hotel
               // Il testo esatto potrebbe variare, quindi verifichiamo che contenga "HOTEL PMS"
               await expect(headerRowForCurrentTbody.locator('.vendorNameClass')).toContainText('HOTEL PMS');
   
   
               // Verifica che ci siano dei TR delle room all'interno di questo tbody
               // Il primo TD di queste righe deve contenere il nome della stanza
               const roomRowsInCurrentTbody = currentTbody.locator('tr[data-e2e="realroom"]');
               const roomRowCount = await roomRowsInCurrentTbody.count();
               expect(roomRowCount).toBeGreaterThan(0, `Il tbody ${i} deve contenere delle righe di stanza.`);
   
               // Verifica che il primo TD di ogni riga di stanza abbia un nome (testo non vuoto)
               for (let j = 0; j < roomRowCount; j++) {
                   const firstTdOfRoomRow = roomRowsInCurrentTbody.nth(j).locator('td.room-number').first();
                   await expect(firstTdOfRoomRow).not.toBeEmpty();
               }
           }
   
       }
           */
}