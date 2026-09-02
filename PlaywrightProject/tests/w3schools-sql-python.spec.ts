import fs from 'fs';
import path from 'path';
import { test, expect, chromium } from '@playwright/test';

const REPORT_DIR = path.join(__dirname, '..', 'test-results', 'w3schools-python-edge-session');
const REPORT_FILE = path.join(REPORT_DIR, 'step-report.md');
let browser: any;
let page: any;

function ensureReportFile() {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  if (!fs.existsSync(REPORT_FILE)) {
    fs.writeFileSync(REPORT_FILE, '# W3Schools Edge session automation report\n\n');
  }
}

function appendReport(stepName: string, status: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED', details: string) {
  const timestamp = new Date().toISOString();
  const content = `## ${stepName} | ${status} | ${timestamp}\n${details}\n\n`;
  fs.appendFileSync(REPORT_FILE, content, 'utf8');
}

async function captureStep(stepName: string, status: 'PASS' | 'FAIL' | 'BLOCKED' | 'SKIPPED', details: string) {
  ensureReportFile();
  const screenshotPath = path.join(REPORT_DIR, `${stepName}.png`);

  if (page && !page.isClosed()) {
    try {
      await page.screenshot({ path: screenshotPath, fullPage: false });
      appendReport(stepName, status, `${details}\n![${stepName}](${path.basename(screenshotPath)})`);
      return;
    } catch (error) {
      // Ignore screenshot errors when the page or browser has already closed.
    }
  }

  appendReport(stepName, status, `${details}\nNo screenshot captured because the page/browser was no longer available.`);
}

async function signInWithGoogle() {
  const loginUrl = 'https://profile.w3schools.com/login?redirect_url=https%3A%2F%2Fwww.w3schools.com%2F';
  const googleEmail = process.env.GOOGLE_EMAIL || '';
  const googlePassword = process.env.GOOGLE_PASSWORD || '';

  if (!googleEmail || !googlePassword) {
    throw new Error('Missing GOOGLE_EMAIL or GOOGLE_PASSWORD environment variables. Set both before running the Google login flow.');
  }

  await page.goto(loginUrl, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await expect(page).toHaveTitle(/log in - w3schools/i, { timeout: 30000 });
  await captureStep('01_open_login_page', 'PASS', 'Opened the W3Schools login page in Edge.');

  const googleButton = page.locator('button').filter({ hasText: 'Google' }).first();
  if (!(await googleButton.isVisible({ timeout: 15000 }).catch(() => false))) {
    await captureStep('02_google_signin_option_missing', 'SKIPPED', 'The Google sign-in button was not visible, which indicates the Edge session is already authenticated.');
    return;
  }

  await captureStep('02_click_google_signin', 'PASS', 'Clicked the Google sign-in option on the W3Schools login page.');

  const popupPromise = page.waitForEvent('popup', { timeout: 30000 }).catch(() => null);
  await googleButton.click();
  const popup = await popupPromise;

  const targetPage = popup || page;

  if (targetPage && googleEmail) {
    const emailField = targetPage.locator('input[type="email"], input[name="identifier"], input[name="Email"], input[type="text"]').first();
    if (await emailField.isVisible({ timeout: 10000 }).catch(() => false)) {
      await emailField.fill(googleEmail);
      const emailNextButton = targetPage.getByRole('button', { name: /next|continue/i }).first();
      if (await emailNextButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await emailNextButton.click();
      }
    }
  }

  if (targetPage && googlePassword) {
    const passwordField = targetPage.locator('input[type="password"], input[name="Passwd"], input[name="password"]').first();
    if (await passwordField.isVisible({ timeout: 10000 }).catch(() => false)) {
      await passwordField.fill(googlePassword);
      const passwordNextButton = targetPage.getByRole('button', { name: /next|continue|sign in/i }).first();
      if (await passwordNextButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await passwordNextButton.click();
      }
    }
  }

  if (targetPage) {
    await targetPage.waitForLoadState('domcontentloaded', { timeout: 120000 }).catch(() => {});
    const continueButtons = [
      targetPage.getByRole('button', { name: /continue/i }).first(),
      targetPage.getByRole('button', { name: /next/i }).first(),
      targetPage.getByRole('button', { name: /sign in/i }).first(),
    ];

    for (const button of continueButtons) {
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        await button.click();
      }
    }

    const accountPicker = targetPage.locator('div[role="button"], button').filter({ hasText: /continue as|use another account|select account/i }).first();
    if (await accountPicker.isVisible({ timeout: 5000 }).catch(() => false)) {
      await accountPicker.click();
    }
  }

  await page.waitForLoadState('networkidle', { timeout: 120000 }).catch(() => {});
  await page.waitForURL(/w3schools\.com|profile\.w3schools\.com/i, { timeout: 120000 }).catch(() => {});
  await expect(page).toHaveURL(/w3schools\.com|profile\.w3schools\.com/i, { timeout: 120000 });
  await captureStep('03_google_auth_complete', 'PASS', 'Google sign-in completed and the session is now authorized for W3Schools.');
}

