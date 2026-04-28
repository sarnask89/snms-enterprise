from app.services.mikrotik import MikrotikService

class MockMikrotikService(MikrotikService):
    """A mock implementation of MikrotikService for testing."""
    def __init__(self, host="127.0.0.1", user="admin", password="password"):
        super().__init__(host, user, password)
    
    async def remote_ping(self, target: str, count: int = 4):
        return [
            {"address": target, "status": "UP", "time": "100us", "size": "56"},
            {"address": target, "status": "UP", "time": "120us", "size": "56"}
        ]

    async def get_lease_info(self, mac: str):
        return {
            "mac-address": mac,
            "address": "10.0.0.50",
            "status": "bound",
            "last-seen": "1h20m"
        }

    async def get_bridge_host_info(self, mac: str):
        return [
            {"mac-address": mac, "interface": "ether1", "bridge": "bridge1"}
        ]

    async def get_leases(self):
        return [
            {
                "id": "*1",
                "address": "10.0.0.50",
                "mac-address": "AA:BB:CC:DD:EE:FF",
                "comment": "100 Kowalski Mic1",
                "status": "bound"
            }
        ]
