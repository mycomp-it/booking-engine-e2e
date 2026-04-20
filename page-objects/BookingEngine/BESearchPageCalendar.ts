import { expect, Page } from '@playwright/test';

export default class BESerchPageCalendar {
    constructor(public page: Page) {

    }

    async calendarCompile(checkInDate, checkOutDate) {
        await this.clickDateWrapper();
        await this.selectDate(checkInDate);
        await this.selectDate(checkOutDate);
    }
    async clickDateWrapper() {
        await this.page.click('.wrapper-date-checkin');
        await this.page.waitForSelector('#calendar-grid');
    }

    async selectDate(date: Date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        const day = date.getDate();
        const monthYearValue = `${month}_${year}`;
        await this.page.selectOption('.sel-month', { value: monthYearValue });
        await this.page.click(`.day-m:has-text("${day}")`);
    }
    async checkCalendar() {
        await expect(await this.page.locator('#vuecalendar')).toBeVisible();
        await expect(await this.page.locator('#vuecalendar')).toBeEnabled();
    }
    async checkDates(checkInDate, checkOutDate) {
        Date.parse(checkInDate)
        Date.parse(checkOutDate)
    }
    
}