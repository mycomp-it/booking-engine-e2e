import { expect, Locator, Page, FrameLocator } from '@playwright/test';
import BOOldVersionHomePage from './BOOldVersionHomePage';
import BOPlanningStrutturaPage from '../Planning/BOPlanningStrutturaPage';
import { waitForLoadState } from '../../Utils/PageMethods';
import BOTutteTrattativePage from '../Trattativa/BOTutteTrattativePage';
import BOStatisticheMensiliPage from '../Statistiche/StatisticheVendite/BOStatisticheMensiliPage';
import BONewTrattativaByPhone from '../Trattativa/BONewTrattativaByPhone';
import BOStrutturePage from './BOStrutturePage';
import BOStatisticheCRS from '../Statistiche/StatisticeCRS/BOStatisticheCRS';
import BOStatisticheVenditePerCanale from '../Statistiche/StatisticheVendite/BOStatisticheVenditePerCanale';
import BOStatisticheVenditePerSistemazione from '../Statistiche/StatisticheVendite/BOStatisticheVenditePerSistemazione';
import BOStatisticheVenditePerTrattamento from '../Statistiche/StatisticheVendite/BOStatisticheVenditePerTrattamento';
import BOStatisticheVenditePerPianoTariffario from '../Statistiche/StatisticheVendite/BOStatisticheVenditePerPianoTariffario';
import BOStatisticheVenditePerNazione from '../Statistiche/StatisticheVendite/BOStatisticheVenditePerNazione';
import BOStatisticheVenditeConfronti from '../Statistiche/StatisticheVendite/BOStatisticheVenditeConfronti';
import BOStatisticheVenditeBookingWindow from '../Statistiche/StatisticheVendite/BOStatisticheVenditeBookingWindow';
import BOStatisticheVenditeCancellazioniPerPeriodo from '../Statistiche/StatisticheVendite/BOStatisticheVenditeCancellazioniPerPeriodo';
import BOStatisticheVenditeCancellazioniPerAnticipo from '../Statistiche/StatisticheVendite/BOStatisticheVenditeCancellazioniPerAnticipo';
import BOStatisticheGestionaleTotaliMensiliPage from '../Statistiche/StatisticheGestionale/BOStatisticheGestionaleTotaliMensili';
import BOStatisticheGestionaleProduzioneOccupazionePerPeriodo from '../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzioneOccupazionePerPeriodo';
import BOStatisticheGestionaleProduzioneOccupazionePerTipologia from '../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzioneOccupazionePerTipologia';
import BOStatisticheGestionaleProduzioneOccupazionePerNazionalità from '../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzionePerNazionalità';
import BOStatisticheGestionaleProduzioneOccupazionePerReparto from '../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzionePerReparto';
import BOStatisticheGestionaleProduzioneOccupazionePerTrattamento from '../Statistiche/StatisticheGestionale/BOStatisticheGestionaleProduzionePerTrattamento';
import BOStatisticheCRSInLavorazione from '../Statistiche/StatisticeCRS/BOStatisticheCRSInLavorazione';
import BODisponibilitàPage from '../Catalogo/Disponibilità/BODisponibilitaPage';

export default class BOLeftMenu {
    page: Page;
    leftMenu: BOLeftMenu;
    leftMenuContainer: Locator;
    switchToOldVersionButton: Locator;
    logo: Locator;
    gestionaleContainer: Locator;
    planningMultiStrutturaContainer: Locator;
    trattativeContainer: Locator;
    tutteTrattativeContainer: Locator;
    trattativaTelefonicaCTA: Locator;
    statisticheContainer: Locator;
    statisticheVenditeContainer: Locator;
    statisticheMensiliContainer: Locator;
    struttureTab: Locator;
    frame: FrameLocator;

    constructor(page: Page) {
        this.page = page;
        this.leftMenuContainer = this.page.locator('#leftMenu');
        this.switchToOldVersionButton = this.leftMenuContainer.locator('button.btn.btn-primary.w-300');
        this.logo = this.leftMenuContainer.locator('#div-logo');
        this.gestionaleContainer = this.leftMenuContainer.locator('#li-pmsmanager');
        this.struttureTab = this.gestionaleContainer.locator('#a-pmsmanager-strutture');
        this.planningMultiStrutturaContainer = this.gestionaleContainer.locator('#a-pmsmanager-strutture-planning');
        this.trattativeContainer = this.leftMenuContainer.locator('#li-trattative');
        this.trattativaTelefonicaCTA = this.trattativeContainer.locator('#a-trattativa-telefonica')
        this.tutteTrattativeContainer = this.trattativeContainer.locator('#li-trattative-tutte');
        this.statisticheContainer = this.leftMenuContainer.locator('#li-statistiche');
        this.statisticheVenditeContainer = this.statisticheContainer.locator('#a-statistiche-vendite');
        this.statisticheMensiliContainer = this.statisticheContainer.locator('#a-statistiche-vendite-totali');
        this.frame = this.page.frameLocator('#innerIframe');

    }

    async check() {
        await waitForLoadState(this.page);
        await expect(this.leftMenuContainer).toBeVisible();
        await expect(this.logo).toBeVisible();
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
    async isFrameVisible(): Promise<boolean> {
        // Check if the iframe element itself is visible
        const iframeLocator = this.page.locator('#innerIframe');
        return await iframeLocator.isVisible();
    }

    async switchToPlanningMultiStruttura() {
        await this.openGestionaleTab()
        await this.openPlanningMultiStrutturaTab()
        return new BOPlanningStrutturaPage(this.page, this.frame);
    }
    async switchToTrattativaTelefonica() {
        await this.openTrattativeTab()
        await this.openTrattativaTelefonica()
        return new BONewTrattativaByPhone(this.page, this.frame)
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
        return new BOTutteTrattativePage(this.page, this.frame);
    }

    async openStatisticheTab() {
        await this.statisticheContainer.click();
    }

    async openStatisticheVenditeTab() {
        await this.statisticheVenditeContainer.click();
    }

    async openStatisticheGestionaleTab() {
        await this.statisticheVenditeContainer.click();
    }

    async openStatisticheMensiliTab() {
        await this.statisticheMensiliContainer.click();
    }

    async switchToStatisticheMensili() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        await this.openStatisticheMensiliTab();
        return new BOStatisticheMensiliPage(this.page, this.frame);
    }

