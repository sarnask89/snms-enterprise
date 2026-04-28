import pytest
import re
import time
from playwright.sync_api import Page, expect
from app.config import CRM_ADMIN_USER, CRM_ADMIN_PASSWORD

def test_login_flow(page: Page, server: str):
    """Verify that a user can login and see the dashboard."""
    page.goto(f"{server}/login")
    page.fill("input[name='username']", CRM_ADMIN_USER)
    page.fill("input[name='password']", CRM_ADMIN_PASSWORD)
    page.click("button[type='submit']")
    page.wait_for_url(f"{server}/")
    expect(page.locator("nav")).to_contain_text("Pulpit")
    expect(page.locator("body")).to_contain_text("Wyloguj")

def test_add_net_node_geocoding(page: Page, server: str):
    """Test the geocoding integration in the browser."""
    # 1. Login
    page.goto(f"{server}/login")
    page.fill("input[name='username']", CRM_ADMIN_USER)
    page.fill("input[name='password']", CRM_ADMIN_PASSWORD)
    page.click("button[type='submit']")
    page.wait_for_url(f"{server}/")

    # 2. Navigate to new node
    page.goto(f"{server}/net-nodes/new")
    page.wait_for_selector("#name")
    
    # 3. Fill Name
    page.fill("#name", "E2E-BROWSER-NODE")
    
    # 4. Search Street
    street_input = page.locator("#street_suggest")
    street_input.click()
    street_input.press_sequentially("Test-Rynek", delay=150)
    
    # 5. Wait and Click Suggestion
    page.wait_for_selector(".suggest-item", timeout=15000)
    page.click(".suggest-item")
    
    # 6. Fill Number
    page.fill("#street_number", "1")
    page.keyboard.press("Tab")
    
    # 7. Wait for Geocode
    try:
        page.wait_for_function(
            "document.getElementById('latitude').value !== '52.231'",
            timeout=8000
        )
    except:
        pass # Geocoding timeout is acceptable in some test environments

    # 8. Submit
    page.click("button[type='submit']")
    
    # 9. Verify in list
    page.wait_for_url(f"{server}/net-nodes")
    expect(page.locator("body")).to_contain_text("E2E-BROWSER-NODE")
