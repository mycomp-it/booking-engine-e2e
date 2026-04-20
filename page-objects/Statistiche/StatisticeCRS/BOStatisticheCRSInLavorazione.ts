import { Page, Locator, expect, } from "@playwright/test";
import { waitForLoadState } from "../../../Utils/PageMethods";

export default class BOStatisticheCRSInLavorazione {
  page: Page;
  container: Locator;
  filterSection:Locator;
  searchAlert: Locator;
  table:Locator;



  constructor(page: Page) {
    this.page = page;
    this.container = this.page.locator('#form'); 
    this.table = this.container.locator('div.row').nth(1);
    this.filterSection = this.container.locator('div.filter.ibox-content').first();
    this.searchAlert = this.page.locator('div.alert.alert-info.pms-alert-info');





  }
  async check() {
    await waitForLoadState(this.page);
    await expect(this.container).toBeVisible();
    await expect(this.filterSection).toBeVisible();
    if (!(await this.table.isVisible())) {
      await expect(this.searchAlert).toBeVisible();

    }else{
       
      
    }



  }

}