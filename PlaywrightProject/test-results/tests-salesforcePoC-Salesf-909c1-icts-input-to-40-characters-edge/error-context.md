# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\salesforcePoC.spec.ts >> Salesforce Lead Management PoC >> Scenario 1: Validate Mobile field restricts input to 40 characters
- Location: tests\salesforcePoC.spec.ts:39:7

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('#password')

```

# Page snapshot

```yaml
- generic [ref=e1]:
    - generic [ref=e2]:
        - generic [ref=e5]:
            - generic [ref=e7]:
                - img [ref=e8]
                - generic [ref=e9]: Salesforce login
            - generic [ref=e11]:
                - generic [ref=e12]:
                    - heading "Salesforce login" [level=1] [ref=e13]
                    - generic [ref=e14]:
                        - text: Username
                        - textbox "Username" [active] [ref=e16]: k.b.pavithra@capgemini.com
                    - button "Log In" [ref=e17] [cursor=pointer]
                    - generic [ref=e18]:
                        - checkbox "Remember me" [ref=e19]
                        - generic [ref=e20]: Remember me
                - generic [ref=e21]:
                    - link "Forgot Your Password?" [ref=e22] [cursor=pointer]:
                        - /url: /secur/forgotpassword.jsp?locale=us
                    - link "Use Custom Domain" [ref=e23] [cursor=pointer]:
                        - /url: javascript:void(0);
                - generic [ref=e24]: or
                - link "Log In with Email" [ref=e25] [cursor=pointer]:
                    - /url: https://welcome.salesforce.com?ref=lsc
            - generic [ref=e26]:
                - paragraph [ref=e27]: Not a customer?
                - link "Try for Free" [ref=e28] [cursor=pointer]:
                    - /url: https://www.salesforce.com/form/trial/freetrial.jsp?d=70130000000Enus
        - generic [ref=e29]:
            - text: © 2026 Salesforce, Inc. All rights reserved. |
            - link "Privacy" [ref=e30] [cursor=pointer]:
                - /url: https://www.salesforce.com/us/company/privacy
    - iframe [ref=e32]:
        - main [ref=f1e3]:
            - article [ref=f1e7]:
                - generic [ref=f1e9]:
                    - generic [ref=f1e10]:
                        - heading "Get Salesforce for free." [level=2] [ref=f1e11]
                        - generic [ref=f1e12]:
                            - paragraph:
                                - strong
                            - heading "No credit card required, no software to install." [level=3] [ref=f1e13]:
                                - strong [ref=f1e14]: No credit card required, no software to install.
                            - strong
                            - text: "Your free 30-day trial gives you:"
                            - list [ref=f1e15]:
                                - listitem [ref=f1e16]: Quick and easy set-up with guided onboarding
                                - listitem [ref=f1e17]: Sales, service, email marketing, and commerce in one place
                                - listitem [ref=f1e18]: AI assistance for email drafts and updating records
                                - listitem [ref=f1e19]: A free Slack workspace for partner collaboration
                    - 'link "Start for free: Get Salesforce for free." [ref=f1e22] [cursor=pointer]':
                        - /url: https://www.salesforce.com/small-business/free-trial/starter-suite-v2/?d=7010M000002Mw7OQAS&pr=https%3A%2F%2Fc.salesforce.com%2Flogin-messages%2Fpromos.html
                        - text: Start for free
                        - img [ref=f1e23]
    - generic: Login
    - iframe [ref=e33]:
