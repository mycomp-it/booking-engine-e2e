import { expect, Page ,Locator} from '@playwright/test';
import BESerchPageCalendar from './BESearchPageCalendar';
import BEResultItemPage from './BEResultItemPage';
import BEConfirmPage from './BEConfirmPage';
export default class BESearchPage {

    calendar: BESerchPageCalendar;
    confirmSearchButton:Locator;

    constructor(public page: Page) {
        this.calendar = new BESerchPageCalendar(this.page);
        this.confirmSearchButton =  this.page.locator('#coversearch');
    }
    async search(checkInDate, checkOutDate) {
        await this.calendar.calendarCompile(checkInDate, checkOutDate);
        await this.confirmSearch();
        return new BESearchPage(this.page)
    }
    
    async check() {
        await this.calendar.checkCalendar()
    }
    async confirmSearch(){
        await this.confirmSearchButton.waitFor({state:'visible'});
        await this.confirmSearchButton.click();


    }
    async checkAfterSearch(checkInDate, checkOutDate) {
        await this.calendar.checkDates(checkInDate, checkOutDate)
    }
    async getFirstResult() {
        //restituisce il primo risultato di getresults
        const firstResultId = 'product-1'
        return new BEResultItemPage(firstResultId, this.page);
        //return primorisultato

    }
    async goToOptionalFormPage() {
        try {
            (await expect(this.page.locator('#facilitiescontainer')).toBeVisible)
            // await this.page.locator('button[type="submit"]').waitFor({state:'visible'});
            await this.page.locator('button[type="submit"]').first().waitFor({state:'visible'});
            await this.page.waitForTimeout(3000);
            await this.page.locator('button[type="submit"]').first().click();
        } catch (error) {

        }
        return new BEConfirmPage(this.page)
    }


}
