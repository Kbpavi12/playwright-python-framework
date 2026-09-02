const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const url = 'https://profile.w3schools.com/log-in?redirect_url=https%3A%2F%2Fwww.w3schools.com%2F';

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(5000);

  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  const bodyText = await page.locator('body').innerText();
  console.log('BODY_TEXT:', bodyText.slice(0, 1200));

  const selectors = [
    'input[type="email"]',
    'input[name*="email"]',
    'input[name*="mail"]',
    'input[type="password"]',
    'input[name*="password"]',
    'button[type="submit"]',
    'button:has-text("Log in")',
    'button:has-text("Sign in")',
    'input',
    'button'
  ];

  for (const s of selectors) {
    const count = await page.locator(s).count();
    console.log(s, '=>', count);
  }

  const possible = await page.locator('input, button').evaluateAll((els) => els.map((el) => ({
    tag: el.tagName,
    type: el.getAttribute('type') || '',
    name: el.getAttribute('name') || '',
    id: el.getAttribute('id') || '',
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    placeholder: el.getAttribute('placeholder') || ''
  })));
  console.log('POSSIBLE:', JSON.stringify(possible.slice(0, 50), null, 2));

  await browser.close();
})();
