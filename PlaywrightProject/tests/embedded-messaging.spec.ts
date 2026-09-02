import { test, expect } from '@playwright/test';

test('Embedded Messaging chat flow', async ({ page }) => {
  const result: {
    agentResponse?: string;
    screenshot?: string;
    errors?: string[];
  } = {
    errors: []
  };

  try {
    await page.goto('https://orgfarm-2ac35d2ecc-dev-ed.develop.my.site.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 120000
    });
    await page.waitForLoadState('domcontentloaded');

    const iframeSelector = 'iframe#embeddedMessagingFrame';
    const chatFrame = page.frameLocator(iframeSelector);

    await page.waitForSelector(iframeSelector, { state: 'attached', timeout: 120000 });
    await expect(page.locator(iframeSelector)).toBeVisible({ timeout: 120000 });

    const launcher = chatFrame.locator('button:has-text("Start with text")').first();
    await expect(launcher).toBeVisible({ timeout: 120000 }).catch(() => {
      throw new Error('Embedded chat launcher was not visible inside the messaging iframe');
    });
    await launcher.click();

    const inputLocator = chatFrame.locator('textarea, input, [contenteditable="true"]').first();
    await expect(inputLocator).toBeVisible({ timeout: 120000 }).catch(() => {
      throw new Error('Chat input was not visible after clicking launcher');
    });

    await inputLocator.fill('please order previous products');
    await inputLocator.press('Enter');

    const response = chatFrame.locator('text=please order previous products').first();
    await expect(response).toBeVisible({ timeout: 60000 }).catch(() => undefined);

    const agentText = chatFrame.locator('div, p, span, li').filter({ hasText: /previous products|order|agent|hello|sorry|I can|I can help|here/i }).last();
    await expect(agentText).toBeVisible({ timeout: 180000 }).catch(() => {
      throw new Error('Agent response was not visible within the expected wait time');
    });

    result.agentResponse = (await agentText.textContent())?.trim() || 'No text captured';
    await page.screenshot({ path: 'embedded-messaging-result.png', fullPage: true });
    result.screenshot = 'embedded-messaging-result.png';
  } catch (error: any) {
    result.errors?.push(error?.message || String(error));
    await page.screenshot({ path: 'embedded-messaging-error.png', fullPage: true }).catch(() => undefined);
    result.screenshot = 'embedded-messaging-error.png';
    throw error;
  }

  console.log(JSON.stringify(result, null, 2));
});
