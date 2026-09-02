const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.w3schools.com/python/trypython.asp?filename=demo_indentation', { waitUntil: 'domcontentloaded', timeout: 120000 });
  console.log('URL', page.url());
  console.log('TITLE', await page.title());
  console.log('TEXTAREA_COUNT', await page.locator('#textareaCode').count());
  console.log('RUNBTN_COUNT', await page.locator('#runbtn').count());
  console.log('BODY_SNIP', (await page.locator('body').innerText()).slice(0, 1200));
  await browser.close();
})();