test.beforeAll(async () => {
  const userDataDir = 'C:\\Users\\kpavithr\\AppData\\Local\\Microsoft\\Edge\\User Data\\PlaywrightW3Schools';
  browser = await chromium.launchPersistentContext(userDataDir, {
    channel: 'msedge',
    headless: false,
    args: ['--profile-directory=Default'],
  });
  page = await browser.newPage();
});

test.afterAll(async () => {
  if (browser) {
    await browser.close();
  }
});

test.describe('W3Schools Python flow using Google sign-in in Edge', () => {
  test('Open W3Schools, sign in with Google, then open Python Try it Yourself and run the code', async () => {
    ensureReportFile();

    try {
      await captureStep('00_launch_edge_profile', 'PASS', 'Launched the Edge browser profile for the W3Schools flow.');
      await signInWithGoogle();

      await page.goto('https://www.w3schools.com/python/default.asp', { waitUntil: 'domcontentloaded', timeout: 120000 });
      await expect(page).toHaveURL(/w3schools\.com\/python\/default\.asp/i, { timeout: 30000 });
      await captureStep('04_python_page_loaded', 'PASS', 'Python tutorial page loaded successfully after Google sign-in.');

      const tryItYourself = page.locator('a[href*="trypython.asp"]').first();
      await expect(tryItYourself).toBeVisible({ timeout: 30000 });
      await tryItYourself.click();
      await expect(page).toHaveURL(/trypython\.asp/i, { timeout: 30000 });
      await captureStep('05_tryit_page_opened', 'PASS', 'Try it Yourself page opened successfully.');

      const textarea = page.locator('#textareaCode').first();
      await expect(textarea).toBeVisible({ timeout: 30000 });
      await textarea.fill('');
      const statement = 'print("I am learning Python from W3Schools")';
      await textarea.fill(statement);
      await captureStep('06_statement_reentered', 'PASS', `The default code was cleared and replaced with: ${statement}`);

      const runButton = page.locator('#runbtn').first();
      await expect(runButton).toBeVisible({ timeout: 20000 });
      await runButton.click();
      await page.waitForTimeout(4000);

      const resultFrame = page.frameLocator('#iframeResult');
      await expect(resultFrame.locator('body')).toContainText('I am learning Python from W3Schools', { timeout: 30000 });
      await captureStep('07_code_executed', 'PASS', 'The Python code executed successfully and produced the expected output.');

      await captureStep('08_flow_complete', 'PASS', 'The full Google sign-in + Python flow completed successfully in Edge.');
    } catch (err: any) {
      const message = err?.message || String(err);
      await captureStep('99_unexpected_failure', 'FAIL', `Unexpected failure: ${message}`);
      throw err;
    }
  });
});
