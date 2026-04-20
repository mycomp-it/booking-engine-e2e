import { Page, expect, Locator } from "@playwright/test";
import { BookingEngineLingua, BookingEngineAzione, BookingEngineMezzo, BookingEngineFromPlanning } from '../../Utils/BookingEngineFormEnums';
import { formatDateTime, generateRandom4DigitNumber } from "../../Utils/PageMethods";



export class BEConfirmPageForm {

        page: Page;
        nameErrorContainer: Locator;
        surnameErrorContainer: Locator;
        phoneErrorContainer: Locator;
        emailErrorContainer: Locator;
        cityErrorContainer: Locator;
        addressErrorContainer: Locator;
        postalCodeErrorContainer: Locator;
        privacyPreferenceErrorContainer: Locator;
        adult1NameErrorContainer: Locator;
        adult1SurnameErrorContainer: Locator;
        adult2NameErrorContainer: Locator;
        adult2SurnameErrorContainer: Locator;
        errorMessage: string;
        price: Locator
        submitButton: Locator
        formContainer: Locator
        participantsContainer: Locator;
        nameContainer: Locator
        surnameContainer: Locator
        phoneContainer: Locator
        emailContainer: Locator
        cityContainer: Locator
        languageContainer: Locator
        communicationTypeContainer: Locator
        addressContainer: Locator
        postalCodeContainer: Locator
        privacyPreferenceContainer: Locator
        nameAdult1Label: Locator;
        surnameAdult1Label: Locator;
        nameAdult2Label: Locator;
        surnameAdult2Label: Locator;
        privacyConditionErrorContainer: Locator;
        privacyConditionLabel: Locator;
        //  actionContainer: Locator
        select1: Locator;
        select2: Locator;

        constructor(page: Page) {

                this.page = page;
                this.submitButton = this.page.locator('button[type="submit"]')
                this.nameErrorContainer = this.page.locator('#name-error')
                this.surnameErrorContainer = this.page.locator('#cognome-error')
                this.phoneErrorContainer = this.page.locator('#phone-error')
                this.emailErrorContainer = this.page.locator('#email-error')
                this.cityErrorContainer = this.page.locator('#city-error')
                this.addressErrorContainer = this.page.locator('#address-error')
                this.postalCodeErrorContainer = this.page.locator('#postal-error')
                this.privacyPreferenceErrorContainer = this.page.locator('#confermamarketing-7-error')
                this.errorMessage = 'Questo campo è obbligatorio.'
                this.privacyConditionErrorContainer = this.page.locator('#condizioni-error')
                this.formContainer = this.page.locator('#bookaccleft')
                this.participantsContainer = this.page.locator('.details-participants');
                this.adult1NameErrorContainer = this.participantsContainer.locator('#name_1_ad_1-error');
                this.adult1SurnameErrorContainer = this.participantsContainer.locator('#surname_1_ad_1-error');
                this.adult2NameErrorContainer = this.participantsContainer.locator('#name_1_ad_2-error');
                this.adult2SurnameErrorContainer = this.participantsContainer.locator('#surname_1_ad_2-error');
                this.nameContainer = this.formContainer.locator('label[for="name"]').first();
                this.surnameContainer = this.formContainer.locator('label[for="cognome"]').first();
                this.emailContainer = this.formContainer.locator('label[for="email"]').first();
                this.phoneContainer = this.formContainer.locator('label[for="phone"]').first();
                this.addressContainer = this.formContainer.locator('label[for="address"]').first();
                this.languageContainer = this.formContainer.locator('select#lingua')
                this.communicationTypeContainer = this.formContainer.locator('select[name="mezzo"]')
                // this.actionContainer = this.formContainer.locator('select#newtrattact')|| this.formContainer.locator('select#pmssavemode');
                this.select1 = this.formContainer.locator('select#newtrattact');
                this.select2 = this.formContainer.locator('select#pmssavemode');

                this.cityContainer = this.formContainer.locator('label[for="city"]').first();
                this.postalCodeContainer = this.formContainer.locator('label[for="postal"]').first();
                this.privacyConditionLabel = this.formContainer.locator('label[for="condizioni"]');
                this.privacyPreferenceContainer = this.page.locator('.disclnewsletter')
                this.nameAdult1Label = this.participantsContainer.locator('fieldset.partecipante.richiedente label[for="name_1_ad_1"]').first();
                this.surnameAdult1Label = this.participantsContainer.locator('fieldset.partecipante.richiedente label[for="surname_1_ad_1"]').first();
                this.nameAdult2Label = this.participantsContainer.locator('fieldset.partecipante:not(.richiedente) label[for="name_1_ad_2"]').first();
                this.surnameAdult2Label = this.participantsContainer.locator('fieldset.partecipante:not(.richiedente) label[for="surname_1_ad_2"]').first();
        }
        async check(){
                await this.checkFields();
        }

