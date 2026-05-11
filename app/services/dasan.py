import logging
import re
import time
import paramiko
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class DasanService:
    def __init__(self, host: str, user: str, password: str, port: int = 22502):
        self.host = host
        self.user = user
        self.password = password
        self.port = port
        self.client = None

    def _get_connection(self):
        """Tworzy interaktywną sesję SSH."""
        ssh_port = int(self.port)
        logger.error(f"DASAN: Łączenie z {self.host} na PORCIE {ssh_port}...")
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(
            hostname=self.host, 
            port=ssh_port, 
            username=self.user, 
            password=self.password, 
            look_for_keys=False, 
            allow_agent=False,
            timeout=15
        )
        chan = client.invoke_shell()
        time.sleep(1)
        return client, chan

    def _send_cmd(self, chan, cmd, wait=1, max_wait=10):
        """Wysyła komendę i czyta całe wyjście aż do pojawienia się promptu."""
        chan.send(cmd + "\n")
        time.sleep(wait)
        output = ""
        start_time = time.time()
        while time.time() - start_time < max_wait:
            if chan.recv_ready():
                chunk = chan.recv(10000).decode('utf-8', 'ignore')
                output += chunk
                # Jeśli wróciliśmy do promptu poziomu 1 lub 2, kończymy
                if "SWITCH>" in chunk or "SWITCH#" in chunk or "OLT#" in chunk:
                    break
            time.sleep(0.2)
        return output

    def get_onu_path(self, mac_address: str) -> Dict[str, Any]:
        """
        Lokalizuje ONU na OLT na podstawie adresu MAC.
        Sprawdza tabele 'show olt mac <olt_port>' dla aktywnych portów OLT, 
        a następnie zapasowo 'show mac' (Bridge).
        """
        try:
            client, chan = self._get_connection()
            self._send_cmd(chan, "terminal length 0")
            
            # Przejdź w enable (Poziom 2)
            enable_resp = self._send_cmd(chan, "enable")
            if "Password" in enable_resp or "password" in enable_resp:
                self._send_cmd(chan, self.password)
            
            # Standaryzacja MAC (xx:xx:xx...)
            mac_formatted = mac_address.lower().replace("-", ":").replace(".", ":")
            
            # 1. Pobierz aktywne porty OLT z 'show onu active'
            logger.info(f"DASAN: Gathering active OLT ports...")
            onu_active_raw = self._send_cmd(chan, "show onu active", max_wait=10)
            active_olt_ports = set()
            
            for line in onu_active_raw.splitlines():
                # Szukamy linii: OLT | ONU | STATUS ... np. " 1 | 5 | Active"
                match = re.search(r"^\s*(\d+)\s*\|\s*(\d+)\s*\|", line)
                if match:
                    active_olt_ports.add(match.group(1))

            # 2. Szukanie w tablicy GPON dla każdego aktywnego portu OLT
            logger.info(f"DASAN: Searching GPON MAC tables on ports {active_olt_ports} for {mac_formatted}")
            for olt_port in active_olt_ports:
                output_olt = self._send_cmd(chan, f"show olt mac {olt_port}", max_wait=15)
                
                for line in output_olt.splitlines():
                    if mac_formatted in line.lower():
                        logger.error(f"DASAN: Found in OLT {olt_port} MAC table: {line.strip()}")
                        # Format: no. | OLT | ONU | MAC ADDRESS | GEM ID | VID | Status
                        # Przykład: 1 | 1 | 1 | 54:db:a2:11:e7:31 | 208 | 100 | dynamic
                        match = re.search(r"^\s*\d+\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*([0-9a-fA-F:]{17})\s*\|\s*\d+\s*\|\s*(\d+)", line)
                        if match:
                            found_olt_port = match.group(1)
                            onu_id = match.group(2)
                            vid = match.group(4)
                            
                            # Pobierz status konkretnego ONU
                            status = "active (GPON)"
                            onu_detail_raw = self._send_cmd(chan, f"show onu active {found_olt_port}")
                            for s_line in onu_detail_raw.splitlines():
                                if f"| {onu_id} |" in s_line:
                                    s_match = re.search(r"\|\s*(\d+)\s*\|\s*(\w+)\s*\|", s_line)
                                    if s_match:
                                        status = s_match.group(2)
                                        break
                            
                            client.close()
                            return {
                                "port": f"PON {found_olt_port}",
                                "onu_id": onu_id,
                                "status": status,
                                "vid": vid
                            }

            # 3. FALLBACK: SZUKANIE W TABLICY MOSTKA (BRIDGE)
            logger.info(f"DASAN: MAC {mac_formatted} not found in GPON, searching bridge table.")
            output_br = self._send_cmd(chan, "show mac", max_wait=20)
            client.close()
            
            lines = output_br.splitlines()
            for line in lines:
                if mac_formatted in line.lower():
                    logger.error(f"DASAN: Found in Bridge Table: {line.strip()}")
                    # Format: 100 eth04 9c:65:ee:92:ef:a1
                    match_data = re.search(r"^\s*(\d+)\s+([a-zA-Z0-9/]+)\s+([0-9a-fA-F:]+)", line)
                    if match_data:
                        return {
                            "port": match_data.group(2),
                            "onu_id": "?", 
                            "status": "active (bridge table)",
                            "vid": match_data.group(1)
                        }
            
            # Jeśli regex nie złapał, ale linia zawiera MAC, spróbujmy split()
            for line in lines:
                if mac_formatted in line.lower():
                    parts = line.split()
                    if len(parts) >= 3:
                        return {
                            "port": parts[1],
                            "onu_id": "?",
                            "status": "active (bridge - fallback)",
                            "vid": parts[0]
                        }

            return {"error": f"MAC {mac_formatted} nie został znaleziony na OLT."}
        except Exception as e:
            logger.error(f"DASAN Search Error on {self.host}: {e}")
            return {"error": str(e)}

    def get_onu_and_macs(self) -> Dict[str, Any]:
        """Pobiera listę ONU oraz tablicę MAC z OLT."""
        try:
            client, chan = self._get_connection()
            
            # 1. Wyłącz paginację (działa na poziomie 1)
            self._send_cmd(chan, "terminal length 0")
            
            # 2. Pobierz ONU (Poziom 1)
            onu_raw = self._send_cmd(chan, "show onu active")
            
            # 3. Wejdź w enable (Poziom 2)
            enable_resp = self._send_cmd(chan, "enable")
            if "Password" in enable_resp or "password" in enable_resp:
                self._send_cmd(chan, self.password) # Zakładamy to samo hasło dla enable
            
            # 4. Pobierz MAC (Poziom 2)
            mac_raw = self._send_cmd(chan, "show mac")
            
            client.close()
            
            return {
                "onu_list": self._parse_onu(onu_raw),
                "mac_table": self._parse_macs(mac_raw)
            }
            
        except Exception as e:
            logger.error(f"DasanService Error on {self.host}: {e}")
            return {"error": str(e)}

    def _parse_onu(self, raw: str) -> List[Dict[str, str]]:
        """Parsuje tabelę show onu active."""
        onus = []
        # Szukamy linii typu: 1 | 1 | Active | manual | DSNW...
        lines = raw.splitlines()
        for line in lines:
            match = re.search(r"^\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)\s*\|\s*\w+\s*\|\s*(\w+)", line)
            if match:
                onus.append({
                    "olt": match.group(1),
                    "onu_id": match.group(2),
                    "status": match.group(3),
                    "sn": match.group(4)
                })
        return onus

    def _parse_macs(self, raw: str) -> List[Dict[str, str]]:
        """Parsuje tabelę show mac oraz show olt mac."""
        macs = []
        lines = raw.splitlines()
        for line in lines:
            # Format 1 (show mac): 100 eth01 54:db:a2:12:25:f9 OK dynamic 6.89
            match1 = re.search(r"^\s*(\d+)\s+(eth\d+)\s+([0-9a-fA-F:]{17})", line)
            if match1:
                macs.append({
                    "vid": match1.group(1),
                    "port": match1.group(2),
                    "mac": match1.group(3),
                    "status": "dynamic"
                })
                continue
                
            # Format 2 (show olt mac): 1 | 5 | 14 | 00:0a:e4:cd:84:30 | 130 | 120 | dynamic
            match2 = re.search(r"^\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*([0-9a-fA-F:]{17})\s*\|\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(\w+)", line)
            if match2:
                macs.append({
                    "mac": match2.group(1),
                    "gem_id": match2.group(2),
                    "vid": match2.group(3),
                    "status": match2.group(4)
                })
        return macs

    def get_onu_details(self, olt_port: str, onu_id: str) -> Dict[str, Any]:
        """Pobiera szczegóły ONU (status, serial, uptime, signal, ip na VLAN 400)"""
        details = {
            "status": "Unknown",
            "serial": "Unknown",
            "uptime": "Unknown",
            "signal_rx": "Unknown",
            "ip_vlan400": "Unknown"
        }
        try:
            client, chan = self._get_connection()
            self._send_cmd(chan, "terminal length 0")
            enable_resp = self._send_cmd(chan, "enable")
            if "Password" in enable_resp or "password" in enable_resp:
                self._send_cmd(chan, self.password)

            # 1. Pobierz Serial i Uptime
            out_active = self._send_cmd(chan, f"show onu active {olt_port}", max_wait=3)
            for line in out_active.splitlines():
                if f"| {onu_id} |" in line:
                    match = re.search(r"\|\s*\d+\s*\|\s*(\w+)\s*\|\s*\w+\s*\|\s*(\w+)\s*\|[^\|]+\|\s*([0-9:]+)", line)
                    if match:
                        details["status"] = match.group(1)
                        details["serial"] = match.group(2)
                        details["uptime"] = match.group(3)
                    break

            # 2. Pobierz sygnał optyczny (Rx Power)
            out_power = self._send_cmd(chan, f"show olt rx-power {olt_port} {onu_id}", max_wait=3)
            for line in out_power.splitlines():
                # Format: 1/1   -20.10 dBm
                if f"{olt_port}/{onu_id}" in line:
                    p_match = re.search(r"(-?\d+\.\d+\s*dBm)", line)
                    if p_match:
                        details["signal_rx"] = p_match.group(1)
                    break
                    
            # 3. Pobierz IP na VLAN 400 (Management) z arp / dhcp lub komendy ping/mac
            # Ponieważ management IP dla ONU w Dasan jest często w interfejsie mgmt 
            # Sprawdźmy `show onu ip-host` (jesli wspierane) lub po prostu wyciagnijmy z tablicy ARP
            # Dla pewności odpytujemy bridge/arp
            out_arp = self._send_cmd(chan, f"show arp", max_wait=5)
            # Szukamy adresu IP przypisanego do VLAN 400 dla tego konkretnego portu OLT/ONU
            # Może to byc trudne bez znajomości MACu urzadzenia, ale mozemy pobrac mac managementu
            
            # Najlepiej jednak pobrać z `show onu ip-host {olt_port} {onu_id}` jesli to mozliwe.
            # Alternatywa to wyświetlenie MACu przypisanego do VLAN 400 z tablicy "show olt mac".
            
            client.close()
        except Exception as e:
            logger.error(f"Error getting ONU details: {e}")
            
        return details
        
    def get_onu_macs(self, olt_port: str, onu_id: str) -> List[Dict[str, str]]:
        """Pobiera adresy MAC widoczne za konkretnym ONU (Poziom 2)."""
        try:
            client, chan = self._get_connection()
            self._send_cmd(chan, "terminal length 0")
            
            # Przejdź w enable
            enable_resp = self._send_cmd(chan, "enable")
            if "Password" in enable_resp or "password" in enable_resp:
                self._send_cmd(chan, self.password)
            
            # Wykonaj precyzyjne zapytanie
            cmd = f"show olt mac {olt_port} {onu_id}"
            raw = self._send_cmd(chan, cmd)
            client.close()
            
            # Parsowanie precyzyjnego wyjścia
            return self._parse_macs(raw)
        except Exception as e:
            logger.error(f"Error querying ONU {olt_port}/{onu_id}: {e}")
            return []
