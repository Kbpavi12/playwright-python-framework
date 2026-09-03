# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\embedded-messaging.spec.ts >> Embedded Messaging chat flow
- Location: tests\embedded-messaging.spec.ts:3:5

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: Embedded chat launcher was not visible inside the messaging iframe
```

# Page snapshot

```yaml
- generic [ref=e1]:
    - generic [ref=e9]:
        - link "Skip to Main" [ref=e10] [cursor=pointer]:
            - /url: javascript:void(0);
        - banner [ref=e11]:
            - generic [ref=e12]:
                - generic [ref=e19]:
                    - generic [ref=e20]:
                        - generic [ref=e21]: AGDC Now
                        - generic [ref=e22]: "MCLANE SOUTHWEST #019308"
                    - generic [ref=e23]:
                        - button "Home" [ref=e24] [cursor=pointer]
                        - button "Products Show menu" [ref=e26] [cursor=pointer]:
                            - text: Products
                            - img [ref=e28]
                            - generic [ref=e31]: Show menu
                        - button "Analysis & Insights Show menu" [ref=e33] [cursor=pointer]:
                            - text: Analysis & Insights
                            - img [ref=e35]
                            - generic [ref=e38]: Show menu
                        - button "Tools & Resources Show menu" [ref=e40] [cursor=pointer]:
                            - text: Tools & Resources
                            - img [ref=e42]
                            - generic [ref=e45]: Show menu
                    - generic [ref=e46]:
                        - generic [ref=e47]: 6601 VENTURES
                        - button "🛒 Cart (0)" [ref=e48] [cursor=pointer]
                    - generic [ref=e49]:
                        - generic [ref=e50]:
                            - generic [ref=e51]: ORDER INSIGHTS
                            - generic [ref=e52]: Last 30 days
                        - generic [ref=e53]:
                            - generic [ref=e54]:
                                - generic [ref=e55]: "2"
                                - button "Active Orders" [ref=e56] [cursor=pointer]
                            - generic [ref=e58]:
                                - generic [ref=e59]: "1"
                                - button "Shipped Orders" [ref=e60] [cursor=pointer]
                            - generic [ref=e62] [cursor=pointer]:
                                - generic [ref=e63]: "2"
                                - generic [ref=e64]: Total Orders
                            - generic [ref=e65] [cursor=pointer]:
                                - generic [ref=e66]: "2"
                                - generic [ref=e67]: Total Invoices
                - generic [ref=e69]:
                    - heading "FEATURED PRODUCT CATALOG" [level=2] [ref=e70]
                    - generic [ref=e71]:
                        - generic [ref=e72]:
                            - img "Sour Lemon Lime" [ref=e73]
                            - button "Add To Order" [ref=e75] [cursor=pointer]
                        - generic [ref=e76]:
                            - img "Strawberry" [ref=e77]
                            - button "Add To Order" [ref=e79] [cursor=pointer]
                        - generic [ref=e80]:
                            - img "Peach Mango" [ref=e81]
                            - button "Add To Order" [ref=e83] [cursor=pointer]
                        - generic [ref=e84]:
                            - img "Blackberry" [ref=e85]
                            - button "Add To Order" [ref=e87] [cursor=pointer]
                        - generic [ref=e88]:
                            - img "Strawberry Kiwi" [ref=e89]
                            - button "Add To Order" [ref=e91] [cursor=pointer]
                - generic [ref=e92]:
                    - generic [ref=e93]:
                        - generic [ref=e94]:
                            - generic [ref=e95]:
                                - generic [ref=e96]: LAST DELIVERED
                                - generic [ref=e97]:
                                    - generic [ref=e98]: 📦
                                    - heading "No orders yet!" [level=3] [ref=e99]
                                    - paragraph [ref=e100]: Your reorder options will appear here after your first purchase.
                                - link "View All Orders" [ref=e102] [cursor=pointer]:
                                    - /url: "#"
                            - generic [ref=e103]:
                                - generic [ref=e104]: RECENT ORDERS
                                - generic [ref=e105]:
                                    - generic [ref=e106]:
                                        - generic [ref=e107]: 8/12/2026
                                        - link "#3050707" [ref=e108] [cursor=pointer]:
                                            - /url: "#"
                                        - strong [ref=e109]: Received
                                    - generic [ref=e110]:
                                        - generic [ref=e111]: 8/7/2026
                                        - link "#3050665" [ref=e112] [cursor=pointer]:
                                            - /url: "#"
                                        - strong [ref=e113]: Shipped
                                - link "View All Orders" [ref=e115] [cursor=pointer]:
                                    - /url: "#"
                        - generic [ref=e116]:
                            - img "Featured story banner" [ref=e117]
                            - 'heading "Dash In''s 100-year evolution: How a fuel distributor became a foodservice-focused c-store chain" [level=2] [ref=e118]'
                            - paragraph [ref=e119]: July 31, 2026
                    - generic [ref=e124]:
                        - generic [ref=e125]: AGDC Now
                        - generic [ref=e126]: tobaccoiscus.com | 1-866-292-3510 | Contact Us
                        - generic [ref=e127]: Altria Group Distribution Company (AGDC)
        - main [ref=e128]
        - contentinfo [ref=e139]
    - iframe [active] [ref=e145]:
        - button "Start with text" [ref=f7e38] [cursor=pointer]:
            - group "Text chat controls" [ref=f7e39]:
                - img [ref=f7e42]
                - generic [ref=f7e45]: Ask Me Anything
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Embedded Messaging chat flow', async ({ page }) => {
  4  |   const result: {
  5  |     agentResponse?: string;
  6  |     screenshot?: string;
  7  |     errors?: string[];
  8  |   } = {
  9  |     errors: []
  10 |   };
  11 |
  12 |   try {
  13 |     await page.goto('https://orgfarm-2ac35d2ecc-dev-ed.develop.my.site.com/', {
  14 |       waitUntil: 'domcontentloaded',
  15 |       timeout: 120000
  16 |     });
  17 |     await page.waitForLoadState('domcontentloaded');
  18 |
  19 |     const iframeSelector = 'iframe#embeddedMessagingFrame';
  20 |     const chatFrame = page.frameLocator(iframeSelector);
  21 |
  22 |     await page.waitForSelector(iframeSelector, { state: 'attached', timeout: 120000 });
  23 |     await expect(page.locator(iframeSelector)).toBeVisible({ timeout: 120000 });
  24 |
  25 |     const launcher = chatFrame.locator('button:has-text("Start with text")').first();
  26 |     await expect(launcher).toBeVisible({ timeout: 120000 }).catch(() => {
> 27 |       throw new Error('Embedded chat launcher was not visible inside the messaging iframe');
     |             ^ Error: Embedded chat launcher was not visible inside the messaging iframe
  28 |     });
  29 |     await launcher.click();
  30 |
  31 |     const inputLocator = chatFrame.locator('textarea, input, [contenteditable="true"]').first();
  32 |     await expect(inputLocator).toBeVisible({ timeout: 120000 }).catch(() => {
  33 |       throw new Error('Chat input was not visible after clicking launcher');
  34 |     });
  35 |
  36 |     await inputLocator.fill('please order previous products');
  37 |     await inputLocator.press('Enter');
  38 |
  39 |     const response = chatFrame.locator('text=please order previous products').first();
  40 |     await expect(response).toBeVisible({ timeout: 60000 }).catch(() => undefined);
  41 |
  42 |     const agentText = chatFrame.locator('div, p, span, li').filter({ hasText: /previous products|order|agent|hello|sorry|I can|I can help|here/i }).last();
  43 |     await expect(agentText).toBeVisible({ timeout: 180000 }).catch(() => {
  44 |       throw new Error('Agent response was not visible within the expected wait time');
  45 |     });
  46 |
  47 |     result.agentResponse = (await agentText.textContent())?.trim() || 'No text captured';
  48 |     await page.screenshot({ path: 'embedded-messaging-result.png', fullPage: true });
  49 |     result.screenshot = 'embedded-messaging-result.png';
  50 |   } catch (error: any) {
  51 |     result.errors?.push(error?.message || String(error));
  52 |     await page.screenshot({ path: 'embedded-messaging-error.png', fullPage: true }).catch(() => undefined);
  53 |     result.screenshot = 'embedded-messaging-error.png';
  54 |     throw error;
  55 |   }
  56 |
  57 |   console.log(JSON.stringify(result, null, 2));
  58 | });
  59 |
```
