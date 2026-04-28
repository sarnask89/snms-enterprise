import httpx
import sys
import time

BASE_URL = "http://127.0.0.1:8000"

def test_login():
    print("[TEST] Authentication...")
    client = httpx.Client(base_url=BASE_URL, follow_redirects=True)
    resp = client.post("/login", data={"username": "admin", "password": "test"})
    if resp.status_code == 200 and "Wyloguj" in resp.text:
        print("  => Login SUCCESS")
        return client
    else:
        print(f"  => Login FAILED (Status: {resp.status_code})")
        # Print first 200 chars of response to debug
        print(f"  => Response Body: {resp.text[:200]}")
        sys.exit(1)

def test_tariffs(client):
    print("[TEST] Tariffs and VAT Calculation...")
    # 1. Create a new tariff
    name = f"Test-Fiber-{int(time.time())}"
    data = {
        "name": name,
        "monthly_price": "100.00",
        "vat_rate_id": "1", # Assuming 23% is ID 1 from previous seed
        "speed_down_mbps": "500",
        "speed_up_mbps": "100",
        "description": "Integration Test Tariff"
    }
    resp = client.post("/finances/tariffs/new", data=data)
    if resp.status_code == 200:
        print(f"  => Tariff '{name}' created")
    else:
        print(f"  => Tariff creation FAILED: {resp.status_code}")
        return

    # 2. Check if Brutto is calculated correctly in the list
    resp = client.get("/finances/tariffs")
    if "123.00 PLN" in resp.text: # 100 * 1.23
        print("  => Brutto calculation in UI: SUCCESS")
    else:
        print("  => Brutto calculation in UI: FAILED (Expected 123.00)")

def test_subscriptions_prepopulation(client):
    print("[TEST] Subscription form pre-population and HTMX...")
    # Test if we can see nodes for a customer
    # First get a customer ID
    resp = client.get("/customers")
    import re
    # Match a customer link
    match = re.search(r'/customers/(\d+)/edit', resp.text)
    if match:
        cid = match.group(1)
        print(f"  => Found sample customer ID: {cid}")
        
        # Test HTMX endpoint for nodes
        resp = client.get(f"/subscriptions/customer-nodes/{cid}")
        if resp.status_code == 200 and "<option" in resp.text:
            print("  => HTMX customer-nodes endpoint: SUCCESS")
        else:
            print("  => HTMX customer-nodes endpoint: FAILED")
            
        # Test form pre-population params
        resp = client.get(f"/subscriptions/new?customer_id={cid}")
        if f'value="{cid}" selected' in resp.text:
            print("  => Form pre-population (customer_id): SUCCESS")
        else:
            print("  => Form pre-population (customer_id): FAILED")
    else:
        print("  => No sample customer found to test subscriptions.")

def test_diagnostics_ui_renaming(client):
    print("[TEST] Diagnostics UI (Ping -> Check)...")
    resp = client.get("/customer-devices")
    if "Sprawdź" in resp.text or "ICMP/ARP" in resp.text:
        print("  => Sprawdź button renaming: SUCCESS")
    else:
        print("  => Sprawdź button renaming: FAILED")

if __name__ == "__main__":
    print("=== SNMS Enterprise Integration Test Suite ===\n")
    # Wait for server to be ready
    for i in range(10):
        try:
            httpx.get(BASE_URL)
            break
        except:
            time.sleep(1)
            
    c = test_login()
    test_tariffs(c)
    test_subscriptions_prepopulation(c)
    test_diagnostics_ui_renaming(c)
    print("\n=== All Tests Completed ===")
