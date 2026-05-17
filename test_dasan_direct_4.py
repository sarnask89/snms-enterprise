import logging
from app.services.dasan import DasanService
import re

logging.basicConfig(level=logging.INFO, format="%(message)s")

service = DasanService(
    host="10.0.222.108",
    user="admin",
    password="dupabiskupa102",
    port=22502
)

try:
    client, chan = service._get_connection()
    service._send_cmd(chan, "terminal length 0")
    
    enable_resp = service._send_cmd(chan, "enable")
    if "Password" in enable_resp or "password" in enable_resp:
        service._send_cmd(chan, service.password)

    print("\n--- Sending 'show mac' (Filtering for CG824 or PON specific ports) ---")
    bridge_mac_out = service._send_cmd(chan, "show mac", max_wait=3)
    
    found_cg = []
    found_gpon = []
    
    for line in bridge_mac_out.splitlines():
        # Check if port looks like PON, e.g., CG824, gpon, olt
        if re.search(r'(cg|gpon|olt)', line, re.IGNORECASE):
            found_cg.append(line)
        elif re.search(r'eth', line, re.IGNORECASE):
            # Ignore standard eth for summary
            pass
        else:
             found_gpon.append(line)
             
    print("\n[Ports matching CG/GPON/OLT]:")
    print("\n".join(found_cg[:15]))
    
    print("\n[Ports matching unknown formats]:")
    print("\n".join(found_gpon[10:25])) # Skip the header lines
    
    print("\n--- Checking 'show onu active' format ---")
    onu_active_out = service._send_cmd(chan, "show onu active", max_wait=3)
    print("\n".join(onu_active_out.splitlines()[:15]))

    client.close()
except Exception as e:
    print("Test failed:", e)
