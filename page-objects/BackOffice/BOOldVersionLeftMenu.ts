import { Page, Locator, expect } from "@playwright/test";
import { waitForLoadState } from "../../Utils/PageMethods";
import BOPlanningStrutturaPage from "../Planning/BOPlanningStrutturaPage";
import BOStatisticheCRS from "../Statistiche/StatisticeCRS/BOStatisticheCRS";
import BOStatisticheVenditeBookingWindow from "../Statistiche/StatisticheVendite/BOStatisticheVenditeBookingWindow";
import BOStatisticheVenditeConfronti from "../Statistiche/StatisticheVendite/BOStatisticheVenditeConfronti";
import BOStatisticheVenditePerCanale from "../Statistiche/StatisticheVendite/BOStatisticheVenditePerCanale";
import BOStatisticheVenditePerNazione from "../Statistiche/StatisticheVendite/BOStatisticheVenditePerNazione";
import BOStatisticheVenditePerPianoTariffario from "../Statistiche/StatisticheVendite/BOStatisticheVenditePerPianoTariffario";
import BOStatisticheVenditePerSistemazione from "../Statistiche/StatisticheVendite/BOStatisticheVenditePerSistemazione";
import BOStatisticheVenditePerTrattamento from "../Statistiche/StatisticheVendite/BOStatisticheVenditePerTrattamento";
import BONewTrattativaByPhone from "../Trattativa/BONewTrattativaByPhone";
import BOTutteTrattativePage from "../Trattativa/BOTutteTrattativePage";
import BOOldVersionHomePage from "./BOOldVersionHomePage";
import BOStatisticheMensiliPage from '../Statistiche/StatisticheVendite/BOStatisticheMensiliPage';
import BOStrutturePage from "./BOStrutturePage";
import BOStatisticheVenditeCancellationWindow from "../Statistiche/StatisticheVendite/BOStatisticheVenditeCancellationWindow";
import BOStatisticheVenditeCancellazioniPerPeriodo from "../Statistiche/StatisticheVendite/BOStatisticheVenditeCancellazioniPerPeriodo";
import BOStatisticheVenditeCancellazioniPerAnticipo from "../Statistiche/StatisticheVendite/BOStatisticheVenditeCancellazioniPerAnticipo";
import BOStatisticheGestionaleTotaliMensiliPage from "../Statistiche/StatisticheGestionale/BOStatisticheGestionaleTotaliMensili";
import BOStatisticheGestionaleProduzioneOccupazionePerNazionalità from "../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzionePerNazionalità";
import BOStatisticheGestionaleProduzioneOccupazionePerPeriodo from "../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzioneOccupazionePerPeriodo";
import BOStatisticheGestionaleProduzioneOccupazionePerTipologia from "../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzioneOccupazionePerTipologia";
import BOStatisticheGestionaleProduzioneOccupazionePerReparto from "../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzionePerReparto";
import BOStatisticheGestionaleProduzioneOccupazionePerTrattamento from "../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzionePerTrattamento";
import BOStatisticheCRSInLavorazione from "../Statistiche/StatisticeCRS/BOStatisticheCRSInLavorazione";
import BODisponibilitàPage from "../Catalogo/Disponibilità/BODisponibilitaPage";


