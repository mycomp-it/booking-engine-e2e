import { Page, Locator, expect } from '@playwright/test';
import BOOldVersionHomePage from './BOOldVersionHomePage';
import BOOldVersionLeftMenu from './BOOldVersionLeftMenu';
import BOLeftMenu from './BOLeftMenu';
import { waitForLoadState } from '../../Utils/PageMethods';

export default class BOHomePage {

    page: Page
    leftMenu: BOLeftMenu;
    oldVersionLeftMenu: BOOldVersionLeftMenu;
    oldVersionHome: BOOldVersionHomePage;
    switchToOldVersionButton: Locator;



    constructor(page: Page) {
        this.page = page;
        this.leftMenu = new BOLeftMenu(this.page);
        this.oldVersionLeftMenu = new BOOldVersionLeftMenu(this.page);
        

    }

    async check() {
        await waitForLoadState(this.page);
      
    }
   

    async switchToOldVersion() {
        this.oldVersionHome = await this.leftMenu.switchToOldVersion();
        return this.oldVersionHome;

    }

    async getLeftMenu(value?: number) {
        const bool = value || 0;
        if (bool > 0) {
            return this.leftMenu;
        }
        else {
            return this.oldVersionLeftMenu;
        }
    }
    async getOldVersionLeftMenu() {

        return this.oldVersionLeftMenu;
    }
}
