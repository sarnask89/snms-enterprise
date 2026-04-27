import logging
import re
from typing import Dict, Any
from netmiko import ConnectHandler

logger = logging.getLogger(__name__)

class DasanService:
    def __init__(self, host: str, user: str, password: str):
        self.device = {
            "device_type": "dasan_nos", # Netmiko specific driver
            "host": host,
            "username": user,
            "password": password,
            "timeout": 15,
        }

    def get_onu_path(self, mac_address: str) -> Dict[str, Any]:
        """
        Lokalizuje ONU na OLT na podstawie adresu MAC.
        Zwraca: {port: str, onu_id: str, status: str}
        """
        try:
            with ConnectHandler(**self.device) as ssh:
                # DASAN V58xx command
                # Format MAC as 00:11:22:33:44:55 or 0011.2233.4455 depending on OS
                cmd = f"show gpon onu mac-address | include {mac_address}"
                output = ssh.send_command(cmd)
                
                # Przykładowy parsing (zależny od wersji NOS)
                # OLT_PORT ONU_ID MAC_ADDRESS STATUS
                # 1/1      12     00:11:22... active
                match = re.search(r"(\d+/\d+)\s+(\d+)\s+([0-9a-fA-F:]+)\s+(\w+)", output)
                if match:
                    return {
                        "port": match.group(1),
                        "onu_id": match.group(2),
                        "status": match.group(4),
                        "raw": output
                    }
                return {"error": "MAC not found on OLT", "raw": output}
        except Exception as e:
            logger.error(f"DASAN SSH error: {e}")
            return {"error": str(e)}
