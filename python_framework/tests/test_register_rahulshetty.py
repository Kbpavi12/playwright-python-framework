import os
import random
import string
import time
from pathlib import Path
from playwright.sync_api import sync_playwright


def _rand_str(n=8):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=n))


def test_register_rahulshetty():
    """Opens the Rahul Shetty Academy register page and fills the form with random data."""
    url = "https://rahulshettyacademy.com/client/#/auth/register"
    headless = os.getenv("HEADLESS", "1") != "0"

    base_dir = Path(__file__).resolve().parents[1]
    screenshots_dir = base_dir / "screenshots"
    screenshots_dir.mkdir(exist_ok=True)

    name_part = _rand_str(6)
    test_data = {
        "first_name": "FN_" + name_part,
        "last_name": "LN_" + name_part,
        "email": f"user_{name_part}@example.com",
        "password": "P@ss" + _rand_str(6) + "!",
        "phone": "9" + ''.join(random.choices(string.digits, k=9)),
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page()

        page.goto(url)
        page.wait_for_load_state("domcontentloaded")

        # Find visible input fields and fill based on attribute hints
        inputs = page.locator("input:not([type='hidden']):not([disabled])")
        count = inputs.count()
        for i in range(count):
            el = inputs.nth(i)
            try:
                attr_name = (el.get_attribute("name") or "").lower()
                placeholder = (el.get_attribute("placeholder") or "").lower()
                type_attr = (el.get_attribute("type") or "").lower()

                if "email" in attr_name or "email" in placeholder or type_attr == "email":
                    el.fill(test_data["email"])
                elif "pass" in attr_name or "pass" in placeholder or type_attr == "password":
                    el.fill(test_data["password"])
                elif "first" in attr_name or "first" in placeholder or "fname" in attr_name:
                    el.fill(test_data["first_name"])
                elif "last" in attr_name or "last" in placeholder or "lname" in attr_name:
                    el.fill(test_data["last_name"])
                elif "phone" in attr_name or "mobile" in attr_name or "tel" in attr_name or "contact" in attr_name:
                    el.fill(test_data["phone"])
                else:
                    # generic fill if empty
                    current = el.input_value()
                    if not current:
                        el.fill("test_" + _rand_str(5))
            except Exception:
                # ignore elements we can't interact with
                continue

        # take a screenshot before submit
        ts = int(time.time())
        shot = screenshots_dir / f"rahul_register_before_{ts}.png"
        page.screenshot(path=str(shot), full_page=False)

        # Attempt to click register / sign up button
        clicked = False
        try_buttons = ["button[type='submit']", "text=Register", "text=Sign Up", "text=Sign up", "text=Submit"]
        for sel in try_buttons:
            try:
                page.click(sel, timeout=3000)
                clicked = True
                break
            except Exception:
                continue

        # wait briefly for any post-submit activity
        time.sleep(3)

        # capture post-submit screenshot
        shot2 = screenshots_dir / f"rahul_register_after_{ts}.png"
        page.screenshot(path=str(shot2), full_page=False)

        # simple assertion: page loaded and screenshots were created
        assert shot.exists()
        assert shot2.exists()

        browser.close()
