import asyncio
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.monitoring_service import monitoring_service
from app.services.netflow_service import netflow_service
from app.database import SessionLocal
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("monitoring_daemon")

async def main():
    logger.info("Starting Monitoring Daemon...")
    
    # Start NetFlow Collector in the background
    asyncio.create_task(netflow_service.start_collector())
    
    while True:
        try:
            db = SessionLocal()
            # Seed default items for existing devices
            await monitoring_service.seed_default_items(db)
            db.close()
            
            await monitoring_service.check_all_devices()
        except Exception as e:
            logger.error(f"Daemon loop error: {e}")
        
        logger.info("Waiting 60 seconds for next poll...")
        await asyncio.sleep(60)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Daemon stopped.")
