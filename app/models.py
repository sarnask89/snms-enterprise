from __future__ import annotations

import enum
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Table,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# --- ENUMS ---

class CustomerStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    service = "service"
    view = "view"


class NodeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class TicketStatus(str, enum.Enum):
    open = "open"
    pending = "pending"
    closed = "closed"


class InvoiceStatus(str, enum.Enum):
    draft = "draft"
    issued = "issued"
    paid = "paid"


class NumberPlanDocType(str, enum.Enum):
    invoice = "invoice"
    proforma = "proforma"
    debit_note = "debit_note"
    customer = "customer"


class AccessTechnology(str, enum.Enum):
    ftth = "FTTH"
    copper = "COPPER"
    wireless = "WIFI"
    other = "OTHER"


class MessageStatus(str, enum.Enum):
    draft = "draft"
    sent = "sent"


class NetNodeLocationType(str, enum.Enum):
    basement = "basement"
    staircase = "staircase"
    floor = "floor"
    other = "other"


class NetDeviceStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"


class LedgerEntryKind(str, enum.Enum):
    debit = "debit"
    credit = "credit"


# --- MODELS ---

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
        "SupportTicket",
        foreign_keys="SupportTicket.assignee_id",
        back_populates="assignee",
    )
    staff_groups: Mapped[list["PortalUserGroup"]] = relationship(
        secondary="portal_staff_group_members",
        back_populates="users",
    )


class PortalUserGroup(Base):
    __tablename__ = "portal_user_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    users: Mapped[list["PortalUser"]] = relationship(
        secondary="portal_staff_group_members",
        back_populates="staff_groups",
    )


class VatRate(Base):
    __tablename__ = "vat_rates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(32), nullable=False)
    rate_percent: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class Tariff(Base):
    __tablename__ = "tariffs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    monthly_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    vat_rate_id: Mapped[int | None] = mapped_column(
        ForeignKey("vat_rates.id", ondelete="SET NULL"), nullable=True
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="tariff")
    vat_rate: Mapped["VatRate | None"] = relationship()

    @property
    def monthly_price_gross(self) -> Decimal:
        """Zwraca wyliczoną cenę brutto."""
        net = Decimal(str(self.monthly_price))
        if not self.vat_rate:
            return net
        rate = Decimal(str(self.vat_rate.rate_percent))
        return (net * (Decimal("1") + (rate / Decimal("100")))).quantize(Decimal("0.01"))


class LocationState(Base):
    __tablename__ = "location_states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True, unique=True)

    districts: Mapped[list["LocationDistrict"]] = relationship(back_populates="state")


class LocationDistrict(Base):
    __tablename__ = "location_districts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    state_id: Mapped[int] = mapped_column(ForeignKey("location_states.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True)

    state: Mapped["LocationState"] = relationship(back_populates="districts")
    cities: Mapped[list["LocationCity"]] = relationship(back_populates="district")


class LocationCity(Base):
    __tablename__ = "location_cities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("location_districts.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True)
    
    is_managed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    district: Mapped["LocationDistrict"] = relationship(back_populates="cities")
    streets: Mapped[list["LocationStreet"]] = relationship(
        back_populates="city", cascade="all, delete-orphan"
    )


