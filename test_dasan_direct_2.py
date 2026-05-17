import logging
from app.services.dasan import DasanService

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
        
    print("\n--- Sending 'show mac' (Bridge Table) ---")
    bridge_mac_out = service._send_cmd(chan, "show mac", max_wait=3)
    print("\n[show mac output - First 10 lines]:")
    print("\n".join(bridge_mac_out.splitlines()[:10]))

    print("\n--- Sending 'show mac gpon' or 'show olt ?' ---")
    olt_cmd_help = service._send_cmd(chan, "show olt ?", max_wait=2)
    print("\n[show olt ? output]:")
    print(olt_cmd_help)
    
    client.close()
except Exception as e:
    print("Test failed:", e)
