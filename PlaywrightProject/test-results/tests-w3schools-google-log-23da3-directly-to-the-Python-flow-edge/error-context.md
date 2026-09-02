# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\w3schools-google-login-python.spec.ts >> W3Schools Python flow without Google sign-in >> Open W3Schools and continue directly to the Python flow
- Location: tests\w3schools-google-login-python.spec.ts:73:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#textareaCode').first()
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('#textareaCode').first()

```

```yaml
- heading "The file you asked for does not exist" [level=3]:
  - img
  - text: The file you asked for does not exist
- img
```

# Test source

```ts
  1   | import fs from 'fs';
  2   | import path from 'path';
  3   | import { test, expect, chromium } from '@playwright/test';
  4   | import dotenv from 'dotenv';
  5   | 
  6   | dotenv.config({ path: path.join(__dirname, '..', '.env') });
  7   | 
  8   | const REPORT_DIR = path.join(__dirname, '..', 'test-results', 'w3schools-google-login-python');
  9   | const REPORT_FILE = path.join(REPORT_DIR, 'step-report.md');
  10  | const EDGE_PROFILE_DIR = 'C:\\Users\\kpavithr\\AppData\\Local\\Microsoft\\Edge\\User Data\\PlaywrightW3SchoolsFresh';
  11  | 
  12  | const W3S_EMAIL = process.env.W3S_EMAIL || '';
  13  | const W3S_PASSWORD = process.env.W3S_PASSWORD || '';
  14  | 
  15  | let browser: any;
  16  | let page: any;
  17  | 
  18  | function ensureReportFile() {
  19  |   fs.mkdirSync(REPORT_DIR, { recursive: true });
  20  |   if (!fs.existsSync(REPORT_FILE)) {
  21  |     fs.writeFileSync(REPORT_FILE, '# W3Schools Google Login and Python Automation Report\n\n');
  22  |   }
  23  | }
  24  | 
  25  | function appendReport(stepName: string, status: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED', details: string) {
  26  |   const timestamp = new Date().toISOString();
  27  |   const content = `## ${stepName} | ${status} | ${timestamp}\n${details}\n\n`;
  28  |   fs.appendFileSync(REPORT_FILE, content, 'utf8');
  29  | }
  30  | 
  31  | async function captureStep(page: any, stepName: string, status: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED', details: string) {
  32  |   ensureReportFile();
  33  |   const screenshotPath = path.join(REPORT_DIR, `${stepName}.png`);
  34  |   try {
  35  |     await page.screenshot({ path: screenshotPath, fullPage: false });
  36  |     appendReport(stepName, status, `${details}\n![${stepName}](${path.basename(screenshotPath)})`);
  37  |   } catch {
  38  |     appendReport(stepName, status, `${details}\nNo screenshot captured because the page/browser was closed.`);
  39  |   }
  40  | }
  41  | 
  42  | async function launchFreshEdgeBrowser() {
  43  |   if (!browser) {
  44  |     browser = await chromium.launchPersistentContext(EDGE_PROFILE_DIR, {
  45  |       channel: 'msedge',
  46  |       headless: false,
  47  |       args: ['--profile-directory=Default'],
  48  |     });
  49  |     page = await browser.newPage();
  50  |   }
  51  |   return page;
  52  | }
  53  | 
  54  | async function openW3SchoolsFlow() {
  55  |   const activePage = await launchFreshEdgeBrowser();
  56  |   await activePage.goto('https://www.w3schools.com/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  57  |   await expect(activePage).toHaveURL(/w3schools\.com/i, { timeout: 30000 });
  58  |   await captureStep(activePage, '01_open_homepage', 'PASS', 'Opened W3Schools in a fresh Edge browser session.');
  59  |   return activePage;
  60  | }
  61  | 
  62  | test.describe('W3Schools Python flow without Google sign-in', () => {
  63  |   test.beforeAll(async () => {
  64  |     await launchFreshEdgeBrowser();
  65  |   });
  66  | 
  67  |   test.afterAll(async () => {
  68  |     if (browser) {
  69  |       await browser.close();
  70  |     }
  71  |   });
  72  | 
  73  |   test('Open W3Schools and continue directly to the Python flow', async () => {
  74  |     test.slow();
  75  | 
  76  |     const activePage = await openW3SchoolsFlow();
  77  | 
  78  |     await test.step('Step 1: Open Python tutorial', async () => {
  79  |       await activePage.goto('https://www.w3schools.com/python/default.asp', { waitUntil: 'domcontentloaded', timeout: 120000 });
  80  |       await expect(activePage).toHaveURL(/w3schools\.com\/python/i, { timeout: 30000 });
  81  |       await captureStep(activePage, '02_python_page', 'PASS', 'Opened the Python tutorial page without Google login.');
  82  |     });
  83  | 
  84  |     await test.step('Step 2: Launch Try it Yourself and run code', async () => {
  85  |       const tryItUrl = 'https://www.w3schools.com/python/trypython.asp?filename=demo_hello';
  86  | 
  87  |       await activePage.goto(tryItUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
  88  |       await expect(activePage).toHaveURL(/trypython\.asp|tryit\.asp/i, { timeout: 30000 });
  89  |       await captureStep(activePage, '03_tryit_opened', 'PASS', 'Opened the Try it Yourself editor through the direct Python editor URL.');
  90  | 
  91  |       const editor = activePage.locator('#textareaCode').first();
> 92  |       await expect(editor).toBeVisible({ timeout: 30000 });
      |                            ^ Error: expect(locator).toBeVisible() failed
  93  |       await editor.fill('');
  94  |       const code = 'print("Hello, Playwright Automation")';
  95  |       await editor.fill(code);
  96  |       await captureStep(activePage, '04_code_entered', 'PASS', `Entered: ${code}`);
  97  | 
  98  |       const runButton = activePage.locator('#runbtn').first();
  99  |       await expect(runButton).toBeVisible({ timeout: 20000 });
  100 |       await runButton.click();
  101 |       await activePage.waitForTimeout(4000);
  102 | 
  103 |       const resultFrame = activePage.frameLocator('#iframeResult');
  104 |       await expect(resultFrame.locator('body')).toContainText('Hello, Playwright Automation', { timeout: 30000 });
  105 |       await captureStep(activePage, '05_code_executed', 'PASS', 'The Python code executed successfully and produced the expected output.');
  106 |     });
  107 | 
  108 |     await test.step('Step 3: Final report generation', async () => {
  109 |       appendReport('06_final_summary', 'PASS', 'The automation continued past the blocked Google sign-in step and completed the Python tutorial, editor, and run flow.');
  110 |       await captureStep(activePage, '06_final_summary', 'PASS', 'Generated the final report for the non-authenticated flow.');
  111 |       await expect(activePage).toBeVisible();
  112 |     });
  113 |   });
  114 | });
  115 | 
```