import { test, expect } from '@playwright/test';

test('example test', async ({ page }) => {
  // Naviga alla base URL dal file .env
  await page.goto('/');
  
  // Aggiungi i tuoi test qui
  // Esempio: await expect(page.locator('h1')).toBeVisible();
});
