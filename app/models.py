from __future__ import annotations

import enum
from datetime import date, datetime, timezone

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

customer_group_member = Table(
    "customer_group_members",
    Base.metadata,
    Column("customer_id", ForeignKey("customers.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("customer_groups.id", ondelete="CASCADE"), primary_key=True),
)


class CustomerStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class InvoiceStatus(str, enum.Enum):
    draft = "draft"
    issued = "issued"
    paid = "paid"


class InvoiceDocumentKind(str, enum.Enum):
    """Rodzaj dokumentu sprzedaży (moduł finansów SNMS)."""

    invoice = "invoice"
    proforma = "proforma"
    debit_note = "debit_note"


class NumberPlanDocType(str, enum.Enum):
    """Do jakich dokumentów pasuje plan numeracji."""

    invoice = "invoice"
    proforma = "proforma"
    debit_note = "debit_note"
    customer = "customer"


class TicketStatus(str, enum.Enum):
    open = "open"
    pending = "pending"
    closed = "closed"


class NodeStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"


class NetNodeLocationType(str, enum.Enum):
    """Miejsce instalacji w obrębie budynku (uzupełnienie adresu TERYT)."""

    basement = "basement"
    staircase = "staircase"
    floor = "floor"
    other = "other"


class NetDeviceStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"


class UserRole(str, enum.Enum):
    """Grupy użytkowników portalu (uprawnienia + widoczność menu)."""

    admin = "admin"
    manager = "manager"
    service = "service"
    view = "view"


class LedgerEntryKind(str, enum.Enum):
    debit = "debit"
    credit = "credit"


class AccessTechnology(str, enum.Enum):
    """Technologie dostępu do internetu (raportowanie UKE)."""

    ftth = "FTTH"
    hfc = "HFC"
    adsl = "ADSL"
    ethernet = "Ethernet"
    wireless = "Wireless"
    copper = "Copper"
    other = "Other"


class MessageStatus(str, enum.Enum):
    draft = "draft"
    sent = "sent"


class CustomerGroup(Base):
    __tablename__ = "customer_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    customers: Mapped[list["Customer"]] = relationship(
        secondary=customer_group_member,
        back_populates="groups",
    )


class LocationState(Base):
    __tablename__ = "location_states"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True, unique=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    districts: Mapped[list["LocationDistrict"]] = relationship(back_populates="state")


class LocationDistrict(Base):
    __tablename__ = "location_districts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    state_id: Mapped[int] = mapped_column(ForeignKey("location_states.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True) # Kod powiatu (część TERC)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    state: Mapped["LocationState"] = relationship(back_populates="districts")
    cities: Mapped[list["LocationCity"]] = relationship(back_populates="district")


class LocationCity(Base):
    __tablename__ = "location_cities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("location_districts.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True) # Kod SIMC
    commune_code: Mapped[str | None] = mapped_column(String(8), nullable=True) # Gmi
    commune_type: Mapped[str | None] = mapped_column(String(4), nullable=True) # Rodz
    
    # Zarządzanie miastem (moduł adresowy)
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
    teryt_code: Mapped[str | None] = mapped_column(String(16), nullable=True) # Kod ULIC

    city: Mapped["LocationCity"] = relationship(back_populates="streets")


class Customer(Base):
    __tablename__ = "customers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False)
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
        secondary=customer_group_member,
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


class Tariff(Base):
    __tablename__ = "tariffs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    monthly_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="tariff")


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

    @property
    def active(self) -> bool:
        return self.status == NodeStatus.active
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
        foreign_keys="Node.net_device_id",
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


