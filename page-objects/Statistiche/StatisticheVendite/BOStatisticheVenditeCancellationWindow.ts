import { Page, FrameLocator, Locator, expect } from '@playwright/test';
import { waitForLoadState } from '../../../Utils/PageMethods';

export default class BOStatisticheVenditeCancellationWindow {


    filterPanelContainer: Locator;
    yearSelect: Locator;
    refDataSelect: Locator;
    filterBySelect: Locator;
    searchButton: Locator;
    searchInviteMessageContainer: Locator;
    searchInviteMessagePart1: Locator;
    searchInviteMessagePart2: Locator;
    container: Locator | FrameLocator;
    table: Locator;
    searchAlert: Locator;

    constructor(public page: Page, container?) {
        this.page = page;
        this.container = container || this.page
        this.table = this.container.locator('table.tbldata.dataTable');
        this.filterPanelContainer = this.container.locator('.container.pms-scheduler-tools');
        this.yearSelect = this.filterPanelContainer.locator('select[name="year"]');
        this.refDataSelect = this.filterPanelContainer.locator('select[name="refdata"]');
        this.filterBySelect = this.filterPanelContainer.locator('select[name="filterProvenienza"]');
        this.searchButton = this.filterPanelContainer.locator('button.btn.btn-default.cerca-btn');
        this.searchInviteMessageContainer = this.container.locator('.alert.alert-info.pms-alert-info');
        this.searchAlert = this.page.locator('div.alert.alert-info.pms-alert-info');
        this.searchInviteMessagePart1 = this.searchInviteMessageContainer.locator('span[ng-bind-html="trustedMessage1"]');
        this.searchInviteMessagePart2 = this.searchInviteMessageContainer.locator('span[ng-bind-html="trustedMessage2"]');
    }

    async check() {
        await waitForLoadState(this.page);
        await this.checkFilterPanel()
        if (!await this.isTableAvailable()) {
            await this.checkAlert();
        } else {

            await this.checkTable();
            await waitForLoadState(this.page);




        }



    }

    async isTableAvailable() {
        return await this.table.isVisible();
    }
    async checkAlert() {
        await expect(this.searchAlert).toBeVisible();
    }

    async checkTable() {
        await this.table.waitFor({ state: 'visible' });

    }


    async checkFilterPanel() {
        await expect(this.filterPanelContainer).toBeVisible();



        await expect(this.searchButton).toBeVisible();
    }


}