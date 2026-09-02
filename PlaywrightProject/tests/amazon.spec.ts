import { test, expect, chromium } from '@playwright/test';

test('Launch Chrome and open Amazon', async () => {
  let browser;

  try {
    browser = await chromium.launch({
      channel: 'chrome',
      headless: false,
    });
  } catch {
    browser = await chromium.launch({
      headless: false,
    });
  }

  const page = await browser.newPage();

  await page.goto('https://www.amazon.com', { waitUntil: 'domcontentloaded', timeout: 60000 });

  await expect(page.locator('body')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('body')).toContainText(/Amazon|Sorry, you are not permitted to visit this site/i);

  await page.screenshot({ path: 'amazon-home.png', fullPage: true });
  await browser.close();
});
