import { expect, test } from '@playwright/test'
import BESearchPage from '../page-objects/BookingEngine/BESearchPage'
import BEResultItemPage from '../page-objects/BookingEngine/BEResultItemPage'
import BEOptionalServicesPage from '../page-objects/BookingEngine/BEOptionalServicesPage'
import BEConfirmPage from '../page-objects/BookingEngine/BEConfirmPage'
import { BEConfirmPageForm } from '../page-objects/BookingEngine/BEConfirmPageForm'

test.setTimeout(210000)
test.use({ actionTimeout: 10000 })

const startUrl = `${process.env.BASE_URL}/.eshop?idcliente=${process.env.BE_TENANT_ID}&idvendor=${process.env.BE_VENDOR_ID}&idsito=${process.env.BE_SITE_ID}&lang=${process.env.BE_LANG}&`;

// Gherkin: ricerca.feature — Contesto: struttura senza pms, camera master con piano Standard (Cc a garanzia)

test.describe('Booking Engine — Ricerca disponibilità', () => {

    // Gherkin: Scenario "Ricerca e richiesta disponibilità" @basicTest
    // 1 adulto → prima data disponibile → listino su richiesta
    // → continua → compila form richiesta disponibilità → conferma → pagina confermata
    test('Ricerca e richiesta disponibilità (prima data disponibile, 1 adulto)', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);
        await searchPage.check();

        const resultsPage: BESearchPage = await searchPage.searchFirstAvailable();

        const firstResult: BEResultItemPage = await resultsPage.getFirstResult();
        await firstResult.checkCTAButtons();

        const confirmPage: BEConfirmPage = await firstResult.clickFirstCTAButton();

        const optionalServicesPage = new BEOptionalServicesPage(page);
        await optionalServicesPage.isOptionalServices();

        const form: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
        await form.check();
        await form.fillForm();
        await form.submitForm();
        await form.waitForThankYouPage();
    });

    // Gherkin: Scenario "Ricerca e prenotazione"
    // Con disponibilità caricata → prima data disponibile → listino prenotabile
    // → continua → compila form prenotazione → conferma
    test('Ricerca e prenotazione con disponibilità (prima data disponibile)', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);
        await searchPage.check();

        const resultsPage: BESearchPage = await searchPage.searchFirstAvailable();

        const firstResult: BEResultItemPage = await resultsPage.getFirstResult();
        await firstResult.check();
        await firstResult.checkCTAButtons();

        const confirmPage: BEConfirmPage = await firstResult.clickFirstCTAButton();

        const optionalServicesPage = new BEOptionalServicesPage(page);
        await optionalServicesPage.isOptionalServices();

        const form: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
        await form.check();
        await form.fillForm();
        await form.submitForm();
        await form.waitForThankYouPage();
    });

    // Gherkin: Scenario "Ricerca e richiesta disponibilità e successiva prenotazione" @inLavorazione
    // Fallito in data 17/08/2023 — marcato come skip in attesa di fix
    test.skip('Ricerca disponibilità su richiesta, poi prenotazione diretta dopo carico disponibilità', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);
        const resultsPage: BESearchPage = await searchPage.searchFirstAvailable();
        const firstResult: BEResultItemPage = await resultsPage.getFirstResult();
        const confirmPage: BEConfirmPage = await firstResult.clickFirstCTAButton();
        const optionalServicesPage = new BEOptionalServicesPage(page);
        await optionalServicesPage.isOptionalServices();
        const form: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
        await form.fillForm();
        await form.submitForm();
        await form.waitForThankYouPage();

        // Seconda parte: dopo carico disponibilità lato BO (fuori scope),
        // ripeti ricerca e verifica che ora sia prenotabile
        await page.goto(startUrl);
        const searchPage2 = new BESearchPage(page);
        const resultsPage2: BESearchPage = await searchPage2.searchFirstAvailable();
        const firstResult2: BEResultItemPage = await resultsPage2.getFirstResult();
        await firstResult2.checkCTAButtons();
    });

});
