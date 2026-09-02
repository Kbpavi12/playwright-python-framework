const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.w3schools.com/sql/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  const pythonNav = page.locator('a.ga-nav[href*="/python/default.asp"]').first();
  await pythonNav.click();
  await page.waitForURL(/w3schools\.com\/python\/default\.asp/i, { timeout: 30000 });
  console.log('PYTHON URL', page.url());

  const tryIt = page.locator('a[href*="trypython.asp"]').first();
  console.log('TRYIT COUNT', await tryIt.count());
  console.log('TRYIT TEXT', await tryIt.textContent().catch(() => ''));

  await tryIt.click();
  await page.waitForTimeout(8000);
  console.log('AFTER CLICK URL', page.url());
  console.log('BODY TEXT', (await page.locator('body').innerText()).slice(0, 1500));

  const selectors = ['textarea', 'textareaCode', '#textareaCode', 'input', 'button', '#runbtn', 'pre', 'iframe'];
  for (const s of selectors) {
    console.log('COUNT', s, await page.locator(s).count());
  }

  await browser.close();
})();