    async switchToStrutture() {
        await this.openGestionaleTab();
        return await this.openStruttureTab();
    }
    async openStruttureTab() {
        await this.struttureTab.click();
        return new BOStrutturePage(this.frame);
    }
    async goToStatisticheCRS() {
        await this.openStatisticheTab();
        return new BOStatisticheCRS(this.page);

    }
    async goToStatisticheVenditePerCanale() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerCanaleTab();



    }
    async openStatisticheVenditePerCanaleTab() {


        return new BOStatisticheVenditePerCanale(this.page);

    }
    async goToStatisticheVenditePerNazione() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerNazioneTab();



    }
    async openStatisticheVenditePerNazioneTab() {


        return new BOStatisticheVenditePerNazione(this.page);

    }

    async goToStatisticheVenditePerPianoTariffario() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerPianoTariffarioTab();



    }
    async openStatisticheVenditePerPianoTariffarioTab() {


        return new BOStatisticheVenditePerPianoTariffario(this.page);

    }

    async goToStruttureCatalog(){ 

        await this.openCatalogo();

        return await this.openStruttureCatalog();

    }

   async openStruttureCatalog(){
     return new BOStrutturePage(this.page);
    
   }

   async openCatalogo(){

   }
    async goToDisponibilitàPage(){
           
           return new BODisponibilitàPage(this.page);
       }




    async goToStatisticheVenditePerSistemazione() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerSistemazioneTab();



    }
    async openStatisticheVenditePerSistemazioneTab() {


        return new BOStatisticheVenditePerSistemazione(this.page);

    }
    async goToStatisticheVenditePerTrattamento() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openStatisticheVenditePerTrattamentoTab();



    }
    async openStatisticheVenditePerTrattamentoTab() {


        return new BOStatisticheVenditePerTrattamento(this.page);

    }

    async goToConfronti() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openConfrontiTab();



    }
    async openConfrontiTab() {


        return new BOStatisticheVenditeConfronti(this.page);

    }

    async goToBookingWindow() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openBookingWindowTab();



    }
    async openBookingWindowTab() {


        return new BOStatisticheVenditeBookingWindow(this.page);

    }

    async goToCancellationWindow() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openCancellationWindowTab();



    }
    async openCancellationWindowTab() {


        return new BOStatisticheVenditeBookingWindow(this.page);

    }

    async goToCancellazioniPerPeriodo() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openCancellationWindowTab();



    }
    async openCancellazioniPerPeriodoTab() {


        return new BOStatisticheVenditeCancellazioniPerPeriodo(this.page);

    } async goToCancellazioniPerAnticipo() {
        await this.openStatisticheTab();
        await this.openStatisticheVenditeTab();
        return await this.openCancellazioniPerAnticipoTab();



    }
    async openCancellazioniPerAnticipoTab() {
        await waitForLoadState(this.page);

        return new BOStatisticheVenditeCancellazioniPerAnticipo(this.page);

    }




    async goToGestionaleTotaliMensili() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleMensiliTab();

    }

    async openStatisticheGestionaleMensiliTab() {

        await waitForLoadState(this.page);
        return new BOStatisticheGestionaleTotaliMensiliPage(this.page);
    }


    async goToGestionaleProduzioneOccupazionePerPeriodo() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzioneOccupazionePerPeriodoTab();

    }

    async openStatisticheGestionaleProduzioneOccupazionePerPeriodoTab() {

        return new BOStatisticheGestionaleProduzioneOccupazionePerPeriodo(this.page);
    }



    async goToGestionaleProduzioneOccupazionePerTipologia() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzioneOccupazionePerTipologiaTab();

    }

    async openStatisticheGestionaleProduzioneOccupazionePerTipologiaTab() {

        return new BOStatisticheGestionaleProduzioneOccupazionePerTipologia(this.page);
    }

    async goToGestionaleProduzionePerReparto() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzionePerRepartoTab();

    }

    async openStatisticheGestionaleProduzionePerRepartoTab() {

        return new BOStatisticheGestionaleProduzioneOccupazionePerReparto(this.page);
    }


    async goToGestionaleProduzionePerTrattamento() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionaleProduzionePerTrattamentoTab();

    }

    async openStatisticheGestionaleProduzionePerTrattamentoTab() {

        return new BOStatisticheGestionaleProduzioneOccupazionePerTrattamento(this.page);
    }



    async goToGestionalePresenzePerNazionalità() {
        await this.openStatisticheTab();
        await this.openStatisticheGestionaleTab();
        return await this.openStatisticheGestionalePresenzePerNazionalitàTab();

    }

    async openStatisticheGestionalePresenzePerNazionalitàTab() {

        return new BOStatisticheGestionaleProduzioneOccupazionePerNazionalità(this.page);
    }

    async goToStatisticheCRSInLavorazione() {
        await this.openStatisticheTab();
        await this.openStatisticheCRS();

        return await this.openInLavorazioneTab();
    }

    async openStatisticheCRS() {

    }


    async openInLavorazioneTab() {

        return new BOStatisticheCRSInLavorazione(this.page);
    }











}
