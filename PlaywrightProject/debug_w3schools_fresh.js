const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.w3schools.com/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  console.log('URL1:', page.url());

  const signIn = page.locator('a:has-text("Sign in")').first();
  console.log('SIGNIN_COUNT:', await signIn.count());

  if (await signIn.count()) {
    console.log('SIGNIN_TEXT:', await signIn.textContent());
    await signIn.click();
    await page.waitForTimeout(5000);
    console.log('URL2:', page.url());
    console.log('BODY_SNIP:', (await page.locator('body').innerText()).slice(0, 1200));
    console.log('INPUTS:', await page.locator('input').count());
    console.log('BUTTONS:', await page.locator('button').count());
    console.log('HAS_EMAIL_FIELD:', await page.locator('input[type="email"]').count());
    console.log('HAS_PASSWORD_FIELD:', await page.locator('input[type="password"]').count());
  }

  await page.waitForTimeout(15000);
  await browser.close();
})();
