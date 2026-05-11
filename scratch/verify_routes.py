import os
import sys

# Ensure app directory is in path
sys.path.append(os.getcwd())

os.environ['AUTH_ENABLED'] = 'false'
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
urls = [
    '/', 
    '/customers', 
    '/customer-devices', 
    '/ip-networks', 
    '/ip-networks/usage', 
    '/admin/pit', 
    '/net-nodes', 
    '/net-devices', 
    '/subscriptions'
]

print("--- ROUTE VERIFICATION ---")
for u in urls:
    try:
        r = client.get(u)
        print(f"{u}: {r.status_code}")
        if r.status_code != 200:
            print(f"  Error body: {r.text[:200]}...")
    except Exception as e:
        print(f"{u}: EXCEPTION {e}")
print("--- END ---")