export default class BOOldVersionLeftMenu {
    page: Page;
    leftMenuContainer: Locator;
    switchToOldVersionButton: Locator;
    logo: Locator;
    gestionaleContainer: Locator;
    planningMultiStrutturaContainer: Locator;
    trattativeContainer: Locator;
    tutteTrattativeContainer: Locator;
    trattativaTelefonicaCTA: Locator;
    statisticheLink: Locator;
    statisticheVenditeLink: Locator;
    statisticheMensiliLink: Locator;
    struttureTab: Locator;
    statisticheCRSLink: Locator;
    crsLink: Locator;
    venditePerCanaleLink: Locator;
    venditePerNazioneLink: Locator;
    venditePerPianoTariffarioLink: Locator;
    venditePerSistemazioneLink: Locator;
    venditePerTrattamentoLink: Locator;
    confrontiLink: Locator;
    bookingWindowLink: Locator;
    cancellationWindowLink: Locator;
    cancellazioniPerPeriodoLink: Locator;
    cancellazioniPerAnticipoLink: Locator;
    statisticheGestionaleLink: Locator;
    statisticheGestionaleMensiliLink: Locator;
    statisticheGestionaleProduzioneOccupazionePerPeriodoLink: Locator;
    statisticheGestionaleProduzioneOccupazionePerTipologiaLink: Locator;
    statisticheGestionaleProduzionePerRepartoLink: Locator;
    statisticheGestionalePresenzePerNazionalitàLink: Locator;
    statisticheGestionaleProduzionePerTrattamentoLink: Locator;
    inLavorazioneLink: Locator;
    catalogLink: Locator;
    disponibilitàLink:Locator;
    struttureCatalogLink:Locator;


    constructor(page: Page) {
        this.page = page;
        this.leftMenuContainer = this.page.locator('#side-menu');
        this.switchToOldVersionButton = this.leftMenuContainer.locator('button.btn.btn-primary.w-300');
        this.logo = this.leftMenuContainer.locator('#logo');
        this.gestionaleContainer = this.leftMenuContainer.locator('li:has(i.fa-building-o) > a');
        this.struttureTab = this.leftMenuContainer.locator('li:has(i.fa-building-o) ul.nav-second-level a:has-text("Strutture")');
        this.planningMultiStrutturaContainer = this.leftMenuContainer.locator('li:has(i.fa-building-o) a:has-text("Planning multistruttura")');
        this.trattativeContainer = this.leftMenuContainer.locator('li:has(span.nav-label:has-text("Trattative"))');
        this.trattativaTelefonicaCTA = this.trattativeContainer.getByText('Telefonica');
        this.tutteTrattativeContainer = this.trattativeContainer.getByText('Tutte');
        this.statisticheLink = this.leftMenuContainer.getByRole('link', { name: 'Statistiche' }).first();
        this.statisticheVenditeLink = this.leftMenuContainer.locator('a:has(span.nav-label:has-text("Statistiche Vendite"))');
        this.statisticheMensiliLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Totali Mensili"))').nth(0);
        this.statisticheCRSLink = this.leftMenuContainer.getByRole('link', { name: 'Statistiche CRS' });
        this.crsLink = this.leftMenuContainer.locator('ul.nav-third-level li a:has-text("CRS")');
        this.inLavorazioneLink = this.leftMenuContainer.locator('ul.nav-third-level li a:has-text("In lavorazione")');
        this.venditePerCanaleLink = this.leftMenuContainer.locator('li a:has-text("Vendite per Canale")');
        this.venditePerSistemazioneLink = this.leftMenuContainer.locator('li a:has-text("Vendite per Sistemazione")');
        this.venditePerPianoTariffarioLink = this.leftMenuContainer.locator('li a:has-text("Vendite per Piano Tariffario")');
        this.venditePerNazioneLink = this.leftMenuContainer.locator('li a:has-text("Vendite per Nazione")');
        this.venditePerTrattamentoLink = this.leftMenuContainer.locator('li a:has-text("Vendite per Trattamento")');
        this.confrontiLink = this.leftMenuContainer.locator('li a:has-text("Confronti")');
        this.bookingWindowLink = this.leftMenuContainer.locator('li a:has-text("Booking Window")');
        this.cancellationWindowLink = this.leftMenuContainer.locator('li a:has-text("Cancellation Window")');
        this.cancellazioniPerPeriodoLink = this.leftMenuContainer.locator('li a:has-text("Cancellazioni per Periodo")');
        this.cancellazioniPerAnticipoLink = this.leftMenuContainer.locator('li a:has-text("Cancellazioni per Anticipo")');
        this.statisticheGestionaleLink = this.leftMenuContainer.locator('a:has(span.nav-label:has-text("Statistiche Gestionale"))');
        this.statisticheGestionaleMensiliLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Totali Mensili"))').nth(1);
        this.statisticheGestionaleProduzioneOccupazionePerPeriodoLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Produzione e occupazione per periodo"))').first();
        this.statisticheGestionaleProduzioneOccupazionePerTipologiaLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Produzione e occupazione per tipologia"))').first();
        this.statisticheGestionaleProduzionePerRepartoLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Produzione per reparto/addebito/categoria"))').first();
        this.statisticheGestionaleProduzionePerTrattamentoLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Produzione per trattamento"))').first();
        this.statisticheGestionalePresenzePerNazionalitàLink = this.leftMenuContainer.locator('ul.nav-third-level li > a:has(span.nav-label:has-text("Presenze per Nazionalità"))').first();
        this.catalogLink = this.leftMenuContainer.locator('li:has(span.nav-label:has-text("Catalogo"))');
        this.disponibilitàLink = this.leftMenuContainer.locator('a:has(span.nav-label:has-text("Disponibilità e tariffe"))');
        this.struttureCatalogLink = this.leftMenuContainer.locator('li.active a:has-text("Strutture")');




    }



