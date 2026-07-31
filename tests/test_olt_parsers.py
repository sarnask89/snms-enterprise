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

    def test_precompiled_patterns_dasan_service(self):
        # Verify that pre-compiled regular expressions in app.services.dasan work exactly as intended.
        from app.services.dasan import (
            ONU_ACTIVE_LINE_PATTERN,
            OLT_MAC_LINE_PATTERN,
            ONU_DETAIL_ACTIVE_PATTERN,
            BRIDGE_TABLE_LINE_PATTERN,
            ONU_LIST_LINE_PATTERN,
            MAC_TABLE_FORMAT1_PATTERN,
            MAC_TABLE_FORMAT2_PATTERN,
            ONU_DETAIL_UPTIME_PATTERN,
            ONU_SIGNAL_RX_PATTERN
        )

        # 1. ONU_ACTIVE_LINE_PATTERN
        line1 = " 1 | 5 | Active"
        m1 = ONU_ACTIVE_LINE_PATTERN.search(line1)
        self.assertIsNotNone(m1)
        self.assertEqual(m1.group(1), "1")
        self.assertEqual(m1.group(2), "5")

        # 2. OLT_MAC_LINE_PATTERN
        line2 = " 1 | 1 | 1 | 54:db:a2:11:e7:31 | 208 | 100 | dynamic"
        m2 = OLT_MAC_LINE_PATTERN.search(line2)
        self.assertIsNotNone(m2)
        self.assertEqual(m2.group(1), "1")
        self.assertEqual(m2.group(2), "1")
        self.assertEqual(m2.group(3), "54:db:a2:11:e7:31")
        self.assertEqual(m2.group(4), "100")

        # 3. ONU_DETAIL_ACTIVE_PATTERN
        line3 = " | 1 | Active |"
        m3 = ONU_DETAIL_ACTIVE_PATTERN.search(line3)
        self.assertIsNotNone(m3)
        self.assertEqual(m3.group(1), "1")
        self.assertEqual(m3.group(2), "Active")

        # 4. BRIDGE_TABLE_LINE_PATTERN
        line4 = " 100 eth04 9c:65:ee:92:ef:a1 "
        m4 = BRIDGE_TABLE_LINE_PATTERN.search(line4)
        self.assertIsNotNone(m4)
        self.assertEqual(m4.group(1), "100")
        self.assertEqual(m4.group(2), "eth04")
        self.assertEqual(m4.group(3), "9c:65:ee:92:ef:a1")

        # 5. ONU_LIST_LINE_PATTERN
        line5 = " 1 | 1 | Active | manual | DSNW12345678"
        m5 = ONU_LIST_LINE_PATTERN.search(line5)
        self.assertIsNotNone(m5)
        self.assertEqual(m5.group(1), "1")
        self.assertEqual(m5.group(2), "1")
        self.assertEqual(m5.group(3), "Active")
        self.assertEqual(m5.group(4), "DSNW12345678")

        # 6. MAC_TABLE_FORMAT1_PATTERN
        line6 = " 100 eth01 54:db:a2:12:25:f9 OK dynamic 6.89"
        m6 = MAC_TABLE_FORMAT1_PATTERN.search(line6)
        self.assertIsNotNone(m6)
        self.assertEqual(m6.group(1), "100")
        self.assertEqual(m6.group(2), "eth01")
        self.assertEqual(m6.group(3), "54:db:a2:12:25:f9")

        # 7. MAC_TABLE_FORMAT2_PATTERN
        line7 = " 1 | 5 | 14 | 00:0a:e4:cd:84:30 | 130 | 120 | dynamic"
        m7 = MAC_TABLE_FORMAT2_PATTERN.search(line7)
        self.assertIsNotNone(m7)
        self.assertEqual(m7.group(1), "00:0a:e4:cd:84:30")
        self.assertEqual(m7.group(2), "130")
        self.assertEqual(m7.group(3), "120")
        self.assertEqual(m7.group(4), "dynamic")

        # 8. ONU_DETAIL_UPTIME_PATTERN
        line8 = "    1 |   5 |   Active | manual | HALN08196530 | 3030... | 16:05:55:37"
        m8 = ONU_DETAIL_UPTIME_PATTERN.search(line8)
        self.assertIsNotNone(m8)
        self.assertEqual(m8.group(1), "Active")
        self.assertEqual(m8.group(2), "HALN08196530")
        self.assertEqual(m8.group(3), "16:05:55:37")

        # 9. ONU_SIGNAL_RX_PATTERN
        line9 = "1/1   -20.10 dBm"
        m9 = ONU_SIGNAL_RX_PATTERN.search(line9)
        self.assertIsNotNone(m9)
        self.assertEqual(m9.group(1), "-20.10 dBm")

    def test_dynamic_prefix_compilation_netdevices(self):
        import re
        # Verify the pattern logic used in app/routers/netdevices.py
        port_id = "1"
        rx_pattern = re.compile(fr"{re.escape(port_id)}/(\d+)\s+(-?\d+\.\d+\s*dBm)")

        line1 = "1/12   -18.45 dBm"
        m1 = rx_pattern.search(line1)
        self.assertIsNotNone(m1)
        self.assertEqual(m1.group(1), "12")
        self.assertEqual(m1.group(2), "-18.45 dBm")

if __name__ == '__main__':
    unittest.main()
