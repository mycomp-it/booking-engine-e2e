
import { Locator, Page } from "@playwright/test";
import { formatToDDMMYYYY, getTomorrowDate } from "../../../Utils/PageMethods";

export default class BOModificaBlocco {

    container: Locator;
    minstaySelect: Locator;
    pickerFromUpdate: Locator;
    pickerToUpdate: Locator;

    constructor(public page: Page) {

        this.page = page;
        this.container = this.page.locator('div.ibox-content[ng-if="viewmode==\'period\'"]');
        this.minstaySelect = this.container.locator('#table-header')

            .locator('tr:nth-child(2)')

            .locator('th:nth-child(9)')

            .locator('select.form-control');
        this.pickerFromUpdate = this.container.locator('#pickerFromUpdate');
        this.pickerToUpdate = this.container.locator('#pickerToUpdate');


    }

    async setMinStay(value: string) {
        const minStayValue = value || '3';
        await this.minstaySelect.selectOption({ label: minStayValue });
    }

    async setEditingPeriod(startDate?: string, endDate?: string): Promise<void> {

        await this.pickerFromUpdate.fill(startDate || await formatToDDMMYYYY(await getTomorrowDate()));
        await this.pickerFromUpdate.press('Escape');
        await this.pickerToUpdate.fill(endDate || await formatToDDMMYYYY(await getTomorrowDate()));
        await this.pickerToUpdate.press('Escape');




    }




}
