import BESearchPage from '../page-objects/BookingEngine/BESearchPage';
import BEConfirmPage from '../page-objects/BookingEngine/BEConfirmPage';
import BEResultItemPage from '../page-objects/BookingEngine/BEResultItemPage';
import { BEConfirmPageForm } from '../page-objects/BookingEngine/BEConfirmPageForm';

async function searchAndExectBookingEngineBasicReservation(searchPage, checkInDate, checkOutDate, nameValue?, surnameValue?, emailValue?, communicationType?, languageValue?) {

    await searchPage.check();
    const resultsPage: BESearchPage = await searchPage.search(checkInDate, checkOutDate);
    await resultsPage.checkAfterSearch(checkInDate, checkOutDate);

    const firstResultItem: BEResultItemPage = await resultsPage.getFirstResult();
    const itemPrice = await firstResultItem.getFirstPrice();

    await firstResultItem.checkCTAButtons();

    const confirmPage: BEConfirmPage = await firstResultItem.clickFirstCTAButton();

    await resultsPage.goToOptionalFormPage();

    const confirmPageForm: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
    await confirmPageForm.fillForm(nameValue, surnameValue, emailValue, communicationType, languageValue);

    return confirmPage;
}

async function exectBookingEngineBasicReservation(resultsPage, nameValue?, surnameValue?, emailValue?, communicationType?, languageValue?) {

    const firstResultItem: BEResultItemPage = await resultsPage.getFirstResult();
    const itemPrice = await firstResultItem.getFirstPrice();

    await firstResultItem.checkCTAButtons();

    const confirmPage: BEConfirmPage = await firstResultItem.clickFirstCTAButton();

    await resultsPage.goToOptionalFormPage();

    const confirmPageForm: BEConfirmPageForm = await confirmPage.getConfirmPageForm();
    await confirmPageForm.fillForm(nameValue, surnameValue, emailValue, communicationType, languageValue);

    return confirmPage;
}

export { searchAndExectBookingEngineBasicReservation, exectBookingEngineBasicReservation };
