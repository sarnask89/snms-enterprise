import httpx
from decimal import Decimal

BASE_URL = "http://127.0.0.1:8000"

def test_final():
    client = httpx.Client(base_url=BASE_URL, follow_redirects=True)
    # Login
    client.post("/login", data={"username": "admin", "password": "test"})
    
    # 1. Check if we have Sandomierz and a street
    # Sandomierz is ID 1
    # We'll use Street ID 1 (Opatowska or Rynek usually)
    
    payload = {
        "name": "INTEGRATION-STREET-GPS-OK",
        "location_city_id": "1",
        "location_street_id": "1",
        "street_number": "10",
        "latitude": "50.681234",
        "longitude": "21.745678",
        "node_type": "Budynek",
        "owner_type": "Własny"
    }
    
    print("Testing Backend Persistence for NetNode...")
    resp = client.post("/net-nodes/new", data=payload)
    
    if resp.status_code == 200:
        # Check DB
        import sqlite3
        conn = sqlite3.connect("crm.sqlite")
        row = conn.execute("SELECT id, name, location_street_id, latitude, longitude FROM net_nodes WHERE name='INTEGRATION-STREET-GPS-OK'").fetchone()
        conn.close()
        
        if row:
            print(f"SUCCESS: Node saved in DB!")
            print(f"  ID: {row[0]}")
            print(f"  StreetID: {row[2]} (Expected 1)")
            print(f"  Lat: {row[3]} (Expected 50.681234)")
            print(f"  Lng: {row[4]} (Expected 21.745678)")
        else:
            print("FAILED: Node not found in database.")
    else:
        print(f"FAILED: Backend returned status {resp.status_code}")

if __name__ == "__main__":
    test_final()
