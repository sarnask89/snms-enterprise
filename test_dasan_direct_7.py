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

    print("\n--- Sending 'show ?' ---")
    out1 = service._send_cmd(chan, "show ?", max_wait=5)
    print("OUTPUT SHOW ?:\n", out1)
    
    print("\n--- Sending 'show mac ?' ---")
    out2 = service._send_cmd(chan, "show mac ?", max_wait=3)
    print("OUTPUT SHOW MAC ?:\n", out2)

    client.close()
except Exception as e:
    print("Test failed:", e)
