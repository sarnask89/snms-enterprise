from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import Integer, String, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class NetFlowAggregate(Base):
    """
    Stores aggregated NetFlow data per 5-minute interval.
    """
    __tablename__ = "netflow_aggregates"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    device_id: Mapped[int | None] = mapped_column(ForeignKey("net_devices.id"), nullable=True)
    
    src_ip: Mapped[str] = mapped_column(String(45), index=True)
    dst_ip: Mapped[str] = mapped_column(String(45), index=True)
    src_port: Mapped[int] = mapped_column(Integer)
    dst_port: Mapped[int] = mapped_column(Integer)
    protocol: Mapped[int] = mapped_column(Integer) # Protocol number (e.g., 6 for TCP)
    
    bytes: Mapped[int] = mapped_column(BigInteger, default=0)
    packets: Mapped[int] = mapped_column(BigInteger, default=0)
    
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

class NetFlowRaw(Base):
    """
    Optional: Temporary storage for raw flows before aggregation. 
    In high-traffic environments, this should be a memory buffer instead.
    """
    __tablename__ = "netflow_raw"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    raw_data: Mapped[str] = mapped_column(String) # JSON or similar
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
