import asyncio
import logging
from sqlalchemy import select
from app.database import SessionLocal
from app import models

logger = logging.getLogger("sync_service")

class SyncService:
    def __init__(self):
        self._running = False
        self._task = None

    async def start(self):
        if self._running:
            return
        self._running = True
        self._task = asyncio.create_task(self._loop())
        logger.info("SyncService started")

    async def stop(self):
        self._running = False
        if self._task:
            self._task.cancel()
            try:
                await self._task
            except asyncio.CancelledError:
                pass
        logger.info("SyncService stopped")

    async def _loop(self):
        while self._running:
            try:
                await self.perform_sync()
            except Exception as e:
                logger.error(f"Sync error: {e}")
            await asyncio.sleep(600) # Sync every 10 minutes

    async def perform_sync(self):
        logger.info("Starting background network synchronization...")
        db = SessionLocal()
        try:
            # 1. Get all devices with Mikrotik driver
            devices = db.scalars(select(models.NetDevice).where(models.NetDevice.driver_type == "mikrotik_v7")).all()
            
            from app.services.mikrotik_discovery import get_discoverable_leases
            
            for device in devices:
                try:
                    logger.info(f"Syncing device: {device.name} ({device.management_ip})")
                    leases = await get_discoverable_leases(db, device)
                    
                    # For automated sync, we don't necessarily want to AUTO-IMPORT 
                    # if the comment is missing or we don't have enough info.
                    # get_discoverable_leases already has some auto-import logic.
                    
                    # We can also update 'last_seen' here if we had the column.
                    # Since we don't have 'last_seen' yet, we just rely on get_discoverable_leases
                    # which already handles matching and basic updates.
                    
                    logger.info(f"Sync completed for {device.name}. {len(leases)} potential new leases found.")
                except Exception as e:
                    logger.error(f"Failed to sync device {device.name}: {e}")
            
            from app.services.snmp_service import snmp_service
            await snmp_service.poll_all_devices()
            
            db.commit()
        except Exception as e:
            logger.error(f"Global sync error: {e}")
            db.rollback()
        finally:
            db.close()

sync_service = SyncService()
