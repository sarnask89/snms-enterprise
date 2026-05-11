import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Set AUTH_ENABLED to false globally before any app module is imported
os.environ["AUTH_ENABLED"] = "false"

import logging
import pytest
import subprocess
from sqlalchemy import select, func
from app.database import SessionLocal
from app.models import NetDevice, CustomerDevice

logging.basicConfig(
    filename='tests/olt_discovery_validation.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

OLT_ID = 82

def setup_module(module):
    logger.info("Starting OLT Discovery Validation Tests")
    
    # 1. Run sync_onus.py
    logger.info("Running sync_onus.py...")
    result = subprocess.run([sys.executable, "sync_onus.py", str(OLT_ID)], capture_output=True, text=True)
    logger.info(f"sync_onus.py output:\n{result.stdout}\n{result.stderr}")
    assert result.returncode == 0, "sync_onus.py failed"

    # 2. Run sync_macs_to_onus.py
    logger.info("Running sync_macs_to_onus.py...")
    result = subprocess.run([sys.executable, "sync_macs_to_onus.py", str(OLT_ID)], capture_output=True, text=True)
    logger.info(f"sync_macs_to_onus.py output:\n{result.stdout}\n{result.stderr}")
    assert result.returncode == 0, "sync_macs_to_onus.py failed"

def test_onu_import():
    """Verify that sync_onus.py correctly created NetDevice records."""
    db = SessionLocal()
    try:
        onus = db.scalars(
            select(NetDevice)
            .where(NetDevice.parent_device_id == OLT_ID)
            .where(NetDevice.device_type == "onu")
        ).all()
        
        logger.info(f"Found {len(onus)} ONUs for OLT {OLT_ID}.")
        assert len(onus) > 0, "No ONUs were imported."
        
        for onu in onus:
            assert onu.olt_port is not None, f"ONU {onu.id} is missing olt_port."
            assert onu.onu_id is not None, f"ONU {onu.id} is missing onu_id."
            assert onu.status is not None, f"ONU {onu.id} is missing status."
        
        logger.info("ONU import verification passed.")
    finally:
        db.close()

def test_customer_mapping():
    """Verify that sync_macs_to_onus.py correctly assigned CustomerDevice records."""
    db = SessionLocal()
    try:
        # Find ONUs for this OLT
        onu_ids = select(NetDevice.id).where(
            NetDevice.parent_device_id == OLT_ID,
            NetDevice.device_type == "onu"
        )
        
        # Find CustomerDevices mapped to these ONUs
        mapped_customers = db.scalars(
            select(CustomerDevice)
            .where(CustomerDevice.net_device_id.in_(onu_ids))
        ).all()
        
        logger.info(f"Found {len(mapped_customers)} CustomerDevices mapped to ONUs of OLT {OLT_ID}.")
        
        # We assume at least some devices will match, though this depends on test data
        if len(mapped_customers) == 0:
            logger.warning("No CustomerDevices mapped to ONUs. This might be correct if no MACs match.")
        
        for cust in mapped_customers:
            assert cust.net_device_id is not None
            assert cust.olt_port is None, "CustomerDevice should have olt_port cleared."
            assert cust.onu_id is None, "CustomerDevice should have onu_id cleared."
            
        logger.info("Customer mapping verification passed.")
    finally:
        db.close()

def test_hierarchy_integrity():
    """Ensure no duplicate ONUs were created and relationships are consistent."""
    db = SessionLocal()
    try:
        # Check for duplicates by (parent_device_id, olt_port, onu_id)
        duplicates = db.execute(
            select(NetDevice.olt_port, NetDevice.onu_id, func.count('*').label('cnt'))
            .where(NetDevice.parent_device_id == OLT_ID, NetDevice.device_type == "onu")
            .group_by(NetDevice.olt_port, NetDevice.onu_id)
            .having(func.count('*') > 1)
        ).all()
        
        assert len(duplicates) == 0, f"Found duplicate ONUs: {duplicates}"
        logger.info("Hierarchy integrity verification passed (no duplicates).")
    finally:
        db.close()

def test_live_endpoint():
    """Test netdevice_pon_port_view to verify it fetches and parses live data."""
    import os
    os.environ["AUTH_ENABLED"] = "false"
    
    from fastapi.testclient import TestClient
    from app.main import app
    from app.deps import verify_session
    
    # Override auth dependency for tests
    app.dependency_overrides[verify_session] = lambda: None
    
    client = TestClient(app)
    
    db = SessionLocal()
    try:
        # Find an OLT port to test
        an_onu = db.scalars(
            select(NetDevice)
            .where(NetDevice.parent_device_id == OLT_ID)
            .where(NetDevice.device_type == "onu")
        ).first()
        
        assert an_onu is not None, "Cannot test live endpoint without an ONU to determine port."
        port_to_test = an_onu.olt_port
        logger.info(f"Testing live endpoint for OLT {OLT_ID}, Port {port_to_test}...")
        
        response = client.get(f"/net-devices/{OLT_ID}/pon-port/{port_to_test}")
        assert response.status_code == 200
        assert "ID ONU" in response.text
        assert "Nazwa / Serial" in response.text
        assert "Sygnał RX" in response.text
        assert str(an_onu.onu_id) in response.text
        
        logger.info("Live endpoint test passed.")
    finally:
        db.close()
        app.dependency_overrides.clear()

if __name__ == "__main__":
    pytest.main(["-v", __file__])
