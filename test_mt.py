import asyncio
import sys
import logging
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))

from app.services.mikrotik import MikrotikService

logging.basicConfig(level=logging.DEBUG, stream=sys.stdout)

async def run():
    print("Testing MikrotikService on HTTP...")
    mt = MikrotikService("10.0.222.86", "admin", "Loveganja151!")
    mt.base_url = "http://10.0.222.86/rest"
    leases = await mt.get_leases()
    print(f"Result: {leases}")

if __name__ == "__main__":
    asyncio.run(run())
