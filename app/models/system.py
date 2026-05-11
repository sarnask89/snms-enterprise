from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String, Text, Numeric, DateTime, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.common import UserRole, NumberPlanDocType

class AppSetting(Base):
    __tablename__ = "app_settings"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)

class VatRate(Base):
    __tablename__ = "vat_rates"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    rate_percent: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

class Division(Base):
    __tablename__ = "divisions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    short_name: Mapped[str | None] = mapped_column(String(32), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    city: Mapped[str | None] = mapped_column(String(128), nullable=True)
    postal_code: Mapped[str | None] = mapped_column(String(16), nullable=True)
    nip: Mapped[str | None] = mapped_column(String(20), nullable=True)
    regon: Mapped[str | None] = mapped_column(String(20), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    net_nodes: Mapped[list["NetNode"]] = relationship(back_populates="division")

class NumberPlan(Base):
    __tablename__ = "number_plans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    doc_type: Mapped[NumberPlanDocType] = mapped_column(
        Enum(NumberPlanDocType, values_callable=lambda x: [e.value for e in x]),
        default=NumberPlanDocType.invoice,
        nullable=False,
    )
    pattern_template: Mapped[str] = mapped_column(String(128), default="FV/{year}/{n}", nullable=False)
    next_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    division_id: Mapped[int | None] = mapped_column(ForeignKey("divisions.id", ondelete="SET NULL"), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    division: Mapped["Division | None"] = relationship()

class PortalUser(Base):
    __tablename__ = "portal_users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, values_callable=lambda x: [e.value for e in x]),
        default=UserRole.view,
        nullable=False,
    )
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    assigned_tickets: Mapped[list["SupportTicket"]] = relationship(
        "SupportTicket", foreign_keys="SupportTicket.assignee_id", back_populates="assignee"
    )
    staff_groups: Mapped[list["PortalUserGroup"]] = relationship(
        secondary="portal_staff_group_members", back_populates="users"
    )

class PortalUserGroup(Base):
    __tablename__ = "portal_user_groups"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    users: Mapped[list["PortalUser"]] = relationship(
        secondary="portal_staff_group_members", back_populates="staff_groups"
    )

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("portal_users.id", ondelete="SET NULL"), nullable=True)
    action: Mapped[str] = mapped_column(String(128), nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    resource_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    actor: Mapped["PortalUser | None"] = relationship()

class BackupExport(Base):
    __tablename__ = "backup_exports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    created_by_id: Mapped[int | None] = mapped_column(ForeignKey("portal_users.id", ondelete="SET NULL"), nullable=True)

class ConfigReloadLog(Base):
    __tablename__ = "config_reload_logs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("portal_users.id", ondelete="SET NULL"), nullable=True)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)

class NavMenuItem(Base):
    __tablename__ = "nav_menu_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    url_path: Mapped[str] = mapped_column(String(255), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

class RoleMenuPermission(Base):
    __tablename__ = "role_menu_permissions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, values_callable=lambda x: [e.value for e in x]), nullable=False)
    nav_item_id: Mapped[int] = mapped_column(ForeignKey("nav_menu_items.id", ondelete="CASCADE"), nullable=False)
    allowed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    nav_item: Mapped["NavMenuItem"] = relationship()
    __table_args__ = (UniqueConstraint("role", "nav_item_id", name="uq_role_nav_item"),)
