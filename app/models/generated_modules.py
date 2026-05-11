from sqlalchemy import String, Integer, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.common import Base

class OfficeEquipment(Base):
    __tablename__ = "office_equipment"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    item_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    serial_number: Mapped[str | None] = mapped_column(String(255), nullable=True)
    quantity: Mapped[int | None] = mapped_column(Integer, nullable=True)

class VehiclesCli(Base):
    __tablename__ = "vehicles_cli"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    brand: Mapped[str | None] = mapped_column(String(255), nullable=True)
    model: Mapped[str | None] = mapped_column(String(255), nullable=True)
    plate: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_available: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

class VehiclesVisual(Base):
    __tablename__ = "vehicles_visual"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    brand: Mapped[str | None] = mapped_column(String(255), nullable=True)
    model: Mapped[str | None] = mapped_column(String(255), nullable=True)
    plate: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_available: Mapped[bool | None] = mapped_column(Boolean, nullable=True)

class ExtServicesCli(Base):
    __tablename__ = "ext_services_cli"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    service_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cost: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

class ExtServicesVisual(Base):
    __tablename__ = "ext_services_visual"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    service_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cost: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

