const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();
  await page.goto('https://profile.w3schools.com/login?redirect_url=https%3A%2F%2Fwww.w3schools.com%2F', { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(5000);

  const inputs = await page.locator('input').evaluateAll((els) => els.map((el) => ({
    type: el.getAttribute('type'),
    name: el.getAttribute('name'),
    id: el.getAttribute('id'),
    autocomplete: el.getAttribute('autocomplete'),
    placeholder: el.getAttribute('placeholder'),
    value: el.getAttribute('value')
  })));
  console.log(JSON.stringify(inputs, null, 2));

  const forms = await page.locator('form').evaluateAll((els) => els.map((el) => ({
    action: el.getAttribute('action'),
    method: el.getAttribute('method'),
    id: el.getAttribute('id'),
    className: el.getAttribute('class')
  })));
  console.log(JSON.stringify(forms, null, 2));

  const buttons = await page.locator('button').evaluateAll((els) => els.map((el) => ({
    type: el.getAttribute('type'),
    text: (el.textContent || '').replace(/\s+/g, ' ').trim(),
    id: el.getAttribute('id'),
    className: el.getAttribute('class')
  })));
  console.log(JSON.stringify(buttons, null, 2));

  await page.waitForTimeout(20000);
  await browser.close();
})();
