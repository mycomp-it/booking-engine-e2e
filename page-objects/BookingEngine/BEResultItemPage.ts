import Page, { expect, Locator } from '@playwright/test'
import BEConfirmPage from './BEConfirmPage';
import BERoomModal from './BERoomModal';
import { waitForLoadState } from '../../Utils/PageMethods';

export default class BEResultItemPage {
  pricesGroup: Locator
  CTAGroup: Locator
  shoppingCartCTAGroup: Locator
  continueButtonCTA: Locator

  roomImage: Locator
  roomModal: BERoomModal

  constructor(public containerId: string, public page) {

    this.containerId = containerId;
    this.page = page;
    this.pricesGroup = this.page.locator(`#${this.containerId} strong.price`)
    this.CTAGroup = this.page.locator(`#${this.containerId} button[type='submit']`)
    this.roomModal = new BERoomModal(this.containerId, this.page)
    this.roomImage = this.page.locator(`#${this.containerId} .se_cond-slide`)
    this.shoppingCartCTAGroup = this.page.locator(`#${this.containerId} .cart.fa-shopping-cart `)
    this.continueButtonCTA = this.page.locator(`#continua-btn `)
  }

  async getFirstPrice() {
    return await this.pricesGroup.first().innerText()
  }
  async check() {
    await waitForLoadState(this.page);
    await this.checkCTAButtons()
    await this.checkRoomImage()
    await this.roomModal.check()
  }
  async clickFirstCTAButton() {
    if (await this.shoppingCartCTAGroup.nth(2).isVisible()) {
      await this.shoppingCartCTAGroup.highlight();
      await this.shoppingCartCTAGroup.nth(2).click();
      await this.continueButtonCTA.click()
      return new BEConfirmPage(this.page)

    } else {
      await this.CTAGroup.highlight();
      await this.CTAGroup.first().click();
      return new BEConfirmPage(this.page)
    }
  }
  async checkCTAButtons() {
    await waitForLoadState(this.page);
    //await this.shoppingCartCTAGroup.first().waitFor({state:'visible'});
    // console.log(await this.shoppingCartCTAGroup.nth(1).isVisible())
    if (await this.shoppingCartCTAGroup.nth(1).isVisible()) {
      await expect(await this.shoppingCartCTAGroup.count()).toBeGreaterThan(0)
      for (let i = 0; i < await this.shoppingCartCTAGroup.count(); i++) {
        await expect(this.shoppingCartCTAGroup.nth(i)).toBeVisible();
        await expect(this.shoppingCartCTAGroup.nth(i)).toBeEnabled();
      }
    } else {


      await expect(await this.CTAGroup.count()).toBeGreaterThan(0)
      for (let i = 0; i < await this.CTAGroup.count(); i++) {
        await expect(this.CTAGroup.nth(i)).toBeVisible();
        await expect(this.CTAGroup.nth(i)).toBeEnabled();
      }
    }
  }
  async checkRoomImage() {
    await expect(await this.roomImage).toBeVisible()
  }
  async openModal() {
    await this.roomModal.openModal()
  }
  async checkModal() {
    await this.roomModal.checkAfterClick()
  }
  async closeModal() {

    await this.roomModal.closeModal()
  }

}



