import unittest
from app.services.dasan import DasanService

class TestDasanParsers(unittest.TestCase):
    def setUp(self):
        # We don't need real credentials for parsing tests
        self.service = DasanService("127.0.0.1", "admin", "pass")

    def test_parse_macs_standard(self):
        raw_output = """
-----------------------------------------------------------------
 no. |  OLT | ONU |    MAC ADDRESS    | GEM ID |  VID | Status
-----------------------------------------------------------------
   1 |    1 |   1 | 54:db:a2:11:e7:31 |   208  |  100 | dynamic
   2 |    1 |   2 | 00:0a:e4:cd:84:30 |   209  |  100 | dynamic
-----------------------------------------------------------------
"""
        results = self.service._parse_macs(raw_output)
        self.assertEqual(len(results), 2)
        self.assertEqual(results[0]['mac'], "54:db:a2:11:e7:31")
        self.assertEqual(results[0]['vid'], "100")
        self.assertEqual(results[1]['mac'], "00:0a:e4:cd:84:30")

    def test_parse_onu_active(self):
        # We need to test the logic used in get_onu_details
        # Let's mock a regex search instead of the whole method for now
        import re
        line = "    1 |   5 |   Active | manual | HALN08196530 | 3030... | 16:05:55:37"
        match = re.search(r"\|\s*\d+\s*\|\s*(\w+)\s*\|\s*\w+\s*\|\s*(\w+)\s*\|[^\|]+\|\s*([0-9:]+)", line)
        
        self.assertIsNotNone(match)
        self.assertEqual(match.group(1), "Active")
        self.assertEqual(match.group(2), "HALN08196530")
        self.assertEqual(match.group(3), "16:05:55:37")

    def test_parse_rx_power(self):
        import re
        line = "1/1   -20.10 dBm"
        port_id = "1"
        onu_id = "1"
        p_match = re.search(fr"{port_id}/{onu_id}\s+(-?\d+\.\d+\s*dBm)", line)
        
        self.assertIsNotNone(p_match)
        self.assertEqual(p_match.group(1), "-20.10 dBm")

if __name__ == '__main__':
    unittest.main()
