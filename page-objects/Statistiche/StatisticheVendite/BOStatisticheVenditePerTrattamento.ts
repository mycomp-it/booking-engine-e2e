import { Page, Locator, expect, } from "@playwright/test";
import { waitForLoadState } from "../../../Utils/PageMethods";

export default class BOStatisticheVenditePerTrattamento {
    page: Page;
    container: Locator;
    filterSection: Locator;
    searchAlert: Locator;
    table: Locator;
    tableElements: Locator;
    private lastToggledElementLocator: Locator | null;



    constructor(page: Page) {
        this.page = page;
        this.container = this.page.locator('div.ibox-content');
        this.table = this.container.locator('table.tbldata.dataTable');
        this.tableElements = this.table.locator('div.tree-node-content a:has(span.fa)');
        this.filterSection = this.container.locator('div.container.pms-scheduler-tools');
        this.searchAlert = this.page.locator('div.alert.alert-info.pms-alert-info');
        this.lastToggledElementLocator = null;





    }
    async check() {
        await waitForLoadState(this.page);
        await expect(this.container).toBeVisible();
        await expect(this.filterSection).toBeVisible();
        if (!(await this.table.isVisible())) {
            await expect(this.searchAlert).toBeVisible();

        }
        if (!await this.areTableOpenableElementsAvailable()) {

        } else {

            await this.checkTable();
            await waitForLoadState(this.page);
            await this.toggleFirstElement();
            await this.checkPrice();

        }

    }
    async areTableOpenableElementsAvailable() {
        return await this.tableElements.isVisible();
    }
    async checkAlert() {
        await expect(this.searchAlert).toBeVisible();
    }
    async checkTable() {
        await this.table.waitFor({ state: 'visible' });
        await expect(await this.countTableElements()).toBeGreaterThan(0);
    }
    async countTableElements(): Promise<number> {
        return this.tableElements.count();
    }
    async toggleFirstElement(): Promise<void> {
        await this.toggleElement(0);
    }
    async toggleElement(elementIndex?: number) {
        const chosenElement = await this.tableElements.nth(elementIndex || 0);

        const parentNode = chosenElement.locator('..').locator('..');
        // 2. Salviamo il riferimento al nodo <li> appena aperto
        this.lastToggledElementLocator = parentNode;

        if (await chosenElement.isVisible()) {
            await chosenElement.click();
        }

    }
    async checkPrice() {
        const totalpriceGroup = await this.tableElements.nth(0).locator('div.col col-md-1 cell price');

    }

}