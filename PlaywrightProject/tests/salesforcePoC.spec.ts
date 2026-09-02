import 'dotenv/config';
import { test, expect } from '@playwright/test';

declare const process: { env: { SF_USERNAME?: string; SF_PASSWORD?: string } };

const SF_LOGIN_URL = 'https://login.salesforce.com';
const SF_USERNAME = process.env.SF_USERNAME ;
const SF_PASSWORD = process.env.SF_PASSWORD ;

// Ensure required env vars are present to satisfy Playwright's typed APIs
if (!SF_USERNAME || !SF_PASSWORD) {
  throw new Error('Environment variables SF_USERNAME and SF_PASSWORD must be set');
}

test.describe('Salesforce Lead Management PoC', () => {

  // Run before each test: Log in and navigate to the Lead creation page
  test.beforeEach(async ({ page }) => {
    test.setTimeout(60000); // Salesforce can be slow to load
    
    // Log in
    await page.goto(SF_LOGIN_URL);
    await page.locator('#username').fill(SF_USERNAME!);
    await page.locator('#password').fill(SF_PASSWORD!);
    await page.locator('#Login').click();
    
    // Wait for home page, then jump directly to the Lead creation modal to save time
    await page.waitForURL(/.*lightning.*/, { timeout: 30000 });
    const orgBaseUrl = page.url().split('/lightning/')[0];
    await page.goto(`${orgBaseUrl}/lightning/o/Lead/new`);
    
    // Wait for the modal form to load
    await expect(page.getByRole('heading', { name: 'New Lead' })).toBeVisible({ timeout: 15000 });
  });

  // ==========================================
  // SCENARIO 1: Field Length & Truncation
  // ==========================================
  test('Scenario 1: Validate Mobile field restricts input to 40 characters', async ({ page }) => {
    const mobileField = page.getByLabel('Mobile');
    const overLimitInput = '1'.repeat(45); // 45 characters
    const expectedTruncatedValue = '1'.repeat(40); // Salesforce limit is 40

    await mobileField.fill(overLimitInput);
    const actualValue = await mobileField.inputValue();

    console.log(`[Scenario 1] Input: ${overLimitInput.length} chars | Actual: ${actualValue.length} chars`);
    expect(actualValue.length).toBe(40);
    expect(actualValue).toBe(expectedTruncatedValue);
  });

  // ==========================================
  // SCENARIO 2: Mandatory Field Validation (Negative Test)
  // ==========================================
  test('Scenario 2: Should show error messages when mandatory fields are empty', async ({ page }) => {
    // Leave fields blank and click Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();
  
    // Verify the page-level error message appears
    const pageError = page.locator('.pageLevelErrors');
    await expect(pageError).toBeVisible();
    await expect(pageError).toContainText('Review the following fields');

    // Verify field-specific error messages
    await expect(page.locator('text=These fields are required: Last Name, Company')).toBeVisible();
  });
  ''
  // ==========================================
  // SCENARIO 3: Successful Lead Creation (Happy Path)
  // ==========================================
  test('Scenario 3: Create a new Lead successfully', async ({ page }) => {
    const uniqueLastName = `QA_Test_LastName_${Date.now()}`;
    
    // Fill required fields
    await page.getByPlaceholder('First Name').fill('Riley');
    await page.getByPlaceholder('Last Name').fill(uniqueLastName);
    await page.getByLabel('*Company').fill('Capgemini Engineering');
    
    // Click Save
    await page.getByRole('button', { name: 'Save', exact: true }).click();

    // Verify success toast message and redirection to the Lead Detail page
    await page.waitForURL(/.*lightning\/r\/Lead.*/);
    await expect(page.locator('.toastMessage')).toBeVisible();
    await expect(page.locator('.toastMessage')).toContainText(uniqueLastName);
    
    // Verify the Lead Name is displayed in the header
    await expect(page.locator('slot[name="primaryField"]')).toContainText(`Riley ${uniqueLastName}`);
  });

  // ===================================================================================
  // SCENARIO 4: Lead Status Transition (State Transition)
  // ==========================================
  test('Scenario 4: Transition Lead Status using the Path component', async ({ page }) => {
    // 1. Close the creation modal (we will use an existing lead or the one we just navigated to)
    await page.getByRole('button', { name: 'Cancel' }).click();
    
    // 2. Navigate to the Leads list view and open the first available Lead
    const orgBaseUrl = page.url().split('/lightning/')[0];
    await page.goto(`${orgBaseUrl}/lightning/o/Lead/list?filterName=Recent`);
    
    // Click the first lead in the list
    const firstLeadLink = page.locator('tbody tr th a').first();
    await expect(firstLeadLink).toBeVisible({ timeout: 15000 });
    await firstLeadLink.click();

    // 3. Click "Working - Contacted" on the Path chevron
    const workingStage = page.getByRole('button', { name: 'Working - Contacted' });
    await workingStage.click();

    // 4. Click "Mark as Current Status"
    const markCurrentBtn = page.getByRole('button', { name: 'Mark as Current Status' });
    await expect(markCurrentBtn).toBeVisible();
    await markCurrentBtn.click();

    // 5. Verify the success toast or that the stage is now marked as current
    await expect(page.locator('.toastMessage')).toBeVisible();
    await expect(page.locator('.toastMessage')).toContainText('Status changed successfully');
  });

});