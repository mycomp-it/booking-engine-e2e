import { expect, test } from '@playwright/test'
import BESearchPage from '../page-objects/BookingEngine/BESearchPage'
import BEResultItemPage from '../page-objects/BookingEngine/BEResultItemPage'
import OptionalServicesPage from '../page-objects/BookingEngine/BEOptionalServicesPage'
import BEConfirmPage from '../page-objects/BookingEngine/BEConfirmPage'
import { BEConfirmPageForm } from '../page-objects/BookingEngine/BEConfirmPageForm'

test.setTimeout(210000)
test.use({ actionTimeout: 10000 })

const startUrl = process.env.BASE_URL + '/.eshop?idcliente=preprod_hotel&idvendor=3&idsito=1&lang=1&';

test('Ricerca di disponibilità', async ({ page }) => {

  await page.goto(startUrl)
  const startPage = new BESearchPage(page);
  await startPage.check();
  const optionalServicesPage = new OptionalServicesPage(page);

  const today = new Date();
  const checkInDate = new Date(today);
  checkInDate.setDate(today.getDate() + 2);
  const checkOutDate = new Date(today);
  checkOutDate.setDate(today.getDate() + 3);
  console.log(`Data del checkIn (data odierna + 2 giorni): ${checkInDate}`)
  console.log(`Data del checkOut (data odierna + 3 giorni): ${checkOutDate}`)

  const resultsPage: BESearchPage = await startPage.search(checkInDate, checkOutDate);
  await resultsPage.checkAfterSearch(checkInDate, checkOutDate);

  const firstResultItem: BEResultItemPage = await resultsPage.getFirstResult();
  const itemPrice = await firstResultItem.getFirstPrice();
  console.log(`Prezzo prima stanza (escluse tasse): ${itemPrice}`);

  await firstResultItem.checkCTAButtons();
  const confirmPage: BEConfirmPage = await firstResultItem.clickFirstCTAButton();

  // Se presente la pagina dei servizi opzionali, la salta e va al form
  await optionalServicesPage.isOptionalServices();

  const confirmPageForm: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
  await confirmPageForm.check();
  await confirmPageForm.submitForm();
  // await confirmPageForm.checkMandatoryErrors();
  await confirmPageForm.fillForm();
  await confirmPageForm.submitForm();
})

test('it allows to check the mdodal', async ({ page }) => {
  await page.goto(startUrl)
  const startPage = new BESearchPage(page);
  await startPage.check();
  const today = new Date();
  const checkInDate = new Date(today);
  checkInDate.setDate(today.getDate() + 2);
  const checkOutDate = new Date(today);
  checkOutDate.setDate(today.getDate() + 3);
  const resultsPage: BESearchPage = await startPage.search(checkInDate, checkOutDate);
  await resultsPage.checkAfterSearch(checkInDate, checkOutDate);
  const firstResultItem: BEResultItemPage = await resultsPage.getFirstResult();
  await firstResultItem.check();
  await firstResultItem.openModal();
  await firstResultItem.checkModal();
  await firstResultItem.closeModal();


});