node_group_member = Table(
    "node_group_members",
    Base.metadata,
    Column("node_id", ForeignKey("nodes.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("node_groups.id", ondelete="CASCADE"), primary_key=True),
)


class NodeGroup(Base):
    __tablename__ = "node_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    nodes: Mapped[list["Node"]] = relationship(
        secondary=node_group_member,
        back_populates="groups",
    )


class NodeSession(Base):
    """Rejestracja sesji węzła (ręczna lub z importu — encja w bazie, bez placeholdera)."""

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
    """Przypisanie abonenta do taryfy (abonament SNMS)."""

    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    tariff_id: Mapped[int] = mapped_column(ForeignKey("tariffs.id"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    end_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # UKE / PIT fields
    technology: Mapped[AccessTechnology] = mapped_column(
        Enum(AccessTechnology, values_callable=lambda x: [e.value for e in x]),
        default=AccessTechnology.ftth,
        nullable=False,
    )
    speed_down_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    speed_up_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)

    customer: Mapped["Customer"] = relationship(back_populates="subscriptions")
    tariff: Mapped["Tariff"] = relationship(back_populates="subscriptions")


class Division(Base):
    """Oddział / firma wystawcy (SNMS)."""

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


class NetNode(Base):
    """Punkt infrastruktury / miejsce instalacji (tabela `netnodes`)."""

    __tablename__ = "net_nodes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    division_id: Mapped[int | None] = mapped_column(
        ForeignKey("divisions.id", ondelete="SET NULL"),
        nullable=True,
    )
    location_state_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_states.id", ondelete="SET NULL"),
        nullable=True,
    )
    location_district_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_districts.id", ondelete="SET NULL"),
        nullable=True,
    )
    location_city_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_cities.id", ondelete="SET NULL"),
        nullable=True,
    )
    location_street_id: Mapped[int | None] = mapped_column(
        ForeignKey("location_streets.id", ondelete="SET NULL"),
        nullable=True,
    )
    street_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    location_detail: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location_type: Mapped[NetNodeLocationType] = mapped_column(
        Enum(NetNodeLocationType, values_callable=lambda x: [e.value for e in x]),
        default=NetNodeLocationType.other,
        nullable=False,
    )
    latitude: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    longitude: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    info: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Pola techniczne PIT / PUE / SIDUSIS
    node_type: Mapped[str | None] = mapped_column(String(64), nullable=True) # szafa, kontener, budynek
    owner_type: Mapped[str | None] = mapped_column(String(64), nullable=True) # własny, dzierżawiony
    sidusis_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    has_power: Mapped[bool] = mapped_column(Boolean, default=False)
    has_env_control: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # UKE / PIT detail
    uke_node_kind: Mapped[str | None] = mapped_column(String(64), nullable=True) # szkieletowy, dystrybucyjny, dostępowy
    uke_access_rules: Mapped[str | None] = mapped_column(String(64), nullable=True) # otwarty, płatny, brak

    division: Mapped["Division | None"] = relationship(back_populates="net_nodes")
    devices: Mapped[list["NetDevice"]] = relationship(back_populates="net_node")
    
    # Relacje połączeń
    outgoing_links: Mapped[list["NetNodeLink"]] = relationship(
        "NetNodeLink", 
        foreign_keys="[NetNodeLink.source_node_id]",
        back_populates="source_node"
    )
    incoming_links: Mapped[list["NetNodeLink"]] = relationship(
        "NetNodeLink", 
        foreign_keys="[NetNodeLink.target_node_id]",
        back_populates="target_node"
    )


class NetNodeLink(Base):
    """Połączenia między węzłami (Medium transmisyjne UKE/PIT)."""

    __tablename__ = "net_node_links"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_node_id: Mapped[int] = mapped_column(ForeignKey("net_nodes.id", ondelete="CASCADE"))
    target_node_id: Mapped[int] = mapped_column(ForeignKey("net_nodes.id", ondelete="CASCADE"))
    
    medium_type: Mapped[str] = mapped_column(String(32), default="Fiber") # Fiber, Radio, Copper
    capacity_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    distance_m: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    info: Mapped[str | None] = mapped_column(String(255), nullable=True)

    source_node: Mapped["NetNode"] = relationship("NetNode", foreign_keys=[source_node_id], back_populates="outgoing_links")
    target_node: Mapped["NetNode"] = relationship("NetNode", foreign_keys=[target_node_id], back_populates="incoming_links")


class NetworkHost(Base):
    """Host rozdzielczy dla puli IP (tabela `hosts`; powiązanie `networks.hostid`)."""

    __tablename__ = "network_hosts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)

    ip_networks: Mapped[list["IpNetwork"]] = relationship(back_populates="network_host")


class NetDeviceProducer(Base):
    """Producenci urządzeń (`netdeviceproducers`)."""

    __tablename__ = "net_device_producers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    alternative_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    models: Mapped[list["NetDeviceModel"]] = relationship(back_populates="producer")


class NetDeviceType(Base):
    """Typy urządzeń (`netdevicetypes`)."""

    __tablename__ = "net_device_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    models: Mapped[list["NetDeviceModel"]] = relationship(back_populates="device_type")


