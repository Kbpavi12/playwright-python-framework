import { test, expect } from '@playwright/test';

test.describe('Capgemini SharePoint Home Site', () => {
  test('Open the Home Site in Edge and confirm the page loads', async ({ page }) => {
    const url = 'https://capgemini.sharepoint.com/sites/homesite';

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });

    await expect(page.locator('body')).toBeVisible({ timeout: 30000 });
    await expect(page).toHaveURL(/capgemini\.sharepoint\.com|login\.microsoftonline\.com/i, { timeout: 30000 });

    console.log(`Opened URL: ${page.url()}`);
  });
});
