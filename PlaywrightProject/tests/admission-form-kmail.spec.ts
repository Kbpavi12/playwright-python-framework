import { test, expect } from '@playwright/test';

test('Admission form submits successfully with kmail.com email', async ({ page }) => {
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await expect(page.locator('h1')).toHaveText('Admission Form');

  await page.locator('#fullName').fill('Ravi Kumar');
  await page.locator('#email').fill('ravi.kumar@kmail.com');
  await page.locator('#phone').fill('9876543210');
  await page.locator('#dob').fill('2000-01-01');
  await page.locator('#program').selectOption('B.Tech');
  await page.locator('#country').fill('India');

  await expect(page.getByRole('button', { name: 'Submit Application' })).toBeVisible();
  await page.getByRole('button', { name: 'Submit Application' }).click();

  await expect(page.locator('#successMessage')).toContainText('Thank you, Ravi Kumar');
  await expect(page.locator('#successMessage')).toContainText('submitted successfully');

  await page.waitForTimeout(2000);
});
