# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\admission-form-kmail.spec.ts >> Admission form submits successfully with kmail.com email
- Location: tests\admission-form-kmail.spec.ts:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
Call log:
  - navigating to "http://localhost:3000/", waiting until "domcontentloaded"

```

# Page snapshot

```yaml
- generic [ref=e2]:
    - generic [ref=e3]:
        - generic [ref=e6]:
            - heading "Hmmm… can't reach this page" [level=1] [ref=e7]
            - paragraph [ref=e8]:
                - strong [ref=e9]: localhost
                - text: refused to connect.
            - generic [ref=e10]:
                - paragraph [ref=e11]: "Try:"
                - list [ref=e12]:
                    - listitem [ref=e13]: •Checking the connection
                    - listitem [ref=e14]:
                        - text: •
                        - link "Checking the proxy and the firewall" [ref=e15] [cursor=pointer]:
                            - /url: "#buttons"
            - generic [ref=e16]: ERR_CONNECTION_REFUSED
        - button "Refresh" [ref=e19] [cursor=pointer]
    - generic [ref=e22]: Microsoft Edge
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('Admission form submits successfully with kmail.com email', async ({ page }) => {
> 4  |   await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 120000 });
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/
  5  |   await expect(page.locator('h1')).toHaveText('Admission Form');
  6  |
  7  |   await page.locator('#fullName').fill('Ravi Kumar');
  8  |   await page.locator('#email').fill('ravi.kumar@kmail.com');
  9  |   await page.locator('#phone').fill('9876543210');
  10 |   await page.locator('#dob').fill('2000-01-01');
  11 |   await page.locator('#program').selectOption('B.Tech');
  12 |   await page.locator('#country').fill('India');
  13 |
  14 |   await expect(page.getByRole('button', { name: 'Submit Application' })).toBeVisible();
  15 |   await page.getByRole('button', { name: 'Submit Application' }).click();
  16 |
  17 |   await expect(page.locator('#successMessage')).toContainText('Thank you, Ravi Kumar');
  18 |   await expect(page.locator('#successMessage')).toContainText('submitted successfully');
  19 |
  20 |   await page.waitForTimeout(2000);
  21 | });
  22 |
```
