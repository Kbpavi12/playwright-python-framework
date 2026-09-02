import fs from 'fs';
import path from 'path';
import { test, expect, chromium } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const REPORT_DIR = path.join(__dirname, '..', 'test-results', 'w3schools-google-login-python');
const REPORT_FILE = path.join(REPORT_DIR, 'step-report.md');
const EDGE_PROFILE_DIR = 'C:\\Users\\kpavithr\\AppData\\Local\\Microsoft\\Edge\\User Data\\PlaywrightW3SchoolsFresh';

const W3S_EMAIL = process.env.W3S_EMAIL || '';
const W3S_PASSWORD = process.env.W3S_PASSWORD || '';

let browser: any;
let page: any;

function ensureReportFile() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  if (!fs.existsSync(REPORT_FILE)) {
    fs.writeFileSync(REPORT_FILE, '# W3Schools Google Login and Python Automation Report\n\n');
  }
}

function appendReport(stepName: string, status: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED', details: string) {
  const timestamp = new Date().toISOString();
  const content = `## ${stepName} | ${status} | ${timestamp}\n${details}\n\n`;
  fs.appendFileSync(REPORT_FILE, content, 'utf8');
}

async function captureStep(page: any, stepName: string, status: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED', details: string) {
  ensureReportFile();
  const screenshotPath = path.join(REPORT_DIR, `${stepName}.png`);
  try {
    await page.screenshot({ path: screenshotPath, fullPage: false });
    appendReport(stepName, status, `${details}\n![${stepName}](${path.basename(screenshotPath)})`);
  } catch {
    appendReport(stepName, status, `${details}\nNo screenshot captured because the page/browser was closed.`);
  }
}

async function launchFreshEdgeBrowser() {
  if (!browser) {
    browser = await chromium.launchPersistentContext(EDGE_PROFILE_DIR, {
      channel: 'msedge',
      headless: false,
      args: ['--profile-directory=Default'],
    });
    page = await browser.newPage();
  }
  return page;
}

async function openW3SchoolsFlow() {
  const activePage = await launchFreshEdgeBrowser();
  await activePage.goto('https://www.w3schools.com/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await expect(activePage).toHaveURL(/w3schools\.com/i, { timeout: 30000 });
  await captureStep(activePage, '01_open_homepage', 'PASS', 'Opened W3Schools in a fresh Edge browser session.');
  return activePage;
}

test.describe('W3Schools Python flow without Google sign-in', () => {
  test.beforeAll(async () => {
    await launchFreshEdgeBrowser();
  });

  test.afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  test('Open W3Schools and continue directly to the Python flow', async () => {
    test.slow();

    const activePage = await openW3SchoolsFlow();

    await test.step('Step 1: Open Python tutorial', async () => {
      await activePage.goto('https://www.w3schools.com/python/default.asp', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await expect(activePage).toHaveURL(/w3schools\.com\/python/i, { timeout: 30000 });
      await captureStep(activePage, '02_python_page', 'PASS', 'Opened the Python tutorial page without Google login.');
    });

    await test.step('Step 2: Launch Try it Yourself and run code', async () => {
      const tryItUrl = 'https://www.w3schools.com/python/trypython.asp?filename=demo_hello';

      await activePage.goto(tryItUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
      await expect(activePage).toHaveURL(/trypython\.asp|tryit\.asp/i, { timeout: 30000 });
      await captureStep(activePage, '03_tryit_opened', 'PASS', 'Opened the Try it Yourself editor through the direct Python editor URL.');

      const editor = activePage.locator('#textareaCode').first();
      await expect(editor).toBeVisible({ timeout: 30000 });
      await editor.fill('');
      const code = 'print("Hello, Playwright Automation")';
      await editor.fill(code);
      await captureStep(activePage, '04_code_entered', 'PASS', `Entered: ${code}`);

      const runButton = activePage.locator('#runbtn').first();
      await expect(runButton).toBeVisible({ timeout: 20000 });
      await runButton.click();
      await activePage.waitForTimeout(4000);

      const resultFrame = activePage.frameLocator('#iframeResult');
      await expect(resultFrame.locator('body')).toContainText('Hello, Playwright Automation', { timeout: 30000 });
      await captureStep(activePage, '05_code_executed', 'PASS', 'The Python code executed successfully and produced the expected output.');
    });

    await test.step('Step 3: Final report generation', async () => {
      appendReport('06_final_summary', 'PASS', 'The automation continued past the blocked Google sign-in step and completed the Python tutorial, editor, and run flow.');
      await captureStep(activePage, '06_final_summary', 'PASS', 'Generated the final report for the non-authenticated flow.');
      await expect(activePage).toBeVisible();
    });
  });
});
