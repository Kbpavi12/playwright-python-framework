import 'dotenv/config';
import { test, expect } from '@playwright/test';

const SF_LOGIN_URL = process.env.SF_LOGIN_URL ?? 'https://login.salesforce.com';
const SF_USERNAME = process.env.SF_USERNAME;
const SF_PASSWORD = process.env.SF_PASSWORD;

test.describe('Salesforce production login', () => {
  test('Login to the production org using credentials from .env', async ({ page }) => {
    test.setTimeout(5 * 60 * 1000);

    test.skip(
      !SF_USERNAME || !SF_PASSWORD,
      'Set SF_USERNAME and SF_PASSWORD in the .env file inside PlaywrightProject before running this test.'
    );

    await page.goto(SF_LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const usernameField = page.locator('#username');
    await expect(usernameField).toBeVisible({ timeout: 20000 });
    await usernameField.fill(SF_USERNAME!);

    const loginButton = page.locator('#Login, button:has-text("Log In")');
    await loginButton.first().click();

    const passwordField = page.locator('#password');
    await expect(passwordField).toBeVisible({ timeout: 20000 });
    await passwordField.fill(SF_PASSWORD!);

    await page.locator('#Login').click();

    await expect(page).toHaveURL(/\/lightning|\/setup|\/home/i, { timeout: 5 * 60 * 1000 });
    await expect(page.locator('body')).toContainText(/Welcome|Home|App Launcher|Lightning Experience/i, { timeout: 20000 });
  });
});
