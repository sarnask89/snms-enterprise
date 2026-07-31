import asyncio
import logging
import struct
import socket
from typing import Dict, List, Any, Optional

from app.database import SessionLocal
from app import models

logger = logging.getLogger("app.netflow_service")

class NetFlowV5Parser:
    """Parser for NetFlow Version 5 packets."""
    HEADER_STRUCT = struct.Struct(">HHIIIIBBH") # 24 bytes
    RECORD_STRUCT = struct.Struct(">IIIHHIIIIHHBBBBHHBBH") # 48 bytes

    @staticmethod
    def parse(data: bytes) -> List[Dict[str, Any]]:
        if len(data) < 24: return []
        
        header = NetFlowV5Parser.HEADER_STRUCT.unpack(data[:24])
        version, count, sys_uptime, unix_secs, unix_nsecs, flow_seq, engine_type, engine_id, sampling = header
        
        if version != 5: return []
        
        flows = []
        offset = 24
        for _ in range(count):
            if offset + 48 > len(data): break
            rec = NetFlowV5Parser.RECORD_STRUCT.unpack(data[offset:offset+48])
            
            # Extract basic fields: src_ip, dst_ip, src_port, dst_port, protocol, bytes, packets
            flows.append({
                "src_ip": socket.inet_ntoa(struct.pack(">I", rec[0])),
                "dst_ip": socket.inet_ntoa(struct.pack(">I", rec[1])),
                "src_port": rec[4],
                "dst_port": rec[5],
                "protocol": rec[12],
                "bytes": rec[7],
                "packets": rec[6]
            })
            offset += 48
            
        return flows

class NetFlowProtocol(asyncio.DatagramProtocol):
    def __init__(self, service: 'NetFlowService'):
        self.service = service

    def datagram_received(self, data: bytes, addr: tuple[str, int]):
        self.service.handle_packet(data, addr[0])

class NetFlowService:
    def __init__(self, host: str = "0.0.0.0", port: int = 2055):
        self.host = host
        self.port = port
        self.aggregates: Dict[tuple, Dict[str, Any]] = {}
        self.is_running = False
        self._lock = asyncio.Lock()

    async def start_collector(self):
        if self.is_running: return
        self.is_running = True
        
        loop = asyncio.get_running_loop()
        logger.info(f"Starting Robust NetFlow Collector on {self.host}:{self.port}...")
        
        try:
            self.transport, self.protocol = await loop.create_datagram_endpoint(
                lambda: NetFlowProtocol(self),
                local_addr=(self.host, self.port)
            )
        except Exception as e:
            logger.error(f"NetFlow bind error: {e}")
            self.is_running = False
            return

        asyncio.create_task(self._periodic_flush())

    def handle_packet(self, data: bytes, source_ip: str):
        if len(data) < 2: return
        version = int.from_bytes(data[0:2], byteorder='big')
        
        flows = []
        if version == 5:
            flows = NetFlowV5Parser.parse(data)
        elif version == 9:
            # Phase 2: Implement V9 parser with template support
            pass
            
        if flows:
            asyncio.create_task(self._aggregate_flows(flows, source_ip))

    async def _aggregate_flows(self, flows: List[Dict[str, Any]], source_device_ip: str):
        async with self._lock:
            for f in flows:
                # Key: (src_ip, dst_ip, src_port, dst_port, protocol)
                key = (f["src_ip"], f["dst_ip"], f["src_port"], f["dst_port"], f["protocol"])
                if key not in self.aggregates:
                    self.aggregates[key] = {
                        "src_ip": f["src_ip"],
                        "dst_ip": f["dst_ip"],
                        "src_port": f["src_port"],
                        "dst_port": f["dst_port"],
                        "protocol": f["protocol"],
                        "bytes": 0,
                        "packets": 0,
                        "src_device": source_device_ip
                    }
                self.aggregates[key]["bytes"] += f["bytes"]
                self.aggregates[key]["packets"] += f["packets"]

    async def _periodic_flush(self):
        while self.is_running:
            await asyncio.sleep(30) # Flush every 30 seconds
            if not self.aggregates: continue
            
            async with self._lock:
                to_save = list(self.aggregates.values())
                self.aggregates.clear()
            
            db = SessionLocal()
            try:
                # Find device ID if possible based on source_ip
                # (Simple lookup for now)
                
                for flow in to_save:
                    agg = models.NetFlowAggregate(
                        src_ip=flow["src_ip"],
                        dst_ip=flow["dst_ip"],
                        src_port=flow["src_port"],
                        dst_port=flow["dst_port"],
                        protocol=flow["protocol"],
                        bytes=flow["bytes"],
                        packets=flow["packets"]
                    )
                    db.add(agg)
                db.commit()
                logger.info(f"NetFlow: Flushed {len(to_save)} aggregated flows to database.")
            except Exception as e:
                logger.error(f"NetFlow DB flush error: {e}")
                db.rollback()
            finally:
                db.close()

netflow_service = NetFlowService()