    async check() {
        await waitForLoadState(this.page);
        await expect(this.leftMenuContainer).toBeVisible();
        //await expect(this.logo).toBeVisible();
    }

    async switchToOldVersion() {
        await this.switchToOldVersionButton.click();
        return new BOOldVersionHomePage(this.page);
    }

    async openGestionaleTab() {
        await this.gestionaleContainer.click();
    }

    async openPlanningMultiStrutturaTab() {

        await this.planningMultiStrutturaContainer.click();

    }

    async switchToPlanningMultiStruttura() {
        await this.openGestionaleTab()
        await this.openPlanningMultiStrutturaTab()
        return new BOPlanningStrutturaPage(this.page);
    }
    async switchToTrattativaTelefonica() {
        await this.openTrattativeTab()
        await this.openTrattativaTelefonica()
        return new BONewTrattativaByPhone(this.page)
    }

    async openTrattativeTab() {
        await this.trattativeContainer.click();
    }
    async openTrattativaTelefonica() {
        await this.trattativaTelefonicaCTA.click();
    }

    async openTutteTrattativeTab() {
        await this.tutteTrattativeContainer.click();
    }

    async switchToTutteTrattative() {
        await this.openTrattativeTab();
        await this.openTutteTrattativeTab();
        return new BOTutteTrattativePage(this.page);
    }

    async openStatisticheTab() {
        const parentListItem = this.statisticheLink.locator('..');
        const classAttribute = await parentListItem.getAttribute('class');
        const isMenuOpen = classAttribute ? classAttribute.includes('active') : false;
        const submenu = parentListItem.locator('ul.nav-second-level').first();
        if (!await isMenuOpen) {
            await this.statisticheLink.click();
            await submenu.waitFor({ state: 'visible' });
        }
    }

    async openStatisticheVenditeTab() {

        await expect(this.statisticheVenditeLink).toBeVisible({ timeout: 15000 });
        const parentListItem = this.statisticheVenditeLink.locator('..');
        const classAttribute = await parentListItem.getAttribute('class');
        const isMenuOpen = classAttribute ? classAttribute.includes('active') : false;
        if (!isMenuOpen) {
            await this.waitForAnimation(this.statisticheVenditeLink)
            await this.statisticheVenditeLink.click();

        }
    }
    async openStatisticheGestionaleTab() {

        await expect(this.statisticheGestionaleLink).toBeVisible({ timeout: 15000 });
        const parentListItem = this.statisticheGestionaleLink.locator('..');
        const classAttribute = await parentListItem.getAttribute('class');
        const isMenuOpen = classAttribute ? classAttribute.includes('active') : false;
        if (!isMenuOpen) {
            await this.waitForAnimation(this.statisticheGestionaleLink)
            await this.statisticheGestionaleLink.click();

        }
    }

