# W3Schools Google Login and Python Automation Test Case

## Objective
Validate the end-to-end W3Schools user flow where a user signs in with Google, navigates to the Python tutorial, opens the Try it Yourself editor, enters a specific code snippet, runs it, and captures step-by-step screenshots and a final report.

## Test Scope
- Website: https://www.w3schools.com/
- Authentication: Google sign-in
- Target email: kasapavithra5@gmail.com
- Python code: print("Hello, Playwright Automation")
- Browser: Microsoft Edge
- Automation: Playwright + Playwright MCP server guidance

## Preconditions
- Microsoft Edge browser is installed.
- The W3Schools login page is reachable.
- The Google account email kasapavithra5@gmail.com is available.
- The real W3Schools password is set in PlaywrightProject/.env as W3S_PASSWORD.
- The Playwright project dependencies are installed.

## Environment Configuration
Add the following to the .env file in the Playwright project root:

```env
W3S_EMAIL=kasapavithra5@gmail.com
W3S_PASSWORD=REPLACE_WITH_YOUR_W3SCHOOLS_PASSWORD
```

## Test Steps

### Step 1: Open Target URL
- Navigate to https://www.w3schools.com/
- Confirm the page loads successfully.
- Capture a screenshot.

### Step 2: Access Sign-In Page
- Click the Log in / Sign in option on the homepage.
- Confirm the sign-in page loads.
- Capture a screenshot.

### Step 3: Select Authentication Provider
- Click the Google icon.
- Confirm Google authentication opens.
- Capture a screenshot.

### Step 4: Enter User Identity
- Input the target email: kasapavithra5@gmail.com.
- If a Google account selection screen appears, select the matching account.
- Capture a screenshot.

### Step 5: Password and Verification Pass
- Enter the W3Schools/Google account password.
- Click Next.
- If mobile verification is prompted, confirm Yes on the device.
- Capture a screenshot for the final auth state.

### Step 6: Navigate to Target Tutorial
- After sign-in, open the Tutorials menu.
- Select the Python tab.
- Confirm the Python tutorial page loads.
- Capture a screenshot.

### Step 7: Launch Interactive Editor
- Scroll within the Python page.
- Click Try it Yourself.
- Confirm the editor opens.
- Capture a screenshot.

### Step 8: Code Modification & Execution
- Clear the existing code in the editor.
- Enter: print("Hello, Playwright Automation")
- Click Run.
- Confirm the output shows the expected line.
- Capture screenshots before and after execution.

### Step 9: Document Generation
- Save step screenshots in the test-results folder.
- Auto-create a Markdown report listing each step status.
- End with a success summary.

## Expected Result
The script should successfully log in, open the Python tutorial, launch the editor, run the provided Python code, and generate a final screenshot report.

## MCP Server Inclusion
This flow can be executed through Playwright MCP server browser automation by using browser navigation, clicks, form-filling, and screenshot capture actions. In an MCP-driven setup, each step is treated as an observable browser action:
- browser_navigate
- browser_click
- browser_fill
- browser_wait_for_text
- browser_take_screenshot
- browser_snapshot

This aligns with the same step-by-step flow described above and keeps the login, tutorial navigation, and editor execution in traceable MCP actions.

## Exit Criteria
- Homepage opens.
- Google sign-in completes.
- Python tutorial opens.
- Try it Yourself page opens.
- Code is replaced and executed successfully.
- Screenshots are captured for all steps.
- Final report is generated successfully.
