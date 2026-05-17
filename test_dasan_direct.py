import logging
from app.services.dasan import DasanService

# Set up basic logging to see debug/error output from DasanService
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

service = DasanService(
    host="10.0.222.108",
    user="admin",
    password="dupabiskupa102",
    port=22502
)

print("--- Testing Connection and Raw Commands ---")
try:
    client, chan = service._get_connection()
    service._send_cmd(chan, "terminal length 0")
    
    enable_resp = service._send_cmd(chan, "enable")
    if "Password" in enable_resp or "password" in enable_resp:
        service._send_cmd(chan, service.password)
        
    print("Sending 'show olt mac'...")
    olt_mac_out = service._send_cmd(chan, "show olt mac", max_wait=5)
    print("Output (first 1000 chars):\n", olt_mac_out[:1000])
    
    client.close()
except Exception as e:
    print("Raw command test failed:", e)

print("\n--- Testing get_onu_and_macs() ---")
result = service.get_onu_and_macs()
if "error" in result:
    print("ERROR:", result["error"])
else:
    onu_list = result.get('onu_list', [])
    mac_table = result.get('mac_table', [])
    print(f"Found {len(onu_list)} ONUs.")
    print(f"Found {len(mac_table)} MACs.")
    
    if onu_list:
        print("\nSample ONU:", onu_list[0])
    if mac_table:
        print("Sample MAC:", mac_table[0])
