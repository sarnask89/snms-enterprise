import unittest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app import models

from app.deps import verify_session, require_business_write
from app.database import get_db

class TestOltLiveApi(unittest.TestCase):
    def setUp(self):
        # Override all potential auth dependencies
        app.dependency_overrides[verify_session] = lambda: {"username": "test_admin", "role": "admin"}
        app.dependency_overrides[require_business_write] = lambda: {"username": "test_admin", "role": "admin"}
        self.client = TestClient(app, raise_server_exceptions=False)

    def tearDown(self):
        app.dependency_overrides.clear()

    def test_pon_port_endpoint_access(self):
        # Test if the endpoint is reachable for OLT 82 and Port 1
        # Use follow_redirects=False to catch auth issues
        response = self.client.get("/net-devices/82/pon-port/1", follow_redirects=False)
        
        self.assertEqual(response.status_code, 200, f"Expected 200 but got {response.status_code}. Content: {response.text[:200]}")
        self.assertIn("ID ONU", response.text)
        self.assertIn("Sygnał RX", response.text)

if __name__ == '__main__':
    unittest.main()
