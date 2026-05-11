from datetime import datetime
from sqlalchemy import String, Integer, Boolean, Text, DateTime, ForeignKey, BigInteger, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.models.common import Base

class NetworkLink(Base):
    __tablename__ = "network_links"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    link_type: Mapped[str] = mapped_column(String(50)) # Fiber, Radio, Copper
    capacity_mbps: Mapped[int] = mapped_column(Integer)
    source_device_id: Mapped[int | None] = mapped_column(ForeignKey("net_devices.id"))
    target_device_id: Mapped[int | None] = mapped_column(ForeignKey("net_devices.id"))
    
    source_port: Mapped[str | None] = mapped_column(String(50))
    target_port: Mapped[str | None] = mapped_column(String(50))

class NetworkStat(Base):
    __tablename__ = "network_stats"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("net_devices.id"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    cpu_usage: Mapped[int | None] = mapped_column(Integer)
    mem_usage: Mapped[int | None] = mapped_column(Integer)
    in_octets: Mapped[int | None] = mapped_column(BigInteger)
    out_octets: Mapped[int | None] = mapped_column(BigInteger)
    
    interface_name: Mapped[str | None] = mapped_column(String(100))

class MonitorTemplate(Base):
    __tablename__ = "monitor_templates"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    is_interface_template: Mapped[bool] = mapped_column(Boolean, default=False)

class MonitorItem(Base):
    __tablename__ = "monitor_items"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    template_id: Mapped[int | None] = mapped_column(ForeignKey("monitor_templates.id", ondelete="CASCADE"))
    device_id: Mapped[int | None] = mapped_column(ForeignKey("net_devices.id", ondelete="CASCADE"))
    
    name: Mapped[str] = mapped_column(String(100))
    key: Mapped[str] = mapped_column(String(100)) # e.g. 'snmp.cpu.load'
    item_type: Mapped[str] = mapped_column(String(20)) # ICMP, SNMP, API, AGENT
    snmp_oid: Mapped[str | None] = mapped_column(String(255))
    delay: Mapped[int] = mapped_column(Integer, default=60) # Interval in seconds
    value_type: Mapped[str] = mapped_column(String(20), default="float") # float, int, str
    unit: Mapped[str | None] = mapped_column(String(20)) # e.g. 'bps', '%', 'C'
    multiplier: Mapped[float] = mapped_column(Float, default=1.0)
    
    interface_name: Mapped[str | None] = mapped_column(String(100))
    interface_index: Mapped[int | None] = mapped_column(Integer)
    category: Mapped[str] = mapped_column(String(50), default="system") # traffic, system, env
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Persistence for rate calculation (Counters to Gauges)
    last_value: Mapped[float | None] = mapped_column(Float)
    last_clock: Mapped[datetime | None] = mapped_column(DateTime)

class MonitorTrigger(Base):
    __tablename__ = "monitor_triggers"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("monitor_items.id", ondelete="CASCADE"))
    name: Mapped[str] = mapped_column(String(200))
    expression: Mapped[str] = mapped_column(String(500)) # e.g. '{last()} > 90'
    severity: Mapped[str] = mapped_column(String(20), default="warning") # info, warning, average, high, disaster
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_status: Mapped[str] = mapped_column(String(20), default="OK") # OK, PROBLEM
    last_change: Mapped[datetime | None] = mapped_column(DateTime)
    last_value: Mapped[str | None] = mapped_column(String(100))

class MonitorHistory(Base):
    __tablename__ = "monitor_history"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("monitor_items.id", ondelete="CASCADE"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    value: Mapped[float] = mapped_column(Float)

class SystemNotification(Base):
    __tablename__ = "system_notifications"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    level: Mapped[str] = mapped_column(String(20), default="info") # info, warning, critical
    title: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    source: Mapped[str | None] = mapped_column(String(50)) # monitoring, system, billing

class CustomerDeviceStat(Base):
    __tablename__ = "customer_device_stats"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("customer_devices.id", ondelete="CASCADE"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    in_octets: Mapped[int | None] = mapped_column(BigInteger)
    out_octets: Mapped[int | None] = mapped_column(BigInteger)
    queue_name: Mapped[str | None] = mapped_column(String(100))

class NvidiaGPU(Base):
    __tablename__ = "nvidia_gpus"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    uuid: Mapped[str] = mapped_column(String(100), unique=True)
    vram_total_mb: Mapped[int] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class NvidiaStat(Base):
    __tablename__ = "nvidia_stats"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    gpu_id: Mapped[int] = mapped_column(ForeignKey("nvidia_gpus.id", ondelete="CASCADE"))
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    utilization_gpu: Mapped[int] = mapped_column(Integer) # %
    utilization_mem: Mapped[int] = mapped_column(Integer) # %
    vram_used_mb: Mapped[int] = mapped_column(Integer)
    temperature: Mapped[int] = mapped_column(Integer) # C
    power_draw_w: Mapped[float] = mapped_column(Float)