        async submitForm() {
                await this.submitButton.waitFor({ state: 'visible' });
                await this.submitButton.click();
        }
        async fillForm(nameValue?:string, surnameValue?:string, emailValue?:string, communicationType?:BookingEngineMezzo, languageValue?:BookingEngineLingua,) {
                await this.nameContainer.fill(nameValue || 'Test E2e Emanuele');
                await this.surnameContainer.fill(surnameValue || `E2E-${formatDateTime(new Date())}`);
                await this.emailContainer.fill(emailValue || `test-e2e-${await generateRandom4DigitNumber()}@testmycomp.it`);

                const findFirstNonEmptyOption = async (selectLocator: Locator): Promise<string | null> => {
                        const options = selectLocator.locator('option');
                        const count = await options.count();
                        for (let i = 0; i < count; i++) {
                                const val = await options.nth(i).getAttribute('value');
                                if (val && val.trim() !== '') return val;
                        }
                        return null;
                };

                // Mezzo di comunicazione: solo se visibile
                if (await this.communicationTypeContainer.isVisible()) {
                        const desiredComm = communicationType || BookingEngineMezzo.CHAT;
                        const exists = await this.communicationTypeContainer.locator(`option[value="${desiredComm}"]`).count() > 0;
                        if (exists) {
                                await this.communicationTypeContainer.selectOption({ value: desiredComm });
                        } else {
                                const firstValue = await findFirstNonEmptyOption(this.communicationTypeContainer);
                                if (firstValue) {
                                        await this.communicationTypeContainer.selectOption({ value: firstValue });
                                } else {
                                        await this.communicationTypeContainer.selectOption({ index: 0 });
                                }
                        }
                }

                // Lingua: solo se visibile
                if (await this.languageContainer.isVisible()) {
                        await this.languageContainer.selectOption({ value: languageValue || BookingEngineLingua.ITALIANO });
                }

                // Checkbox condizioni: se presente e non ancora spuntata, la spunta via JS
                const condizioniCheckbox = this.page.locator('#condizioni');
                if (await condizioniCheckbox.count() > 0 && !(await condizioniCheckbox.isChecked())) {
                        await condizioniCheckbox.evaluate((el: any) => {
                                el.checked = true;
                                el.dispatchEvent(new Event('change', { bubbles: true }));
                                el.dispatchEvent(new Event('click', { bubbles: true }));
                        });
                }

                // Radio marketing: scopo dentro #bookaccleft per evitare duplicati, seleziona NO se nessuno è già selezionato
                const marketingYes = this.formContainer.locator('#cnfmrk-y-7');
                const marketingNo = this.formContainer.locator('#cnfmrk-n-7');
                if (await marketingYes.isVisible()) {
                        const alreadySelected = (await marketingYes.isChecked()) || (await marketingNo.isChecked());
                        if (!alreadySelected) {
                                await marketingNo.check();
                        }
                }
        }

        async setNextAction(actionType: BookingEngineAzione | BookingEngineFromPlanning) {

                if (await this.select1.isVisible()) {
                        await this.select1.selectOption({ value: actionType });
                } else if (await this.select2.isVisible()) {
                        await this.select2.selectOption({ value: actionType });
                }
        }

        async checkMandatoryErrors() {
                await this.checkFields(true);

        }

        async checkPrice(itemPrice?:string) {
                if (itemPrice != null || undefined) {
                        await expect(itemPrice).toBe(await this.price.first().innerText())
                }
        }
        
        async checkFields(value?: boolean) {
                const isExpectedMandatoryError = value || false;

                await this.checkName(isExpectedMandatoryError);
                await this.checkSurname(isExpectedMandatoryError);
                await this.checkEmail(isExpectedMandatoryError);
                await this.checkPhone(isExpectedMandatoryError);
                await this.checkCity(isExpectedMandatoryError);
                await this.checkAddress(isExpectedMandatoryError);
                await this.checkPostalCode(isExpectedMandatoryError);
                await this.checkPrivacyCondition(isExpectedMandatoryError);
                await this.checkPrivacyPreference(isExpectedMandatoryError);
                await this.checkRoomPartecipants(isExpectedMandatoryError);
        }

