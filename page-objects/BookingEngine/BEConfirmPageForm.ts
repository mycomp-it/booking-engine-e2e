import { Page, expect, Locator } from "@playwright/test";
import { BookingEngineLingua, BookingEngineAzione, BookingEngineMezzo, BookingEngineFromPlanning } from '../../Utils/BookingEngineFormEnums';
import { formatDateTime, generateRandom4DigitNumber } from "../../Utils/PageMethods";



export class BEConfirmPageForm {

        page: Page;
        errorMessage: string;
        price: Locator;
        submitButton: Locator;
        formContainer: Locator;
        participantsContainer: Locator;
        nameContainer: Locator;
        surnameContainer: Locator;
        phoneContainer: Locator;
        emailContainer: Locator;
        languageContainer: Locator;
        communicationTypeContainer: Locator;
        privacyPreferenceContainer: Locator;
        privacyConditionLabel: Locator;
        nameAdult1Label: Locator;
        surnameAdult1Label: Locator;
        nameAdult2Label: Locator;
        surnameAdult2Label: Locator;
        select1: Locator;
        select2: Locator;
        phoneInput: Locator;
        addressInput: Locator;
        cityInput: Locator;
        postalInput: Locator;
        countrySelect: Locator;
        ccContainer: Locator;
        ccName: Locator;
        ccNumber: Locator;
        ccMonth: Locator;
        ccYear: Locator;

        constructor(page: Page) {
                this.page = page;
                this.errorMessage = 'Questo campo è obbligatorio.';
                this.submitButton = this.page.locator('button[type="submit"]');
                this.formContainer = this.page.locator('#bookaccleft');
                this.participantsContainer = this.page.locator('.details-participants');

                this.nameContainer = this.formContainer.locator('label[for="name"]').first();
                this.surnameContainer = this.formContainer.locator('label[for="cognome"]').first();
                this.emailContainer = this.formContainer.locator('label[for="email"]').first();
                this.phoneContainer = this.formContainer.locator('label[for="phone"]').first();
                this.languageContainer = this.formContainer.locator('select#lingua');
                this.communicationTypeContainer = this.formContainer.locator('select[name="mezzo"]');
                this.select1 = this.formContainer.locator('select#newtrattact');
                this.select2 = this.formContainer.locator('select#pmssavemode');
                this.privacyConditionLabel = this.formContainer.locator('label[for="condizioni"]');
                this.privacyPreferenceContainer = this.page.locator('.disclnewsletter');
                this.nameAdult1Label = this.participantsContainer.locator('fieldset.partecipante.richiedente label[for="name_1_ad_1"]').first();
                this.surnameAdult1Label = this.participantsContainer.locator('fieldset.partecipante.richiedente label[for="surname_1_ad_1"]').first();
                this.nameAdult2Label = this.participantsContainer.locator('fieldset.partecipante:not(.richiedente) label[for="name_1_ad_2"]').first();
                this.surnameAdult2Label = this.participantsContainer.locator('fieldset.partecipante:not(.richiedente) label[for="surname_1_ad_2"]').first();

                this.phoneInput = this.page.locator('#phone');
                this.addressInput = this.page.locator('#address');
                this.cityInput = this.page.locator('#city');
                this.postalInput = this.page.locator('#postal');
                this.countrySelect = this.page.locator('#country');

                this.ccContainer = this.page.locator('#daticartadicredito');
                this.ccName = this.page.locator('#ccname');
                this.ccNumber = this.page.locator('input[name="ccnumber"]');
                this.ccMonth = this.page.locator('#ccmonth');
                this.ccYear = this.page.locator('#ccyear');
        }

        async check() {
                await expect(this.formContainer).toBeVisible();
                await expect(this.nameContainer).toBeVisible();
                await expect(this.surnameContainer).toBeVisible();
                await expect(this.emailContainer).toBeVisible();
        }

        async submitForm() {
                await this.submitButton.waitFor({ state: 'visible' });
                await this.submitButton.click();
        }

        async waitForThankYouPage() {
                await this.page.locator('#confirmok').waitFor({ state: 'visible' });
        }

        async fillForm(
                nameValue?: string,
                surnameValue?: string,
                emailValue?: string,
                communicationType?: BookingEngineMezzo,
                languageValue?: BookingEngineLingua,
                phoneValue?: string,
                addressValue?: string,
                cityValue?: string,
                postalValue?: string,
                countryValue?: string,
        ) {
                await this.nameContainer.fill(nameValue || 'Test E2e Emanuele');
                await this.surnameContainer.fill(surnameValue || `E2E-${formatDateTime(new Date())}`);
                await this.emailContainer.fill(emailValue || `test-e2e-${await generateRandom4DigitNumber()}@testmycomp.it`);

                if (await this.phoneInput.isVisible()) {
                        await this.phoneInput.fill(phoneValue || '3331234567');
                }
                if (await this.addressInput.isVisible()) {
                        await this.addressInput.fill(addressValue || 'Via Test 1');
                }
                if (await this.cityInput.isVisible()) {
                        await this.cityInput.fill(cityValue || 'Milano');
                }
                if (await this.postalInput.isVisible()) {
                        await this.postalInput.fill(postalValue || '20100');
                }
                if (await this.countrySelect.isVisible()) {
                        await this.countrySelect.selectOption({ value: countryValue || 'ITA' });
                }

                const findFirstNonEmptyOption = async (selectLocator: Locator): Promise<string | null> => {
                        const options = selectLocator.locator('option');
                        const count = await options.count();
                        for (let i = 0; i < count; i++) {
                                const val = await options.nth(i).getAttribute('value');
                                if (val && val.trim() !== '') return val;
                        }
                        return null;
                };

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

                // Radio marketing: seleziona NO se nessuno è già selezionato
                const marketingYes = this.formContainer.locator('#cnfmrk-y-7');
                const marketingNo = this.formContainer.locator('#cnfmrk-n-7');
                if (await marketingYes.isVisible()) {
                        const alreadySelected = (await marketingYes.isChecked()) || (await marketingNo.isChecked());
                        if (!alreadySelected) {
                                await marketingNo.check();
                        }
                }

                // Dati carta di credito: solo se il pannello è visibile
                if (await this.ccContainer.isVisible()) {
                        await this.ccName.fill(nameValue || 'Test E2e Emanuele');
                        await this.ccNumber.fill('4539970000000006');
                        await this.ccMonth.selectOption({ value: '12' });
                        await this.ccYear.selectOption({ value: '2030' });
                }
        }

        async setNextAction(actionType: BookingEngineAzione | BookingEngineFromPlanning) {
                if (await this.select1.isVisible()) {
                        await this.select1.selectOption({ value: actionType });
                } else if (await this.select2.isVisible()) {
                        await this.select2.selectOption({ value: actionType });
                }
        }

        async checkPrice(itemPrice?: string) {
                if (itemPrice != null) {
                        await expect(itemPrice).toBe(await this.price.first().innerText());
                }
        }

        async checkMandatoryErrors() {
                await this.page.keyboard.press('Escape');
                const labels = this.formContainer.locator('label[for]');
                const count = await labels.count();
                for (let i = 0; i < count; i++) {
                        const label = labels.nth(i);
                        if (!(await label.isVisible())) continue;
                        const text = await label.textContent();
                        if (!text?.includes('*')) continue;
                        const forAttr = await label.getAttribute('for');
                        if (!forAttr) continue;
                        const errorEl = this.page.locator(`#${forAttr}-error`);
                        if (await errorEl.count() === 0) continue;
                        await expect(errorEl).toBeVisible();
                        await expect(errorEl).toHaveText(this.errorMessage);
                }
        }

}
