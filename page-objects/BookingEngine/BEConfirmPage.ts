import { Page, Locator, expect } from '@playwright/test';
import { BEConfirmPageForm } from './BEConfirmPageForm';
import { BookingEngineAzione, BookingEngineFromPlanning } from '../../Utils/BookingEngineFormEnums';
import BOTrattativaDetailsPage from '../Trattativa/BOTrattativaDetailsPage';
import BOGestionaleReservationDetailsPage from '../BackOffice/BOGestionaleReservationDetailsPage';

export default class BEConfirmPage {
    page: Page;
    form: BEConfirmPageForm;
    price:Locator;

    constructor(page: Page) {
        this.page = page
        this.form = new BEConfirmPageForm(this.page);
        this.price = this.page.locator('.prfinale');
    }

    async submitForm() {
        await this.form.submitForm()
    }
    async nextAction(actionType: BookingEngineAzione | BookingEngineFromPlanning) {
        await this.form.setNextAction(actionType)
    }
    async submitFormTrattativa() {
        await this.form.submitForm()
        return new BOTrattativaDetailsPage(this.page)
    }
    async submitFormGestionale() {
        await this.form.submitForm()
        return new BOGestionaleReservationDetailsPage(this.page)
    }
    async getConfirmPageForm() {
        return this.form
    }
    async getPrice(value?:number) {
             const index = value||0;
             return await this.price.nth(index).innerText();
        }
}

