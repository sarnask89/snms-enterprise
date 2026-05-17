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

    mac_to_test = "54:db:a2:12:39:91" # I picked one from the bridge table earlier
    print(f"\n--- Sending 'show mac {mac_to_test}' ---")
    bridge_mac_out = service._send_cmd(chan, f"show mac {mac_to_test}", max_wait=3)
    print(bridge_mac_out)
    
    # Try finding it globally?
    print(f"\n--- Sending 'show mac address {mac_to_test}' ---")
    bridge_mac_out2 = service._send_cmd(chan, f"show mac address {mac_to_test}", max_wait=3)
    print(bridge_mac_out2)

    print("\n--- Let's try 'show olt mac ?' again carefully ---")
    print(service._send_cmd(chan, "show olt mac ?", max_wait=2))

    client.close()
except Exception as e:
    print("Test failed:", e)
