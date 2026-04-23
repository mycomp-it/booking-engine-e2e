import { test } from '@playwright/test'
import BESearchPage from '../page-objects/BookingEngine/BESearchPage'
import BEResultItemPage from '../page-objects/BookingEngine/BEResultItemPage'
import BEOptionalServicesPage from '../page-objects/BookingEngine/BEOptionalServicesPage'
import BEConfirmPage from '../page-objects/BookingEngine/BEConfirmPage'
import { BEConfirmPageForm } from '../page-objects/BookingEngine/BEConfirmPageForm'
import { searchAndExectBookingEngineBasicReservation } from '../Utils/BECommonActions'

test.setTimeout(210000)
test.use({ actionTimeout: 10000 })

const startUrl = `${process.env.BASE_URL}/.eshop?idcliente=${process.env.BE_TENANT_ID}&idvendor=${process.env.BE_VENDOR_ID}&idsito=${process.env.BE_SITE_ID}&lang=${process.env.BE_LANG}&`;

// Gherkin: bookingengine2021.feature
// Contesto: struttura senza pms, camera master con piano Standard (Cc a garanzia), 1 disponibilità da oggi a 6 mesi

test.describe('Booking Engine — Prenotazione', () => {

    // Gherkin: Schema "prenotazione carta di credito a garanzia"
    // Checkin oggi, checkout domani, 1 adulto → continua → compila form → conferma
    // → pagina "richiesta di disponibilità confermata" → trattativa in stato "nuove"
    // Nota: la verifica della trattativa nel BO è coperta dai test di bo-pms-e2e
    test('Prenotazione con carta di credito a garanzia — flusso BE', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);

        const today = new Date();
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 4);
        const checkOutDate = new Date(today);
        checkOutDate.setDate(today.getDate() + 5);

        const confirmPage: BEConfirmPage = await searchAndExectBookingEngineBasicReservation(
            searchPage,
            checkInDate,
            checkOutDate
        );

        await confirmPage.form.submitForm();
    });

    // Gherkin: Schema "prenotazione con payment gateway e assicurazione" @inLavorazione
    // Richiede configurazione payment gateway Saferpay — marcato come skip
    test.skip('Prenotazione con payment gateway e assicurazione', async ({ page }) => {
        // Prerequisito: payment gateway Saferpay abilitato + piano tariffario "Not Refundable"
        // Non replicabile senza configurazione specifica dell'ambiente
    });

});

// Gherkin: bookingengine2021.feature
// Scenario: prolungamento automatico soggiorno (con attivazione prolungamento da BE)
// Parzialmente replicato — il Gherkin originale si interrompe prima della conferma
test.describe('Booking Engine — Scenari avanzati', () => {

    test('Prolungamento automatico soggiorno — flusso BE', async ({ page }) => {
        await page.goto(startUrl);
        const searchPage = new BESearchPage(page);

        const today = new Date();
        const checkInDate = new Date(today);
        checkInDate.setDate(today.getDate() + 2);
        const checkOutDate = new Date(today);
        checkOutDate.setDate(today.getDate() + 3);

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

});

// Gherkin: precheckin.feature — Scenario "compilazione del precheckin da parte del cliente" @basicTest
// Richiede prenotazione esistente con URL precheckin inviato via email
// Configura BE_PRECHECKIN_URL in .env per abilitare questo test
test.describe('Booking Engine — Precheckin', () => {

    test.skip('Compilazione precheckin da parte del cliente', async ({ page }) => {
        // Prerequisito: BE_PRECHECKIN_URL deve puntare al link precheckin di una prenotazione esistente
        // Il link viene inviato via email dopo la creazione della prenotazione (fuori scope di questo test)
        const precheckinUrl = process.env.BE_PRECHECKIN_URL;
        if (!precheckinUrl) {
            test.skip(true, 'BE_PRECHECKIN_URL non configurata — configura il link precheckin in .env');
        }
        await page.goto(precheckinUrl!);
        // Compila il form del precheckin e verifica il redirect alla thank you page
    });

});