        async checkName(isExpectedMandatoryError?: boolean) {
                await expect(this.nameContainer).toBeVisible();

                if (isExpectedMandatoryError) {

                        if (await this.isMandatoryField(this.nameContainer)) {
                                await expect(this.nameErrorContainer).toBeVisible()
                                await expect(this.nameErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkSurname(isExpectedMandatoryError?: boolean) {
                await expect(this.surnameContainer).toBeVisible();
                if (isExpectedMandatoryError) {
                        if (await this.isMandatoryField(this.surnameContainer)) {

                                await expect(this.surnameErrorContainer).toBeVisible()
                                await expect(this.surnameErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkPhone(isExpectedMandatoryError?: boolean) {

                await expect(this.phoneContainer).toBeVisible();

                if (isExpectedMandatoryError) {

                        if (await this.isMandatoryField(this.phoneContainer)) {
                                await expect(this.phoneErrorContainer).toBeVisible()
                                await expect(this.phoneErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkEmail(isExpectedMandatoryError?: boolean) {
                await expect(this.emailContainer).toBeVisible();
                if (isExpectedMandatoryError) {

                        if (await this.isMandatoryField(this.emailContainer)) {
                                await expect(this.emailErrorContainer).toBeVisible()
                                await expect(this.emailErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkCity(isExpectedMandatoryError?: boolean) {

                if (isExpectedMandatoryError) {
                        if (await this.isMandatoryField(this.cityContainer)) {
                                await expect(this.cityErrorContainer).toBeVisible()
                                await expect(this.cityErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkAddress(isExpectedMandatoryError?: boolean) {
                if (isExpectedMandatoryError) {

                        if (await this.isMandatoryField(this.addressContainer)) {
                                await expect(this.addressErrorContainer).toBeVisible()
                                await expect(this.addressErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkPostalCode(isExpectedMandatoryError?: boolean) {
                if (isExpectedMandatoryError) {

                        if (await this.isMandatoryField(this.postalCodeContainer)) {
                                await expect(this.postalCodeErrorContainer).toBeVisible()
                                await expect(this.postalCodeErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkPrivacyCondition(isExpectedMandatoryError?: boolean) {
                if (isExpectedMandatoryError) {

                        if (await this.isMandatoryField(this.privacyConditionLabel)) {
                                await expect(this.privacyConditionErrorContainer).toBeVisible()
                                await expect(this.privacyConditionErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkPrivacyPreference(isExpectedMandatoryError?: boolean) {

                if (isExpectedMandatoryError) {
                        if (await this.isMandatoryField(this.privacyPreferenceContainer)) {
                                await expect(this.privacyPreferenceErrorContainer).toBeVisible()
                                await expect(this.privacyPreferenceErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async checkRoomPartecipants(isExpectedMandatoryError?: boolean) {
                if (isExpectedMandatoryError) {
                        if (await this.isMandatoryField(this.nameAdult1Label)) {
                                await expect(this.adult1NameErrorContainer).toBeVisible()
                                await expect(this.adult1NameErrorContainer).toHaveText(this.errorMessage)
                        }
                        if (await this.isMandatoryField(this.surnameAdult1Label)) {
                                await expect(this.adult1SurnameErrorContainer).toBeVisible()
                                await expect(this.adult1SurnameErrorContainer).toHaveText(this.errorMessage)
                        }
                        if (await this.isMandatoryField(this.nameAdult2Label)) {
                                await expect(this.adult2NameErrorContainer).toBeVisible()
                                await expect(this.adult2NameErrorContainer).toHaveText(this.errorMessage)
                        }
                        if (await this.isMandatoryField(this.surnameAdult2Label)) {
                                await expect(this.adult2SurnameErrorContainer).toBeVisible()
                                await expect(this.adult2SurnameErrorContainer).toHaveText(this.errorMessage)
                        }
                }
        }
        async isMandatoryField(mandatoryFieldLabel: Locator): Promise<boolean> {
                const text = await mandatoryFieldLabel.textContent();
                return text ? text.includes('*') : false;
        }

}