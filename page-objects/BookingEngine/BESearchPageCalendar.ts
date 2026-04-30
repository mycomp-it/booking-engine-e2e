import { expect, Page } from '@playwright/test';

// Selettore per i giorni cliccabili: .col senza day-notavailable e senza filler
const AVAILABLE_DAY = '#calendar-grid .col:not(.day-notavailable):not(.filler) span.day-m';

export default class BESerchPageCalendar {
    constructor(public page: Page) {

    }

    async calendarCompile(checkInDate, checkOutDate) {
        await this.clickDateWrapper();
        await this.selectDate(checkInDate);
        await this.selectDate(checkOutDate);
    }

    // Seleziona la prima coppia di date disponibili nel calendario:
    // check-in = primo giorno disponibile, check-out = secondo giorno disponibile
    async selectFirstAvailableDates(): Promise<void> {
        await this.clickDateWrapper();
        const availableDays = this.page.locator(AVAILABLE_DAY);
        await availableDays.first().waitFor({ state: 'visible' });
        await availableDays.first().click();   // check-in
        await availableDays.nth(1).click();    // check-out: giorno successivo disponibile
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