```

# Test source

```ts
  1   | import 'dotenv/config';
  2   | import { test, expect } from '@playwright/test';
  3   |
  4   | declare const process: { env: { SF_USERNAME?: string; SF_PASSWORD?: string } };
  5   |
  6   | const SF_LOGIN_URL = 'https://login.salesforce.com';
  7   | const SF_USERNAME = process.env.SF_USERNAME ;
  8   | const SF_PASSWORD = process.env.SF_PASSWORD ;
  9   |
  10  | // Ensure required env vars are present to satisfy Playwright's typed APIs
  11  | if (!SF_USERNAME || !SF_PASSWORD) {
  12  |   throw new Error('Environment variables SF_USERNAME and SF_PASSWORD must be set');
  13  | }
  14  |
  15  | test.describe('Salesforce Lead Management PoC', () => {
  16  |
  17  |   // Run before each test: Log in and navigate to the Lead creation page
  18  |   test.beforeEach(async ({ page }) => {
  19  |     test.setTimeout(60000); // Salesforce can be slow to load
  20  |
  21  |     // Log in
  22  |     await page.goto(SF_LOGIN_URL);
  23  |     await page.locator('#username').fill(SF_USERNAME!);
> 24  |     await page.locator('#password').fill(SF_PASSWORD!);
      |                                     ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  25  |     await page.locator('#Login').click();
  26  |
  27  |     // Wait for home page, then jump directly to the Lead creation modal to save time
  28  |     await page.waitForURL(/.*lightning.*/, { timeout: 30000 });
  29  |     const orgBaseUrl = page.url().split('/lightning/')[0];
  30  |     await page.goto(`${orgBaseUrl}/lightning/o/Lead/new`);
  31  |
  32  |     // Wait for the modal form to load
  33  |     await expect(page.getByRole('heading', { name: 'New Lead' })).toBeVisible({ timeout: 15000 });
  34  |   });
  35  |
  36  |   // ==========================================
  37  |   // SCENARIO 1: Field Length & Truncation
  38  |   // ==========================================
  39  |   test('Scenario 1: Validate Mobile field restricts input to 40 characters', async ({ page }) => {
  40  |     const mobileField = page.getByLabel('Mobile');
  41  |     const overLimitInput = '1'.repeat(45); // 45 characters
  42  |     const expectedTruncatedValue = '1'.repeat(40); // Salesforce limit is 40
  43  |
  44  |     await mobileField.fill(overLimitInput);
  45  |     const actualValue = await mobileField.inputValue();
  46  |
  47  |     console.log(`[Scenario 1] Input: ${overLimitInput.length} chars | Actual: ${actualValue.length} chars`);
  48  |     expect(actualValue.length).toBe(40);
  49  |     expect(actualValue).toBe(expectedTruncatedValue);
  50  |   });
  51  |
  52  |   // ==========================================
  53  |   // SCENARIO 2: Mandatory Field Validation (Negative Test)
  54  |   // ==========================================
  55  |   test('Scenario 2: Should show error messages when mandatory fields are empty', async ({ page }) => {
  56  |     // Leave fields blank and click Save
  57  |     await page.getByRole('button', { name: 'Save', exact: true }).click();
  58  |
  59  |     // Verify the page-level error message appears
  60  |     const pageError = page.locator('.pageLevelErrors');
  61  |     await expect(pageError).toBeVisible();
  62  |     await expect(pageError).toContainText('Review the following fields');
  63  |
  64  |     // Verify field-specific error messages
  65  |     await expect(page.locator('text=These fields are required: Last Name, Company')).toBeVisible();
  66  |   });
  67  |   ''
  68  |   // ==========================================
  69  |   // SCENARIO 3: Successful Lead Creation (Happy Path)
  70  |   // ==========================================
  71  |   test('Scenario 3: Create a new Lead successfully', async ({ page }) => {
  72  |     const uniqueLastName = `QA_Test_LastName_${Date.now()}`;
  73  |
  74  |     // Fill required fields
  75  |     await page.getByPlaceholder('First Name').fill('Riley');
  76  |     await page.getByPlaceholder('Last Name').fill(uniqueLastName);
  77  |     await page.getByLabel('*Company').fill('Capgemini Engineering');
  78  |
  79  |     // Click Save
  80  |     await page.getByRole('button', { name: 'Save', exact: true }).click();
  81  |
  82  |     // Verify success toast message and redirection to the Lead Detail page
  83  |     await page.waitForURL(/.*lightning\/r\/Lead.*/);
  84  |     await expect(page.locator('.toastMessage')).toBeVisible();
  85  |     await expect(page.locator('.toastMessage')).toContainText(uniqueLastName);
  86  |
  87  |     // Verify the Lead Name is displayed in the header
  88  |     await expect(page.locator('slot[name="primaryField"]')).toContainText(`Riley ${uniqueLastName}`);
  89  |   });
  90  |
  91  |   // ===================================================================================
  92  |   // SCENARIO 4: Lead Status Transition (State Transition)
  93  |   // ==========================================
  94  |   test('Scenario 4: Transition Lead Status using the Path component', async ({ page }) => {
  95  |     // 1. Close the creation modal (we will use an existing lead or the one we just navigated to)
  96  |     await page.getByRole('button', { name: 'Cancel' }).click();
  97  |
  98  |     // 2. Navigate to the Leads list view and open the first available Lead
  99  |     const orgBaseUrl = page.url().split('/lightning/')[0];
  100 |     await page.goto(`${orgBaseUrl}/lightning/o/Lead/list?filterName=Recent`);
  101 |
  102 |     // Click the first lead in the list
  103 |     const firstLeadLink = page.locator('tbody tr th a').first();
  104 |     await expect(firstLeadLink).toBeVisible({ timeout: 15000 });
  105 |     await firstLeadLink.click();
  106 |
  107 |     // 3. Click "Working - Contacted" on the Path chevron
  108 |     const workingStage = page.getByRole('button', { name: 'Working - Contacted' });
  109 |     await workingStage.click();
  110 |
  111 |     // 4. Click "Mark as Current Status"
  112 |     const markCurrentBtn = page.getByRole('button', { name: 'Mark as Current Status' });
  113 |     await expect(markCurrentBtn).toBeVisible();
  114 |     await markCurrentBtn.click();
  115 |
  116 |     // 5. Verify the success toast or that the stage is now marked as current
  117 |     await expect(page.locator('.toastMessage')).toBeVisible();
  118 |     await expect(page.locator('.toastMessage')).toContainText('Status changed successfully');
  119 |   });
  120 |
  121 | });
```
