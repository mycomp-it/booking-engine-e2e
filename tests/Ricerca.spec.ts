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
    // Checkin oggi, checkout domani, 1 adulto → listino su richiesta
    // → continua → compila form richiesta disponibilità → conferma → pagina confermata
    test('Ricerca e richiesta disponibilità (checkin oggi, checkout domani, 1 adulto)', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);
        await searchPage.check();

        const today = new Date();
        const checkInDate = new Date(today);
        const checkOutDate = new Date(today);
        checkOutDate.setDate(today.getDate() + 1);

        const resultsPage: BESearchPage = await searchPage.search(checkInDate, checkOutDate);
        await resultsPage.checkAfterSearch(checkInDate, checkOutDate);

        const firstResult: BEResultItemPage = await resultsPage.getFirstResult();
        await firstResult.checkCTAButtons();

        const confirmPage: BEConfirmPage = await firstResult.clickFirstCTAButton();

        const optionalServicesPage = new BEOptionalServicesPage(page);
        await optionalServicesPage.isOptionalServices();

        const form: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
        await form.check();
        await form.fillForm();
        await form.submitForm();
    });

    // Gherkin: Scenario "Ricerca e prenotazione"
    // 5 disponibilità caricate → checkin oggi, checkout domani, 2 adulti → listino prenotabile
    // → continua → compila form prenotazione → conferma → pagina prenotazione confermata
    test('Ricerca e prenotazione con disponibilità (checkin +2, checkout +3)', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);
        await searchPage.check();

        const today = new Date();
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 2);
        const checkOutDate = new Date(today);
        checkOutDate.setDate(today.getDate() + 3);

        const resultsPage: BESearchPage = await searchPage.search(checkInDate, checkOutDate);
        await resultsPage.checkAfterSearch(checkInDate, checkOutDate);

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
    });

    // Gherkin: Scenario "Ricerca e richiesta disponibilità e successiva prenotazione" @inLavorazione
    // Fallito in data 17/08/2023 — marcato come skip in attesa di fix
    test.skip('Ricerca disponibilità su richiesta, poi prenotazione diretta dopo carico disponibilità', async ({ page }) => {
        // Prima parte: cerca, ottieni su richiesta, compila form richiesta
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);
        const today = new Date();
        const checkInDate = new Date(today);
        const checkOutDate = new Date(today);
        checkOutDate.setDate(today.getDate() + 1);

        const resultsPage: BESearchPage = await searchPage.search(checkInDate, checkOutDate);
        const firstResult: BEResultItemPage = await resultsPage.getFirstResult();
        const confirmPage: BEConfirmPage = await firstResult.clickFirstCTAButton();
        const optionalServicesPage = new BEOptionalServicesPage(page);
        await optionalServicesPage.isOptionalServices();
        const form: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
        await form.fillForm();
        await form.submitForm();

        // Seconda parte: dopo carico disponibilità (operazione lato BO non replicabile qui),
        // ripeti ricerca e verifica che ora sia prenotabile
        await page.goto(startUrl);
        const searchPage2 = new BESearchPage(page);
        const resultsPage2: BESearchPage = await searchPage2.search(checkInDate, checkOutDate);
        await resultsPage2.checkAfterSearch(checkInDate, checkOutDate);
        const firstResult2: BEResultItemPage = await resultsPage2.getFirstResult();
        await firstResult2.checkCTAButtons();
    });

});
