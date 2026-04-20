import { Page, Locator, expect } from "@playwright/test";
export default class BERoomModal {

   roomModal: Locator
   openModalButton: Locator
   closeModalButton: Locator

   constructor(public containerId: string, public page) {
      this.containerId = containerId;
      this.page = page;
      this.roomModal = this.page.locator(`#${this.containerId} .modal.modal-product-detail`)
      this.openModalButton = this.page.locator(`#${this.containerId} a[data-toggle="modal"][data-target^="#detail-product-"]`);
      this.closeModalButton = this.roomModal.locator('button.close')
   }

   async check() {
      await expect(this.roomModal).toBeHidden()
   }

   async checkAfterClick() {
      expect(this.roomModal).toBeVisible()
      expect(this.roomModal).toBeEnabled()

   }

   async openModal() {
      await this.openModalButton.click()
   }

   async closeModal() {
      await this.closeModalButton.click()
   }
}