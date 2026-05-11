import asyncio
import socket
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any
import json

from netflow.v5 import V5Header, V5Record
from netflow.v9 import V9Header, V9Record
from netflow.collector import Collector

from app.database import SessionLocal
from app import models

logger = logging.getLogger("netflow_service")

class NetFlowService:
    def __init__(self, host: str = "0.0.0.0", port: int = 2055):
        self.host = host
        self.port = port
        self.buffer: List[Dict[str, Any]] = []
        self.is_running = False
        self._lock = asyncio.Lock()

    async def start_collector(self):
        """
        Starts the UDP NetFlow collector.
        """
        if self.is_running:
            return
        
        self.is_running = True
        logger.info(f"Starting NetFlow Collector on {self.host}:{self.port}...")
        
        # Create UDP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setblocking(False)
        try:
            sock.bind((self.host, self.port))
        except Exception as e:
            logger.error(f"Failed to bind NetFlow port {self.port}: {e}")
            self.is_running = False
            return

        loop = asyncio.get_running_loop()
        
        # Start the flushing task
        asyncio.create_task(self._periodic_flush())

        while self.is_running:
            try:
                data, addr = await loop.sock_recvfrom(sock, 4096)
                await self._process_packet(data, addr[0])
            except Exception as e:
                if self.is_running:
                    logger.error(f"Error receiving NetFlow packet: {e}")
                await asyncio.sleep(0.1)

    async def _process_packet(self, data: bytes, source_ip: str):
        """
        Parses NetFlow packet and adds to buffer.
        """
        try:
            # We use a simple strategy: try to identify version from header
            # NetFlow v5 is 24 bytes header + records
            # NetFlow v9 is more complex (templates)
            
            # For Phase 1, we log basic stats and add to buffer
            async with self._lock:
                self.buffer.append({
                    "source_device": source_ip,
                    "raw_len": len(data),
                    "received_at": datetime.now(timezone.utc).isoformat()
                })
                
                # If buffer is too large, drop oldest
                if len(self.buffer) > 1000:
                    self.buffer.pop(0)
                    
        except Exception as e:
            logger.error(f"Failed to process NetFlow packet from {source_ip}: {e}")

    async def _periodic_flush(self):
        """
        Periodically flushes the memory buffer to the database.
        """
        while self.is_running:
            await asyncio.sleep(60) # Flush every minute
            
            if not self.buffer:
                continue
                
            async with self._lock:
                to_save = self.buffer.copy()
                self.buffer.clear()
                
            logger.info(f"Flushing {len(to_save)} flows to database...")
            
            db = SessionLocal()
            try:
                for flow in to_save:
                    # In Phase 1, we store raw metadata in NetFlowRaw
                    raw_entry = models.NetFlowRaw(
                        raw_data=json.dumps(flow)
                    )
                    db.add(raw_entry)
                db.commit()
            except Exception as e:
                logger.error(f"Failed to save flows to DB: {e}")
                db.rollback()
            finally:
                db.close()

netflow_service = NetFlowService()
