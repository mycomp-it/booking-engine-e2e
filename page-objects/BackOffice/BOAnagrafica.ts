import { expect, Locator, Page } from '@playwright/test';
import { formatToIsoDate, generateRandomBirthDate, waitForLoadState } from "../../Utils/PageMethods";

export type AnagraficaDatiTrattativa = {
    name: string;
    surname: string;
    date: Date;
};

export type AnagraficaParams = {
    name?: string;
    surname?: string;
    dataNascita?: Date;
    genere?: string;
    nazioneNascita?: string;
    comuneNascita?: string;
    cittadinanza?: string;
    statoResidenza?: string;
    comuneResidenza?: string;
    provinciaResidenza?: string;
};

export class BOAnagrafica {
    private readonly container: Locator;
    private readonly page: Page;
    private readonly saveButton: Locator;
    private readonly nomeInput: Locator;
    private readonly cognomeInput: Locator;
    private readonly dataNascitaInput: Locator;
    private readonly genereSelect: Locator;
    private readonly nazioneNascitaInput: Locator;
    private readonly comuneNascitaInput: Locator;
    private readonly cittadinanzaInput: Locator;
    private readonly statoResidenzaInput: Locator;
    private readonly comuneResidenzaInput: Locator;
    private readonly provinciaResidenzaInput: Locator;
    private readonly checkinButton: Locator;
    private readonly checkinStatusIndicator: Locator;

    constructor(page: Page, container: Locator) {
        this.page = page;
        this.container = container;


        this.nomeInput = container.locator('input[ng-model="contact.nome"]').first();
        this.cognomeInput = container.locator('input[ng-model="contact.cognome"]').first();
        this.dataNascitaInput = container.locator('input[ng-model="contact.dataNascita"]').first();
        this.genereSelect = container.locator('select[ng-model="contact.sesso"]').first();

        this.nazioneNascitaInput = container.locator('input[ng-model="contact.statoNascita"]').first();
        this.comuneNascitaInput = container.locator('input#comunenascita').first();
        this.cittadinanzaInput = container.locator('input[ng-model="contact.cittadinanza"]').first();
        this.statoResidenzaInput = container.locator('input[ng-model="contact.statoResidenza"]').first();
        this.comuneResidenzaInput = container.locator('input#comuneresidenza').first();
        this.provinciaResidenzaInput = container.locator('input[ng-model="contact.siglaProvinciaResidenza"]').first();
        this.saveButton = this.container.locator('button#salva-button');

        this.checkinButton = this.container.locator('button.pms-checkin-button', { hasText: 'Checkin' }).first();
        this.checkinStatusIndicator = this.page.locator('.BtnCheckinAnagraficaAttivo');
    }



    private async checkAndFillInput(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        const currentValue = await locator.inputValue();

        const isEditable = await locator.isEditable();

        if (!currentValue || currentValue.trim() === '' || currentValue.startsWith('?')) {
            //console.log(`Field is currently empty or placeholder.`);

            if (isEditable) {
                //console.log(`Filling editable field: ${value}`);
                await locator.fill(value);

            } else {

                if (await locator.inputValue() !== value) {

                    return;
                }
            }
        } else {

        }
    }

