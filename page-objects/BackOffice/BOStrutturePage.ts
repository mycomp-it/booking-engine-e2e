import { Page, Locator, expect, FrameLocator } from '@playwright/test';
import BOLeftMenu from './BOLeftMenu';
import BOGestionalePage from './BOGestionalePage';
import BODisponibilitàPage from '../Catalogo/Disponibilità/BODisponibilitaPage';
export default class BOStrutturePage {

    leftMenu: BOLeftMenu;
    struttureContainer: Locator;
    struttureTable: Locator;
    struttureTableRow: Locator;
    strutturaCTASelector: string;
    wrapper: Locator;
    container: Page | FrameLocator;
    page: Page;



    constructor(page, mainContainer?) {
        this.page = page;
        this.container = mainContainer || this.page;
        this.wrapper = this.container.locator('#wrapper');
        this.struttureTable = this.wrapper.locator('#resultlistvendors');
        this.struttureTableRow = this.struttureTable.locator('tbody tr');
        this.strutturaCTASelector = 'td.namevendor a';




    }
    async check() {

        await expect(this.struttureContainer).toBeVisible();
        await expect(this.struttureTable).toBeVisible();
        await this.struttureTable.waitFor({ state: 'visible' });
        await expect(this.struttureTableRow.first()).toBeVisible();
    }

    async openStrutturaByName(nomeStruttura?: string) {
        const nome = nomeStruttura || 'hotel pms';

        // 1. Prepariamo la Regex "blindata" (esatto dall'inizio alla fine, case-insensitive)
        const escapedNome = nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexRigida = new RegExp(`^${escapedNome}$`, 'i');

        // 2. Filtriamo la riga che contiene il link con quel nome esatto
        const rowLocator = this.struttureTableRow.filter({
            has: this.page.locator(this.strutturaCTASelector).filter({ hasText: regexRigida })
        });

        // 3. Definiamo il target finale (il link specifico in quella riga)
        const strutturaCta = rowLocator.locator(this.strutturaCTASelector);

        // Debug rapido se il test fallisce ancora
     
        await expect(strutturaCta).toBeVisible();
        await strutturaCta.click();

        return new BOGestionalePage(this.page, this.container);
    }
    async openCatalogoStrutturaByName(nomeStruttura?: string) {
        const nome = nomeStruttura || 'hotel pms';

        // 1. Prepariamo la Regex "blindata" (esatto dall'inizio alla fine, case-insensitive)
        const escapedNome = nome.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regexRigida = new RegExp(`^${escapedNome}$`, 'i');

        const rowLocator = this.struttureTableRow.filter({ hasText: regexRigida });
        const strutturaCta = rowLocator.first().locator(this.strutturaCTASelector);

        await expect(strutturaCta).toBeVisible();

        await strutturaCta.click();

        //console.log(`Cliccato il link per la struttura: ${nomeStruttura}`);
        return new BODisponibilitàPage(this.page);

    }

}