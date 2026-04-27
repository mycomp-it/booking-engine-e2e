import { expect, test } from '@playwright/test'
import BESearchPage from '../page-objects/BookingEngine/BESearchPage'
import BEResultItemPage from '../page-objects/BookingEngine/BEResultItemPage'
import OptionalServicesPage from '../page-objects/BookingEngine/BEOptionalServicesPage'
import BEConfirmPage from '../page-objects/BookingEngine/BEConfirmPage'
import { BEConfirmPageForm } from '../page-objects/BookingEngine/BEConfirmPageForm'

test.setTimeout(210000)
test.use({ actionTimeout: 10000 })

const startUrl = `${process.env.BASE_URL}/.eshop?idcliente=${process.env.BE_TENANT_ID}&idvendor=${process.env.BE_VENDOR_ID}&idsito=${process.env.BE_SITE_ID}&lang=${process.env.BE_LANG}&`;

test('Ricerca di disponibilità', async ({ page }) => {

  await page.goto(startUrl)
  const startPage = new BESearchPage(page);
  await startPage.check();
  const optionalServicesPage = new OptionalServicesPage(page);

  const resultsPage: BESearchPage = await startPage.searchFirstAvailable();

  const firstResultItem: BEResultItemPage = await resultsPage.getFirstResult();
  const itemPrice = await firstResultItem.getFirstPrice();
  console.log(`Prezzo prima stanza (escluse tasse): ${itemPrice}`);

  await firstResultItem.checkCTAButtons();
  const confirmPage: BEConfirmPage = await firstResultItem.clickFirstCTAButton();

  await optionalServicesPage.isOptionalServices();

  const confirmPageForm: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
  await confirmPageForm.check();
  await confirmPageForm.submitForm();
  await confirmPageForm.checkMandatoryErrors();
  await confirmPageForm.fillForm();
  await confirmPageForm.submitForm();
  await confirmPageForm.waitForThankYouPage();
  

})

test('it allows to check the modal', async ({ page }) => {
  await page.goto(startUrl)
  const startPage = new BESearchPage(page);
  await startPage.check();

  const resultsPage: BESearchPage = await startPage.searchFirstAvailable();

  const firstResultItem: BEResultItemPage = await resultsPage.getFirstResult();
  await firstResultItem.check();
  await firstResultItem.openModal();
  await firstResultItem.checkModal();
  await firstResultItem.closeModal();
});
