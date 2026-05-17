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

    print("\n--- Sending 'show olt mac ?' ---")
    olt_cmd_help2 = service._send_cmd(chan, "show olt mac ?", max_wait=3)
    print("\n[show olt mac ? output]:")
    print(olt_cmd_help2)

    print("\n--- Sending 'show onu mac' if 'show olt mac' is too restrictive ---")
    onu_cmd_help = service._send_cmd(chan, "show onu mac ?", max_wait=3)
    print("\n[show onu mac ? output]:")
    print(onu_cmd_help)

    client.close()
except Exception as e:
    print("Test failed:", e)
