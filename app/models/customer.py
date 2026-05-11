from __future__ import annotations
from datetime import date, datetime, timezone
from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, String, Text, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.common import CustomerStatus

class CustomerGroup(Base):
    __tablename__ = "customer_groups"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    customers: Mapped[list["Customer"]] = relationship(
        secondary="customer_group_members", back_populates="groups"
    )

class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(128), nullable=False)
    last_name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[CustomerStatus] = mapped_column(Enum(CustomerStatus), default=CustomerStatus.active, nullable=False)
    creation_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Client Portal Credentials
    portal_login: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    portal_password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_portal_login: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    
    location_state_id: Mapped[int | None] = mapped_column(ForeignKey("location_states.id", ondelete="SET NULL"), nullable=True)
    location_district_id: Mapped[int | None] = mapped_column(ForeignKey("location_districts.id", ondelete="SET NULL"), nullable=True)
    location_city_id: Mapped[int | None] = mapped_column(ForeignKey("location_cities.id", ondelete="SET NULL"), nullable=True)
    location_street_id: Mapped[int | None] = mapped_column(ForeignKey("location_streets.id", ondelete="SET NULL"), nullable=True)
    street_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    apartment_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    
    x_1992: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    y_1992: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    state: Mapped["LocationState | None"] = relationship()
    district: Mapped["LocationDistrict | None"] = relationship()
    city: Mapped["LocationCity | None"] = relationship()
    street: Mapped["LocationStreet | None"] = relationship()
    
    groups: Mapped[list["CustomerGroup"]] = relationship(secondary="customer_group_members", back_populates="customers")
    devices: Mapped[list["CustomerDevice"]] = relationship(back_populates="customer")
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="customer")
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")
    tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="customer")
    documents: Mapped[list["Document"]] = relationship(back_populates="customer")
    notices: Mapped[list["CustomerNotice"]] = relationship(back_populates="customer", cascade="all, delete-orphan")
    owned_net_devices: Mapped[list["NetDevice"]] = relationship(
        back_populates="owner_customer", foreign_keys="NetDevice.customer_id"
    )

class CustomerNotice(Base):
    __tablename__ = "customer_notices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(64), default="info", nullable=False)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    customer: Mapped["Customer"] = relationship(back_populates="notices")

class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    file_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    customer: Mapped["Customer"] = relationship(back_populates="documents")