    private async checkAndFillAutocomplete(locator: Locator, value: string): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout: 5000 });
        const currentValue = await locator.inputValue();

        if (!currentValue || currentValue.trim() === '') {
            //console.log(`Filling autocomplete field: ${value} (using keyboard method)`);

            await locator.fill(value);
            await this.page.waitForLoadState('networkidle');
            await locator.press('ArrowDown');
            await locator.press('Enter');
            await waitForLoadState(this.page);
        }
    }


    async areFieldsVisible(): Promise<void> {
        const isVisible = await this.container.isVisible();
        if (!isVisible) {
            await this.container.locator('..').locator('.pms-anagrafiche-nav').click();
            await this.container.waitFor({ state: 'visible' });
        }
    }

    async completeAnagrafiche(trattativaData: AnagraficaDatiTrattativa, params: AnagraficaParams = {}): Promise<void> {

        await this.areFieldsVisible();

        const nome = params.name || trattativaData.name || 'TestE2E';
        await this.checkAndFillInput(this.nomeInput, nome);

        const cognome = params.surname || trattativaData.surname || 'Emanuele_DEFAULT';
        await this.checkAndFillInput(this.cognomeInput, cognome);

        const defaultDate = params.dataNascita || generateRandomBirthDate();
        const isoDate = formatToIsoDate(defaultDate);
        await this.checkAndFillInput(this.dataNascitaInput, isoDate);

        const genere = params.genere || 'Maschio';
        const currentGenere = await this.genereSelect.inputValue();
        if (!currentGenere || currentGenere.startsWith('?')) {
            await this.genereSelect.selectOption(genere);
        }

        const nazioneNascita = params.nazioneNascita || 'ITALIA';
        await this.checkAndFillAutocomplete(this.nazioneNascitaInput, nazioneNascita);

        const comuneNascita = params.comuneNascita || 'CAGLIARI';
        await this.checkAndFillAutocomplete(this.comuneNascitaInput, comuneNascita);

        const cittadinanza = params.cittadinanza || 'ITALIANA';
        await this.checkAndFillAutocomplete(this.cittadinanzaInput, cittadinanza);

        const statoResidenza = params.statoResidenza || 'ITALIA';
        await this.checkAndFillAutocomplete(this.statoResidenzaInput, statoResidenza);

        const comuneResidenza = params.comuneResidenza || 'CAGLIARI';
        await this.checkAndFillAutocomplete(this.comuneResidenzaInput, comuneResidenza);

        const provinciaResidenza = params.provinciaResidenza || 'CA';
        await this.checkAndFillInput(this.provinciaResidenzaInput, provinciaResidenza);
    }

    async saveAnagrafica(): Promise<void> {

        await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });

        await this.saveButton.click();

        await expect(this.saveButton).toBeEnabled({ timeout: 30000 });
        await waitForLoadState(this.page);
    }



    async executeCheckin(): Promise<boolean> {
        const confirmCheckinModal = this.page.locator('.modal-content', {
            has: this.page.locator('.modal-header h3', { hasText: 'Conferma checkin' })
        })
        const checkinButtonVisible = await this.checkinButton.isVisible();

        if (checkinButtonVisible) {
            //console.log("Check-in button visibile. Eseguo il check-in per l'anagrafica.");

            await this.checkinButton.click();
            await waitForLoadState(this.page);

            const isModalVisible = await confirmCheckinModal.isVisible();

            if (isModalVisible) {
                //console.log("Modale di conferma check-in visibile. Clicco Conferma.");

                const confirmCheckinButton = confirmCheckinModal.locator('#pms-confirm-button', { hasText: 'conferma' });

                await confirmCheckinButton.waitFor({ state: 'visible', timeout: 5000 });
                await confirmCheckinButton.click();

                await confirmCheckinModal.waitFor({ state: 'hidden' });
                await waitForLoadState(this.page);

            } else {
                //console.log("Nessun modale di conferma check-in rilevato. Procedo.");
            }
            return true;
        } else {
            //console.log("Check-in button non visibile. Saltato.");
            return false;
        }
    }

    async isCheckinStatusVisible(): Promise<boolean> {
        await waitForLoadState(this.page);


        try {
        
            await this.checkinStatusIndicator.waitFor({ state: 'visible', timeout: 4000 });

            //console.log("Checkin status indicator trovato entro il timeout.");
            return true;
        } catch (error) {
            
            const errorMessage = String(error);

            if (errorMessage.includes('Timeout') || errorMessage.includes('locator.waitFor: Timeout')) {
                //console.log(`Checkin status indicator NON trovato entro ${4000}ms. Risultato atteso: False.`);
                return false;
            }

            throw error;
        }
    }

}
