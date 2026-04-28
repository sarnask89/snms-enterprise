import httpx
from decimal import Decimal

BASE_URL = "http://127.0.0.1:8000"

def test_save_node():
    client = httpx.Client(base_url=BASE_URL, follow_redirects=True)
    # 1. Login
    client.post("/login", data={"username": "admin", "password": "test"})
    
    # 2. Try to save node with specifically known street_id (1) and coordinates
    payload = {
        "name": "TEST-STREET-FIX-01",
        "location_city_id": "1",
        "location_street_id": "1",
        "street_number": "99",
        "latitude": "50.680000",
        "longitude": "21.740000",
        "node_type": "Budynek",
        "owner_type": "Własny"
    }
    
    print(f"Sending POST to /net-nodes/new with street_id={payload['location_street_id']}")
    resp = client.post("/net-nodes/new", data=payload)
    
    if resp.status_code == 200:
        print("Response 200 OK")
        # Check if actually saved in list
        resp_list = client.get("/net-nodes")
        if "TEST-STREET-FIX-01" in resp_list.text:
            print("SUCCESS: Node found in list!")
        else:
            print("FAILED: Node NOT found in list after 'successful' save.")
    else:
        print(f"FAILED: Status {resp.status_code}")

if __name__ == "__main__":
    test_save_node()
