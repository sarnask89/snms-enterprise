import asyncio
import subprocess
import time
import random
from datetime import datetime, timezone
from sqlalchemy import select, func
from app.database import SessionLocal
from app.models.network import NetDevice
from app.models.monitoring import NetworkStat, SystemNotification, NvidiaGPU, NvidiaStat
from app.services.snmp_service import snmp_service
from app.services.nvidia_service import nvidia_service
import logging

logger = logging.getLogger("app.monitoring")

class MonitoringService:
    def __init__(self):
        self.db = None

    async def ping_device(self, ip: str) -> float | None:
        """Pings a device and returns latency in ms or None if unreachable."""
        if not ip:
            return None
        
        # DEMO MODE: Simulate connectivity for internal test IPs
        if ip.startswith("192.168.") or ip.startswith("10."):
            await asyncio.sleep(0.1) # Simulate network lag
            return random.uniform(1.5, 15.0)

        try:
            # Windows ping command: ping -n 1 -w 1000 IP
            process = await asyncio.create_subprocess_exec(
                "ping", "-n", "1", "-w", "1000", ip,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                # Parse latency from output (e.g., "time=12ms")
                output = stdout.decode("cp852", errors="ignore") # Polish Windows encoding
                if "time=" in output:
                    time_str = output.split("time=")[1].split("ms")[0].strip()
                    if "<" in time_str:
                        return 0.5 # Less than 1ms
                    return float(time_str)
                elif "czas=" in output: # Polish "time="
                    time_str = output.split("czas=")[1].split("ms")[0].strip()
                    if "<" in time_str:
                        return 0.5
                    return float(time_str)
            return None
        except Exception as e:
            logger.error(f"Ping failed for {ip}: {e}")
            return None

    async def check_all_devices(self):
        db = SessionLocal()
        try:
            # 1. Check Infrastructure Devices (NetDevice)
            devices = await asyncio.to_thread(
                lambda: db.scalars(select(NetDevice).where(NetDevice.status == "active")).all()
            )
            logger.info(f"Checking {len(devices)} active infrastructure devices...")
            
            infra_tasks = []
            for dev in devices:
                infra_tasks.append(self.check_single_device(db, dev))
            
            # 2. Check Customer Devices (CustomerDevice)
            from app.models.network import CustomerDevice
            cust_devices = await asyncio.to_thread(
                lambda: db.scalars(select(CustomerDevice).where(CustomerDevice.status == "active")).all()
            )
            logger.info(f"Checking {len(cust_devices)} active customer devices...")
            
            cust_tasks = []
            for cdev in cust_devices:
                cust_tasks.append(self.check_customer_device(db, cdev))

            await asyncio.gather(*(infra_tasks + cust_tasks))
            
            # 3. Check NVIDIA Infrastructure
            await self.poll_gpus(db)
            
            db.commit()
        except Exception as e:
            logger.error(f"Error in check_all_devices: {e}")
            db.rollback()
        finally:
            db.close()

    async def poll_gpus(self, db):
        """Polls local NVIDIA GPU infrastructure."""
        try:
            count = nvidia_service.get_gpu_count()
            for i in range(count):
                info = nvidia_service.get_gpu_info(i)
                if not info: continue
                
                # Upsert GPU record
                gpu = db.scalar(select(NvidiaGPU).where(NvidiaGPU.uuid == info["uuid"]))
                if not gpu:
                    gpu = NvidiaGPU(
                        name=info["name"],
                        uuid=info["uuid"],
                        vram_total_mb=info["vram_total_mb"]
                    )
                    db.add(gpu)
                    db.flush()
                
                # Poll dynamic stats
                stats = nvidia_service.get_gpu_stats(i)
                if stats:
                    db.add(NvidiaStat(
                        gpu_id=gpu.id,
                        utilization_gpu=stats["utilization_gpu"],
                        utilization_mem=stats["utilization_mem"],
                        vram_used_mb=stats["vram_used_mb"],
                        temperature=stats["temperature"],
                        power_draw_w=stats["power_draw_w"]
                    ))
            db.commit()
        except Exception as e:
            logger.error(f"Failed to poll GPUs: {e}")

    async def check_customer_device(self, db, dev):
        from app.models.monitoring import CustomerDeviceStat
        # Simulate traffic based on subscription speeds if available
        # In a real ISP, you'd poll the Mikrotik queue for this IP/MAC
        try:
            # Simple simulation: 20-80% of typical traffic
            base_in = 2000000 
            base_out = 500000
            
            stat = CustomerDeviceStat(
                device_id=dev.id,
                in_octets=int(base_in * random.uniform(0.1, 1.2)),
                out_octets=int(base_out * random.uniform(0.1, 0.5)),
                queue_name=f"queue-{dev.ip_address}"
            )
            db.add(stat)
        except Exception as e:
            logger.warning(f"Failed to poll customer device {dev.id}: {e}")

    async def check_single_device(self, db, dev: NetDevice):
        ip = dev.management_ip or dev.hostname
        if not ip:
            return

        latency = await self.ping_device(ip)
        was_online = dev.is_online
        dev.is_online = latency is not None
        dev.latency_ms = int(latency) if latency is not None else None
        dev.last_seen = datetime.now(timezone.utc)

        # Status change notification
        if was_online and not dev.is_online:
            self.create_notification(db, "critical", f"Device DOWN: {dev.name}", f"Device {dev.name} ({ip}) is not responding to ping.", "monitoring")
        elif not was_online and dev.is_online:
            self.create_notification(db, "info", f"Device UP: {dev.name}", f"Device {dev.name} ({ip}) is back online. Latency: {dev.latency_ms}ms", "monitoring")

        # NMS FRAMEWORK: Poll dynamic items
        from app.models.monitoring import MonitorItem
        items = db.scalars(
            select(MonitorItem).where(MonitorItem.device_id == dev.id, MonitorItem.is_active == True)
        ).all()
        
        for item in items:
            await self.poll_item(db, dev, item)

    async def poll_item(self, db, device, item):
        """Polls a specific MonitorItem and records history with rate calculation."""
        from app.models.monitoring import MonitorHistory
        raw_value = None
        
        try:
            if item.item_type == "ICMP":
                raw_value = await self.ping_device(device.management_ip)
            elif item.item_type == "SNMP" and item.snmp_oid:
                raw_value = await snmp_service.get_oid_value(device.management_ip, item.snmp_oid, device.snmp_community or "public")
            
            if raw_value is not None:
                final_value = float(raw_value)
                now = datetime.now(timezone.utc)
                
                # Rate calculation for Traffic (Counters)
                if item.category == "traffic" and item.last_value is not None and item.last_clock:
                    last_clock = item.last_clock
                    if last_clock.tzinfo is None:
                        last_clock = last_clock.replace(tzinfo=timezone.utc)
                    
                    time_diff = (now - last_clock).total_seconds()
                    if time_diff > 0:
                        # (current - last) / time_diff
                        delta = final_value - item.last_value
                        if delta < 0: # Counter wrapped
                            delta = final_value # Fallback for wrap in demo
                        final_value = delta / time_diff
                
                # Apply Multiplier (e.g. 8 for Octets to Bits)
                final_value = final_value * item.multiplier
                
                # Update Persistence
                item.last_value = float(raw_value)
                item.last_clock = now
                
                # Record History
                history = MonitorHistory(item_id=item.id, value=final_value)
                db.add(history)
                
                # After polling, evaluate associated triggers
                await self.evaluate_triggers(db, item, final_value)
                
        except Exception as e:
            logger.warning(f"Failed to poll item {item.key} for {device.name}: {e}")

    async def evaluate_triggers(self, db, item, value):
        """Simple trigger evaluation logic with persistence."""
        from app.models.monitoring import MonitorTrigger
        triggers = db.scalars(
            select(MonitorTrigger).where(MonitorTrigger.item_id == item.id, MonitorTrigger.is_active == True)
        ).all()
        
        for trig in triggers:
            # Very simple expression evaluation for demo: '{last()} > 90'
            expr = trig.expression.replace("{last()}", str(value))
            try:
                # Security warning: eval() is used here for simplicity in demo
                result = eval(expr, {"__builtins__": {}}, {})
                new_status = "PROBLEM" if result else "OK"
                
                if new_status != trig.last_status:
                    trig.last_status = new_status
                    trig.last_change = datetime.now()
                    trig.last_value = str(value)
                    
                    if new_status == "PROBLEM":
                        self.create_notification(db, trig.severity, f"ALARM: {trig.name}", f"Próg przekroczony dla {item.name}: {value} (Warunek: {trig.expression})", "monitoring")
                
                db.commit()
            except Exception as e:
                logger.error(f"Error evaluating trigger {trig.id}: {e}")

    def create_notification(self, db, level, title, message, source):
        from app.models.monitoring import SystemNotification
        notif = SystemNotification(
            level=level,
            title=title,
            message=message,
            source=source
        )
        db.add(notif)

    async def seed_default_items(self, db):
        """Seeds default monitoring items for devices that have none."""
        from app.models.monitoring import MonitorItem
        devices = db.scalars(select(NetDevice)).all()
        for dev in devices:
            # Check if has items
            count = db.scalar(select(func.count(MonitorItem.id)).where(MonitorItem.device_id == dev.id))
            if count == 0:
                logger.info(f"Seeding default monitoring items for {dev.name}")
                # Add CPU Load
                db.add(MonitorItem(
                    device_id=dev.id,
                    name="CPU Load",
                    key="system.cpu.load",
                    item_type="SNMP",
                    snmp_oid=".1.3.6.1.2.1.25.3.3.1.2.1",
                    delay=60
                ))
                # Add Ping
                db.add(MonitorItem(
                    device_id=dev.id,
                    name="Latency",
                    key="icmpping",
                    item_type="ICMP",
                    delay=60
                ))
        db.commit()

monitoring_service = MonitoringService()
