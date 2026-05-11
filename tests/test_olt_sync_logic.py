import unittest
from sqlalchemy import select
from app.database import SessionLocal
from app.models import NetDevice, CustomerDevice

class TestOltSyncLogic(unittest.TestCase):
    def setUp(self):
        self.db = SessionLocal()

    def tearDown(self):
        self.db.close()

    def test_onu_import_exists(self):
        # Verify that OLT 82 has child ONUs
        stmt = select(NetDevice).where(NetDevice.parent_device_id == 82, NetDevice.device_type == "onu")
        onus = list(self.db.scalars(stmt).all())
        self.assertGreater(len(onus), 0, "No ONUs found for OLT 82 in database.")
        
        # Check for specific expected fields
        for onu in onus[:5]:
            self.assertIsNotNone(onu.olt_port)
            self.assertIsNotNone(onu.onu_id)
            self.assertIsNotNone(onu.serial_number)

    def test_customer_mapping(self):
        # Verify that at least some customers are now mapped to ONUs
        stmt = select(CustomerDevice).where(CustomerDevice.net_device_id.isnot(None))
        customer_devices = list(self.db.scalars(stmt).all())
        
        mapped_to_onu_count = 0
        for cd in customer_devices:
            # Check if parent is an ONU
            parent = self.db.get(NetDevice, cd.net_device_id)
            if parent and parent.device_type == "onu":
                mapped_to_onu_count += 1
        
        self.assertGreater(mapped_to_onu_count, 0, "No CustomerDevices are mapped to ONUs.")

if __name__ == '__main__':
    unittest.main()
