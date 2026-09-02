const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();
  const url = 'https://profile.w3schools.com/log-in?redirect_url=https%3A%2F%2Fwww.w3schools.com%2F';

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(10000);

  console.log('URL:', page.url());
  console.log('TITLE:', await page.title());
  console.log('INPUTS:', await page.locator('input').count());
  console.log('BUTTONS:', await page.locator('button').count());
  console.log('A_TAGS:', await page.locator('a').count());
  console.log('BODY_TEXT:', (await page.locator('body').innerText()).slice(0, 2000));
  console.log('HTML_SNIP:', (await page.content()).slice(0, 2500));

  await page.waitForTimeout(20000);
  await browser.close();
})();