class LocationStreet(Base):
    __tablename__ = "location_streets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    city_id: Mapped[int] = mapped_column(
        ForeignKey("location_cities.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True)

    city: Mapped["LocationCity"] = relationship(back_populates="streets")


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_code: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(128), nullable=False)
    last_name: Mapped[str] = mapped_column(String(128), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    status: Mapped[CustomerStatus] = mapped_column(
        Enum(CustomerStatus), default=CustomerStatus.active, nullable=False
    )
    creation_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    location_state_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_states.id", ondelete="SET NULL"), nullable=True
    )
    location_district_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_districts.id", ondelete="SET NULL"), nullable=True
    )
    location_city_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_cities.id", ondelete="SET NULL"), nullable=True
    )
    location_street_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_streets.id", ondelete="SET NULL"), nullable=True
    )
    street_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    apartment_number: Mapped[str | None] = mapped_column(String(32), nullable=True)

    state: Mapped["LocationState | None"] = relationship()
    district: Mapped["LocationDistrict | None"] = relationship()
    city: Mapped["LocationCity | None"] = relationship()
    street: Mapped["LocationStreet | None"] = relationship()

    groups: Mapped[list["CustomerGroup"]] = relationship(
        secondary="customer_group_members",
        back_populates="customers",
    )
    nodes: Mapped[list["Node"]] = relationship(back_populates="customer")
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="customer")
    invoices: Mapped[list["Invoice"]] = relationship(back_populates="customer")
    tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="customer")
    documents: Mapped[list["Document"]] = relationship(back_populates="customer")
    notices: Mapped[list["CustomerNotice"]] = relationship(
        back_populates="customer",
        cascade="all, delete-orphan",
    )
    owned_net_devices: Mapped[list["NetDevice"]] = relationship(
        back_populates="owner_customer",
        foreign_keys="NetDevice.customer_id",
    )


class CustomerGroup(Base):
    __tablename__ = "customer_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    customers: Mapped[list["Customer"]] = relationship(
        secondary="customer_group_members",
        back_populates="groups",
    )


class CustomerNotice(Base):
    __tablename__ = "customer_notices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(
        ForeignKey("customers.id", ondelete="CASCADE"),
        nullable=False,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str] = mapped_column(String(64), default="info", nullable=False)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    customer: Mapped["Customer"] = relationship(back_populates="notices")


class Node(Base):
    __tablename__ = "nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    hostname: Mapped[str] = mapped_column(String(255), nullable=False)
    login: Mapped[str | None] = mapped_column(String(64), nullable=True)
    passwd: Mapped[str | None] = mapped_column(String(64), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mac_address: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[NodeStatus] = mapped_column(
        Enum(NodeStatus), default=NodeStatus.active, nullable=False
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    net_device_id: Mapped[int | None] = mapped_column(
        ForeignKey("net_devices.id", ondelete="SET NULL"),
        nullable=True,
    )
    ip_network_id: Mapped[int | None] = mapped_column(
        ForeignKey("ip_networks.id", ondelete="SET NULL"),
        nullable=True,
    )

    customer: Mapped["Customer"] = relationship(back_populates="nodes")
    net_device: Mapped["NetDevice | None"] = relationship(
        back_populates="customer_nodes",
        foreign_keys=[net_device_id],
    )
    ip_network: Mapped["IpNetwork | None"] = relationship(back_populates="nodes")
    groups: Mapped[list["NodeGroup"]] = relationship(
        secondary="node_group_members",
        back_populates="nodes",
    )
    sessions: Mapped[list["NodeSession"]] = relationship(
        back_populates="node",
        cascade="all, delete-orphan",
    )
    notices: Mapped[list["NodeNotice"]] = relationship(
        back_populates="node",
        cascade="all, delete-orphan",
    )
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="node")


class NodeGroup(Base):
    __tablename__ = "node_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    nodes: Mapped[list["Node"]] = relationship(
        secondary="node_group_members",
        back_populates="groups",
    )