class NetDeviceModel(Base):
    """Modele urządzeń (`netdevicemodels`) — producent + typ + nazwa modelu."""

    __tablename__ = "net_device_models"
    __table_args__ = (UniqueConstraint("producer_id", "name", name="uq_net_device_models_producer_name"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    producer_id: Mapped[int] = mapped_column(
        ForeignKey("net_device_producers.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    alternative_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    type_id: Mapped[int | None] = mapped_column(
        ForeignKey("net_device_types.id", ondelete="SET NULL"),
        nullable=True,
    )

    producer: Mapped["NetDeviceProducer"] = relationship(back_populates="models")
    device_type: Mapped["NetDeviceType | None"] = relationship(back_populates="models")
    devices: Mapped[list["NetDevice"]] = relationship(back_populates="net_device_model")


class VatRate(Base):
    """Stawka VAT (SNMS)."""

    __tablename__ = "vat_rates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    rate_percent: Mapped[float] = mapped_column(Numeric(5, 2), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)


class NumberPlan(Base):
    """Plan numeracji dokumentów (SNMS)."""

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
    division_id: Mapped[int | None] = mapped_column(
        ForeignKey("divisions.id", ondelete="SET NULL"),
        nullable=True,
    )
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    division: Mapped["Division | None"] = relationship()


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
    division_id: Mapped[int | None] = mapped_column(
        ForeignKey("divisions.id", ondelete="SET NULL"), nullable=True
    )
    vat_rate_id: Mapped[int | None] = mapped_column(
        ForeignKey("vat_rates.id", ondelete="SET NULL"), nullable=True
    )
    document_kind: Mapped[InvoiceDocumentKind] = mapped_column(
        Enum(InvoiceDocumentKind, values_callable=lambda x: [e.value for e in x]),
        default=InvoiceDocumentKind.invoice,
        nullable=False,
    )
    amount_net: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    amount_vat: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)

    customer: Mapped["Customer"] = relationship(back_populates="invoices")
    division: Mapped["Division | None"] = relationship()
    vat_rate: Mapped["VatRate | None"] = relationship()


class HelpdeskQueue(Base):
    """Kolejka zgłoszeń (helpdesk SNMS)."""

    __tablename__ = "helpdesk_queues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    categories: Mapped[list["HelpdeskCategory"]] = relationship(
        back_populates="queue",
        cascade="all, delete-orphan",
    )
    tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="queue_ref")


class HelpdeskCategory(Base):
    """Kategoria w kolejce (helpdesk SNMS)."""

    __tablename__ = "helpdesk_categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    queue_id: Mapped[int] = mapped_column(
        ForeignKey("helpdesk_queues.id", ondelete="CASCADE"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    queue: Mapped["HelpdeskQueue"] = relationship(back_populates="categories")
    tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="category_ref")


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    queue: Mapped[str] = mapped_column(String(64), default="default", nullable=False)
    queue_id: Mapped[int | None] = mapped_column(
        ForeignKey("helpdesk_queues.id", ondelete="SET NULL"),
        nullable=True,
    )
    category_id: Mapped[int | None] = mapped_column(
        ForeignKey("helpdesk_categories.id", ondelete="SET NULL"),
        nullable=True,
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[TicketStatus] = mapped_column(
        Enum(TicketStatus), default=TicketStatus.open, nullable=False
    )
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    assignee_id: Mapped[int | None] = mapped_column(
        ForeignKey("portal_users.id", ondelete="SET NULL"),
        nullable=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )

    queue_ref: Mapped["HelpdeskQueue | None"] = relationship(back_populates="tickets")
    category_ref: Mapped["HelpdeskCategory | None"] = relationship(back_populates="tickets")

    customer: Mapped["Customer | None"] = relationship(back_populates="tickets")
    assignee: Mapped["PortalUser | None"] = relationship(
        "PortalUser",
        foreign_keys=[assignee_id],
        back_populates="assigned_tickets",
    )


class IpNetwork(Base):
    """Pula / segment adresacji IPv4 (CIDR)."""

    __tablename__ = "ip_networks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    cidr: Mapped[str] = mapped_column(String(64), nullable=False)
    gateway: Mapped[str | None] = mapped_column(String(64), nullable=True)
    vlan_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    network_host_id: Mapped[int | None] = mapped_column(
        ForeignKey("network_hosts.id", ondelete="SET NULL"),
        nullable=True,
    )

    network_host: Mapped["NetworkHost | None"] = relationship(back_populates="ip_networks")
    devices: Mapped[list["NetDevice"]] = relationship(back_populates="ip_network")
    nodes: Mapped[list["Node"]] = relationship(back_populates="ip_network")


class NetDevice(Base):
    """Urządzenie sieciowe (inwentaryzacja / NMS-light)."""

    __tablename__ = "net_devices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    hostname: Mapped[str | None] = mapped_column(String(255), nullable=True)
    serial_number: Mapped[str | None] = mapped_column(String(128), nullable=True)
    mac_address: Mapped[str | None] = mapped_column(String(32), nullable=True)
    management_ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    device_type: Mapped[str] = mapped_column(String(64), default="other", nullable=False)
    snmp_community: Mapped[str | None] = mapped_column(String(128), nullable=True)
    login_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    ip_network_id: Mapped[int | None] = mapped_column(
        ForeignKey("ip_networks.id", ondelete="SET NULL"),
        nullable=True,
    )
    net_node_id: Mapped[int | None] = mapped_column(
        ForeignKey("net_nodes.id", ondelete="SET NULL"),
        nullable=True,
    )
    customer_id: Mapped[int | None] = mapped_column(
        ForeignKey("customers.id", ondelete="SET NULL"),
        nullable=True,
    )
    net_device_model_id: Mapped[int | None] = mapped_column(
        ForeignKey("net_device_models.id", ondelete="SET NULL"),
        nullable=True,
    )
    status: Mapped[NetDeviceStatus] = mapped_column(
        Enum(NetDeviceStatus, values_callable=lambda x: [e.value for e in x]),
        default=NetDeviceStatus.active,
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    net_device_model: Mapped["NetDeviceModel | None"] = relationship(back_populates="devices")
    ip_network: Mapped["IpNetwork | None"] = relationship(back_populates="devices")
    net_node: Mapped["NetNode | None"] = relationship(back_populates="devices")
    owner_customer: Mapped["Customer | None"] = relationship(
        back_populates="owned_net_devices",
        foreign_keys="NetDevice.customer_id",
    )
    customer_nodes: Mapped[list["Node"]] = relationship(
        back_populates="net_device",
        foreign_keys="Node.net_device_id",
    )


class VoipAccount(Base):
    __tablename__ = "voip_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    phone_number: Mapped[str] = mapped_column(String(32), nullable=False)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class HostingAccount(Base):
    __tablename__ = "hosting_accounts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    account_login: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    domain: Mapped[str | None] = mapped_column(String(255), nullable=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)


class MessageTemplate(Base):
    __tablename__ = "message_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)


class OutboundMessage(Base):
    __tablename__ = "outbound_messages"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    template_id: Mapped[int | None] = mapped_column(
        ForeignKey("message_templates.id", ondelete="SET NULL"),
        nullable=True,
    )
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    status: Mapped[MessageStatus] = mapped_column(
        Enum(MessageStatus, values_callable=lambda x: [e.value for e in x]),
        default=MessageStatus.draft,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    sent_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    starts_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    ends_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    done: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )


class TrafficStat(Base):
    __tablename__ = "traffic_stats"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    node_id: Mapped[int | None] = mapped_column(ForeignKey("nodes.id", ondelete="SET NULL"), nullable=True)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    bytes_in: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    bytes_out: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )


class AppSetting(Base):
    __tablename__ = "app_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    value: Mapped[str] = mapped_column(Text, nullable=False)


class RecurringPayment(Base):
    __tablename__ = "recurring_payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    interval_months: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    day_of_month: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    next_run: Mapped[date | None] = mapped_column(Date, nullable=True)


class LedgerEntry(Base):
    __tablename__ = "ledger_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    kind: Mapped[LedgerEntryKind] = mapped_column(
        Enum(LedgerEntryKind, values_callable=lambda x: [e.value for e in x]),
        nullable=False,
    )
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    posted_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )


