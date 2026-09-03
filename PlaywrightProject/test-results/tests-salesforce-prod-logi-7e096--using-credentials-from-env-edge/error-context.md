# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\salesforce-prod-login.spec.ts >> Salesforce production login >> Login to the production org using credentials from .env
- Location: tests\salesforce-prod-login.spec.ts:9:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/lightning|\/setup|\/home/i
Received string:  "https://login.salesforce.com/"

Call log:
  - Expect "toHaveURL" with timeout 300000ms
    297 × unexpected value "https://login.salesforce.com/"

```

```yaml
- text: "Salesforce login Error: Please check your username and password. If you still can't log in, contact your Salesforce administrator."
- heading "Salesforce login" [level=1]
- text: Username
- textbox "Username"
- text: Password
- textbox "Password"
- button "Log In"
- checkbox "Remember me"
- text: Remember me
- link "Forgot Your Password?":
    - /url: /secur/forgotpassword.jsp?locale=us
- link "Use Custom Domain":
    - /url: javascript:void(0);
- text: or
- link "Log In with Email":
    - /url: https://welcome.salesforce.com?qs=&loginType=&display=page&pw=Pavi%4012345&lt=standard&passwordShown=true&locale=&login=&serverid=&local=&startURL=&oauth_callback=&hasRememberUn=true&loginURL=null&oauth_token=&ExtraLog=%255B%257B%2522width%2522%3A1280%257D%2C%257B%2522height%2522%3A720%257D%2C%257B%2522language%2522%3A%2522en-US%2522%257D%2C%257B%2522offset%2522%3A-5.5%257D%2C%257B%2522scripts%2522%3A%255B%257B%2522size%2522%3A249%2C%2522summary%2522%3A%2522if%2520%28self%2520%3D%3D%2520top%29%2520%257Bdocument.documentElement.style.v%2522%257D%2C%257B%2522size%2522%3A581%2C%2522summary%2522%3A%2522var%2520SFDCSessionVars%3D%257B%255C%2522server%255C%2522%3A%255C%2522https%3A%255C%255C%2F%255C%255C%2Flogin.sal%2522%257D%2C%257B%2522url%2522%3A%2522https%3A%2F%2Flogin.salesforce.com%2Fjslibrary%2FSfdcSessionBase208.js%2522%257D%2C%257B%2522url%2522%3A%2522https%3A%2F%2Flogin.salesforce.com%2Fjslibrary%2FLoginHint208.js%2522%257D%2C%257B%2522size%2522%3A26%2C%2522summary%2522%3A%2522LoginHint.hideLoginForm%28%29%3B%2522%257D%2C%257B%2522size%2522%3A36%2C%2522summary%2522%3A%2522LoginHint.getSavedIdentities%28false%29%3B%2522%257D%2C%257B%2522url%2522%3A%2522https%3A%2F%2Flogin.salesforce.com%2Fjslibrary%2Fbaselogin4.js%2522%257D%2C%257B%2522url%2522%3A%2522https%3A%2F%2Flogin.salesforce.com%2Fjslibrary%2FLoginMarketingSurveyResponse.js%2522%257D%2C%257B%2522size%2522%3A451%2C%2522summary%2522%3A%2522function%2520handleLogin%28%29%257Bdocument.login.un.value%3Ddoc%2522%257D%255D%257D%2C%257B%2522scriptCount%2522%3A9%257D%2C%257B%2522iframes%2522%3A%255B%2522https%3A%2F%2Fc.salesforce.com%2Flogin-messages%2Fpromos.html%2522%2C%2522https%3A%2F%2Flogin.salesforce.com%2Flogin%2Fsessionserver212.html%2522%255D%257D%2C%257B%2522iframeCount%2522%3A2%257D%2C%257B%2522referrer%2522%3A%2522https%3A%2F%2Flogin.salesforce.com%2F%2522%257D%255D&width=1280&un=k.b.pavithra%40capgemini.com&useSecure=true&height=720&username=k.b.pavithra%40capgemini.com&ref=lsc
- paragraph: Not a customer?
- link "Try for Free":
    - /url: https://www.salesforce.com/form/trial/freetrial.jsp?d=70130000000Enus
- text: © 2026 Salesforce, Inc. All rights reserved. |
- link "Privacy":
    - /url: https://www.salesforce.com/us/company/privacy
- iframe
- text: Login
```

# Test source

```ts
  1  | import 'dotenv/config';
  2  | import { test, expect } from '@playwright/test';
  3  |
  4  | const SF_LOGIN_URL = process.env.SF_LOGIN_URL ?? 'https://login.salesforce.com';
  5  | const SF_USERNAME = process.env.SF_USERNAME;
  6  | const SF_PASSWORD = process.env.SF_PASSWORD;
  7  |
  8  | test.describe('Salesforce production login', () => {
  9  |   test('Login to the production org using credentials from .env', async ({ page }) => {
  10 |     test.setTimeout(5 * 60 * 1000);
  11 |
  12 |     test.skip(
  13 |       !SF_USERNAME || !SF_PASSWORD,
  14 |       'Set SF_USERNAME and SF_PASSWORD in the .env file inside PlaywrightProject before running this test.'
  15 |     );
  16 |
  17 |     await page.goto(SF_LOGIN_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  18 |
  19 |     const usernameField = page.locator('#username');
  20 |     await expect(usernameField).toBeVisible({ timeout: 20000 });
  21 |     await usernameField.fill(SF_USERNAME!);
  22 |
  23 |     const loginButton = page.locator('#Login, button:has-text("Log In")');
  24 |     await loginButton.first().click();
  25 |
  26 |     const passwordField = page.locator('#password');
  27 |     await expect(passwordField).toBeVisible({ timeout: 20000 });
  28 |     await passwordField.fill(SF_PASSWORD!);
  29 |
  30 |     await page.locator('#Login').click();
  31 |
> 32 |     await expect(page).toHaveURL(/\/lightning|\/setup|\/home/i, { timeout: 5 * 60 * 1000 });
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  33 |     await expect(page.locator('body')).toContainText(/Welcome|Home|App Launcher|Lightning Experience/i, { timeout: 20000 });
  34 |   });
  35 | });
  36 |
```
