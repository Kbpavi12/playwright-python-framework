const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.w3schools.com/python/trypython.asp?filename=demo_indentation', { waitUntil: 'domcontentloaded', timeout: 120000 });
  const el = page.locator('#textareaCode');
  console.log('COUNT', await el.count());
  console.log('IS_VISIBLE', await el.isVisible().catch(e => e.message));
  console.log('CS', await el.evaluate((node) => ({
    display: getComputedStyle(node).display,
    visibility: getComputedStyle(node).visibility,
    opacity: getComputedStyle(node).opacity,
    width: getComputedStyle(node).width,
    height: getComputedStyle(node).height,
    hidden: node.hidden,
    ariaHidden: node.getAttribute('aria-hidden')
  })));
  console.log('VALUE', await el.inputValue().catch(e => e.message));
  await browser.close();
})();