class NodeSession(Base):
    __tablename__ = "node_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    node_id: Mapped[int] = mapped_column(ForeignKey("nodes.id", ondelete="CASCADE"), nullable=False)
    started_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    source: Mapped[str] = mapped_column(String(32), default="manual", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    node: Mapped["Node"] = relationship(back_populates="sessions")


class NodeNotice(Base):
    __tablename__ = "node_notices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    node_id: Mapped[int] = mapped_column(ForeignKey("nodes.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    node: Mapped["Node"] = relationship(back_populates="notices")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    node_id: Mapped[int | None] = mapped_column(ForeignKey("nodes.id"), nullable=True)
    tariff_id: Mapped[int] = mapped_column(ForeignKey("tariffs.id"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    technology: Mapped[AccessTechnology] = mapped_column(
        Enum(AccessTechnology, values_callable=lambda x: [e.value for e in x]),
        default=AccessTechnology.ftth,
        nullable=False,
    )
    speed_down_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    speed_up_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)

    customer: Mapped["Customer"] = relationship(back_populates="subscriptions")
    tariff: Mapped["Tariff"] = relationship(back_populates="subscriptions")
    node: Mapped["Node | None"] = relationship(back_populates="subscriptions")


class IpNetwork(Base):
    __tablename__ = "ip_networks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    cidr: Mapped[str] = mapped_column(String(64), nullable=False)
    gateway: Mapped[str | None] = mapped_column(String(64), nullable=True)
    vlan_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    devices: Mapped[list["NetDevice"]] = relationship(back_populates="ip_network")
    nodes: Mapped[list["Node"]] = relationship(back_populates="ip_network")


class NetDevice(Base):
    __tablename__ = "net_devices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    management_ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    ip_network_id: Mapped[int | None] = mapped_column(ForeignKey("ip_networks.id"), nullable=True)
    net_node_id: Mapped[int | None] = mapped_column(ForeignKey("net_nodes.id"), nullable=True)
    
    driver_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    mgmt_username: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mgmt_password_encrypted: Mapped[str | None] = mapped_column(String(255), nullable=True)

    ip_network: Mapped["IpNetwork | None"] = relationship(back_populates="devices")
    net_node: Mapped["NetNode | None"] = relationship(back_populates="devices")
    customer_nodes: Mapped[list["Node"]] = relationship(
        back_populates="net_device",
        foreign_keys="Node.net_device_id",
    )


class NetNode(Base):
    __tablename__ = "net_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location_city_id: Mapped[int | None] = mapped_column(ForeignKey("location_cities.id"), nullable=True)
    latitude: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    longitude: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)

    devices: Mapped[list["NetDevice"]] = relationship(back_populates="net_node")


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("portal_users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus), default=TicketStatus.open, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    customer: Mapped["Customer | None"] = relationship()
    assignee: Mapped["PortalUser | None"] = relationship(back_populates="assigned_tickets")


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(
        Enum(InvoiceStatus), default=InvoiceStatus.draft, nullable=False
    )
    issue_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)

    customer: Mapped["Customer"] = relationship(back_populates="invoices")


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    doc_type: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    customer: Mapped["Customer"] = relationship(back_populates="documents")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    actor_id: Mapped[int | None] = mapped_column(ForeignKey("portal_users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    resource_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    actor: Mapped["PortalUser | None"] = relationship()


class AppSetting(Base):
    __tablename__ = "app_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)


class MessageTemplate(Base):
    __tablename__ = "message_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)


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
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    nav_item_id: Mapped[int] = mapped_column(
        ForeignKey("nav_menu_items.id", ondelete="CASCADE"),
        nullable=False,
    )
    allowed: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    nav_item: Mapped["NavMenuItem"] = relationship()

    __table_args__ = (UniqueConstraint("role", "nav_item_id", name="uq_role_nav_item"),)


class NumberPlan(Base):
    __tablename__ = "number_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    doc_type: Mapped[NumberPlanDocType] = mapped_column(
        Enum(NumberPlanDocType, values_callable=lambda x: [e.value for e in x]),
        default=NumberPlanDocType.invoice,
        nullable=False,
    )
    pattern_template: Mapped[str] = mapped_column(
        String(128), default="FV/{year}/{n}", nullable=False
    )
    next_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


# --- ASSOCIATION TABLES (RE-DEFINED AS Table OBJECTS) ---

portal_staff_group_members = Table(
    "portal_staff_group_members",
    Base.metadata,
    Column("user_id", ForeignKey("portal_users.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("portal_user_groups.id", ondelete="CASCADE"), primary_key=True),
)

customer_group_members = Table(
    "customer_group_members",
    Base.metadata,
    Column("customer_id", ForeignKey("customers.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("customer_groups.id", ondelete="CASCADE"), primary_key=True),
)

node_group_members = Table(
    "node_group_members",
    Base.metadata,
    Column("node_id", ForeignKey("nodes.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("node_groups.id", ondelete="CASCADE"), primary_key=True),
)