    private async waitForAnimation(locator: Locator) {
        await locator.waitFor({ state: 'visible' });
        await locator.evaluate(el => new Promise(r => setTimeout(r, 500)));
    }

    async openStatisticheMensiliTab() {
        await expect(this.statisticheMensiliLink).toBeVisible({ timeout: 15000 });
        await this.statisticheMensiliLink.click();
    }

    async switchToStatisticheMensili() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        await this.openStatisticheMensiliTab();
        return new BOStatisticheMensiliPage(this.page);
    }
    async goToStatisticheCRS() {
        await this.openStatisticheTab();
        await this.openStatisticheCRS();
        await this.openCRS();
        return new BOStatisticheCRS(this.page);
    }


    async goToStatisticheVenditePerCanale() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerCanaleTab();



    }

    async goToStatisticheVenditePerNazione() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerNazioneTab();
    }

    async goToStatisticheCRSInLavorazione() {
        await this.openStatisticheTab();
        await this.openStatisticheCRS();

        return await this.openInLavorazioneTab();
    }

    async openStatisticheCRS() {
        await expect(this.statisticheCRSLink).toBeVisible({ timeout: 15000 });
        const parentListItem = this.statisticheCRSLink.locator('..');
        const classAttribute = await parentListItem.getAttribute('class');
        const isMenuOpen = classAttribute ? classAttribute.includes('active') : false;
        if (!isMenuOpen) {
            await this.waitForAnimation(this.statisticheCRSLink)
            await this.statisticheCRSLink.click();

        }
    }


    async openInLavorazioneTab() {
        await this.inLavorazioneLink.waitFor({ state: 'visible' });
        await this.inLavorazioneLink.click();
        return new BOStatisticheCRSInLavorazione(this.page);
    }

    async openCRS() {
        await this.crsLink.waitFor({ state: 'visible' });
        await this.crsLink.click();
    }



    async openStatisticheVenditePerCanaleTab() {
        await this.venditePerCanaleLink.click();
        return new BOStatisticheVenditePerCanale(this.page);
    }



    async openStatisticheVenditePerNazioneTab() {
        await this.venditePerNazioneLink.click();
        return new BOStatisticheVenditePerNazione(this.page);
    }

    async goToStatisticheVenditePerPianoTariffario() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerPianoTariffarioTab();
    }

    async openStatisticheVenditePerPianoTariffarioTab() {
        await this.venditePerPianoTariffarioLink.click();
        return new BOStatisticheVenditePerPianoTariffario(this.page);
    }

    async goToStatisticheVenditePerSistemazione() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerSistemazioneTab();
    }

    async openStatisticheVenditePerSistemazioneTab() {
        await this.venditePerSistemazioneLink.click();
        return new BOStatisticheVenditePerSistemazione(this.page);
    }

    async goToStatisticheVenditePerTrattamento() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerTrattamentoTab();
    }

    async openStatisticheVenditePerTrattamentoTab() {
        await this.venditePerTrattamentoLink.click();
        return new BOStatisticheVenditePerTrattamento(this.page);
    }

    async goToConfronti() {

        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openConfrontiTab();
    }

    async openConfrontiTab() {
        await this.confrontiLink.click();
        return new BOStatisticheVenditeConfronti(this.page);

    }

    async goToBookingWindow() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openBookingWindowTab();
    }

    async openBookingWindowTab() {
        await this.bookingWindowLink.click();
        return new BOStatisticheVenditeBookingWindow(this.page);
    }

    async goToCancellationWindow() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openCancellationWindowTab();



    }
    async openCancellationWindowTab() {

        await this.cancellationWindowLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheVenditeBookingWindow(this.page);

    }

    async goToCancellazioniPerPeriodo() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openCancellazioniPerPeriodoTab();



    }
    async openCancellazioniPerPeriodoTab() {

        await this.cancellazioniPerPeriodoLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheVenditeCancellazioniPerPeriodo(this.page);


    }
    async goToCancellazioniPerAnticipo() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openCancellazioniPerAnticipoTab();



    }
    async openCancellazioniPerAnticipoTab() {

        await this.cancellazioniPerAnticipoLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheVenditeCancellazioniPerAnticipo(this.page);

    }

    async switchToStrutture() {
        await this.openGestionaleTab();
        return await this.openStruttureTab();
    }
    async openStruttureTab() {
        await this.struttureTab.click();
        return new BOStrutturePage(this.page);
    }



    async goToGestionaleTotaliMensili() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleMensiliTab();

    }

    async openStatisticheGestionaleMensiliTab() {
        await expect(this.statisticheGestionaleMensiliLink).toBeVisible({ timeout: 15000 });
        await this.statisticheGestionaleMensiliLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleTotaliMensiliPage(this.page);
    }


    async goToGestionaleProduzioneOccupazionePerPeriodo() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzioneOccupazionePerPeriodoTab();

    }

    async openStatisticheGestionaleProduzioneOccupazionePerPeriodoTab() {
        await expect(this.statisticheGestionaleProduzioneOccupazionePerPeriodoLink).toBeVisible({ timeout: 15000 });
        await this.statisticheGestionaleProduzioneOccupazionePerPeriodoLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleProduzioneOccupazionePerPeriodo(this.page);
    }



    async goToGestionaleProduzioneOccupazionePerTipologia() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzioneOccupazionePerTipologiaTab();

    }

    async openStatisticheGestionaleProduzioneOccupazionePerTipologiaTab() {
        await expect(this.statisticheGestionaleProduzioneOccupazionePerTipologiaLink).toBeVisible({ timeout: 15000 });
        await this.statisticheGestionaleProduzioneOccupazionePerTipologiaLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleProduzioneOccupazionePerTipologia(this.page);
    }

    async goToGestionaleProduzionePerReparto() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzionePerRepartoTab();

    }

    async openStatisticheGestionaleProduzionePerRepartoTab() {
        await expect(this.statisticheGestionaleProduzionePerRepartoLink).toBeVisible({ timeout: 15000 });
        await this.statisticheGestionaleProduzionePerRepartoLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleProduzioneOccupazionePerReparto(this.page);
    }


    async goToGestionaleProduzionePerTrattamento() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzionePerTrattamentoTab();

    }

    async openStatisticheGestionaleProduzionePerTrattamentoTab() {
        await expect(this.statisticheGestionaleProduzionePerTrattamentoLink).toBeVisible({ timeout: 15000 });
        await this.statisticheGestionaleProduzionePerTrattamentoLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleProduzioneOccupazionePerTrattamento(this.page);
    }



    async goToGestionalePresenzePerNazionalità() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionalePresenzePerNazionalitàTab();

    }

    async openStatisticheGestionalePresenzePerNazionalitàTab() {
        await expect(this.statisticheGestionalePresenzePerNazionalitàLink).toBeVisible({ timeout: 15000 });
        await this.statisticheGestionalePresenzePerNazionalitàLink.click();
        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleProduzioneOccupazionePerNazionalità(this.page);
    }


    async goToStruttureCatalog() {

        await this.openCatalogo();
        return await this.openStruttureCatalog();

    }

    async openStruttureCatalog() {
        await this.struttureCatalogLink.click();
        return new BOStrutturePage(this.page);

    }

    async openCatalogo() {
        const parentListItem = this.catalogLink.locator('..');
        const classAttribute = await parentListItem.getAttribute('class');
        const isMenuOpen = classAttribute ? classAttribute.includes('active') : false;
        const submenu = parentListItem.locator('ul.nav-second-level').first();
        if (!await isMenuOpen) {
            await this.catalogLink.click();
            //await submenu.waitFor({ state: 'visible' });
        }



    }
    async goToDisponibilitàPage(){
        await this.openCatalogo();
        await this.disponibilitàLink.click();
        return new BODisponibilitàPage(this.page);
    }
    

}