class CashReceipt(Base):
    __tablename__ = "cash_receipts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    issued_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )


class Document(Base):
    __tablename__ = "documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    doc_type: Mapped[str] = mapped_column(String(64), default="other", nullable=False)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    stored_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    original_filename: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String(128), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)

    customer: Mapped["Customer | None"] = relationship(back_populates="documents")


portal_staff_group_member = Table(
    "portal_staff_group_members",
    Base.metadata,
    Column("user_id", ForeignKey("portal_users.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("portal_user_groups.id", ondelete="CASCADE"), primary_key=True),
)


class PortalUserGroup(Base):
    __tablename__ = "portal_user_groups"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    users: Mapped[list["PortalUser"]] = relationship(
        secondary=portal_staff_group_member,
        back_populates="staff_groups",
    )


class BackupExport(Base):
    __tablename__ = "backup_exports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    label: Mapped[str] = mapped_column(String(128), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    created_by_id: Mapped[int | None] = mapped_column(
        ForeignKey("portal_users.id", ondelete="SET NULL"),
        nullable=True,
    )


class ConfigReloadLog(Base):
    __tablename__ = "config_reload_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    actor_id: Mapped[int | None] = mapped_column(
        ForeignKey("portal_users.id", ondelete="SET NULL"),
        nullable=True,
    )
    note: Mapped[str | None] = mapped_column(Text, nullable=True)


class AuditLog(Base):
    """Rejestr zdarzeń systemowych (D6)."""

    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    actor_id: Mapped[int | None] = mapped_column(
        ForeignKey("portal_users.id", ondelete="SET NULL"),
        nullable=True,
    )
    action: Mapped[str] = mapped_column(String(64), nullable=False)
    resource_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    resource_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    details: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)

    actor: Mapped["PortalUser | None"] = relationship()


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
        secondary=portal_staff_group_member,
        back_populates="users",
    )


class NavMenuItem(Base):
    """Pozycja menu (edytowalna etykieta i URL; klucz stabilny dla uprawnień)."""

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
