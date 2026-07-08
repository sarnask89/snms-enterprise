from fastapi.testclient import TestClient
from app.main import app
import os

os.environ["CRM_SECRET_KEY"] = "test-secret"
os.environ["CRM_ENCRYPTION_KEY"] = "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI="
os.environ["CRM_ADMIN_PASSWORD"] = "admin"

client = TestClient(app)
client.post("/login", data={"username": "admin", "password": "admin"})
resp = client.get("/finances/cash")
print(f"Content-Type: {resp.headers.get('content-type')}")
print(f"Content-Length: {len(resp.content)}")
