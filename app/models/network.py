from __future__ import annotations
from datetime import datetime, timezone, date
from sqlalchemy import Boolean, Enum, ForeignKey, Integer, String, Text, Numeric, DateTime, UniqueConstraint, Date, BigInteger
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.common import CustomerDeviceStatus, NetDeviceStatus, NetNodeLocationType

class NetNode(Base):
    __tablename__ = "net_nodes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    division_id: Mapped[int | None] = mapped_column(ForeignKey("divisions.id", ondelete="SET NULL"), nullable=True)
    location_state_id: Mapped[int | None] = mapped_column(ForeignKey("location_states.id", ondelete="SET NULL"), nullable=True)
    location_district_id: Mapped[int | None] = mapped_column(ForeignKey("location_districts.id", ondelete="SET NULL"), nullable=True)
    location_city_id: Mapped[int | None] = mapped_column(ForeignKey("location_cities.id", ondelete="SET NULL"), nullable=True)
    location_street_id: Mapped[int | None] = mapped_column(ForeignKey("location_streets.id", ondelete="SET NULL"), nullable=True)
    street_number: Mapped[str | None] = mapped_column(String(32), nullable=True)
    location_detail: Mapped[str | None] = mapped_column(String(255), nullable=True)
    location_type: Mapped[NetNodeLocationType] = mapped_column(
        Enum(NetNodeLocationType, values_callable=lambda x: [e.value for e in x]),
        default=NetNodeLocationType.other,
        nullable=False,
    )
    latitude: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    longitude: Mapped[float | None] = mapped_column(Numeric(10, 6), nullable=True)
    x_1992: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    y_1992: Mapped[float | None] = mapped_column(Numeric(12, 2), nullable=True)
    info: Mapped[str | None] = mapped_column(Text, nullable=True)
    node_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    owner_type: Mapped[str | None] = mapped_column(String(64), nullable=True)
    sidusis_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    has_power: Mapped[bool] = mapped_column(Boolean, default=False)
    has_env_control: Mapped[bool] = mapped_column(Boolean, default=False)
    uke_node_kind: Mapped[str | None] = mapped_column(String(64), nullable=True)
    uke_access_rules: Mapped[str | None] = mapped_column(String(64), nullable=True)

    division: Mapped["Division | None"] = relationship(back_populates="net_nodes")
    location_state: Mapped["LocationState | None"] = relationship()
    location_district: Mapped["LocationDistrict | None"] = relationship()
    location_city: Mapped["LocationCity | None"] = relationship()
    location_street: Mapped["LocationStreet | None"] = relationship()
    
    devices: Mapped[list["NetDevice"]] = relationship(back_populates="net_node")
    outgoing_links: Mapped[list["NetNodeLink"]] = relationship(
        "NetNodeLink", foreign_keys="NetNodeLink.source_node_id", back_populates="source_node"
    )
    incoming_links: Mapped[list["NetNodeLink"]] = relationship(
        "NetNodeLink", foreign_keys="NetNodeLink.target_node_id", back_populates="target_node"
    )

class NetNodeLink(Base):
    __tablename__ = "net_node_links"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source_node_id: Mapped[int] = mapped_column(ForeignKey("net_nodes.id", ondelete="CASCADE"))
    target_node_id: Mapped[int] = mapped_column(ForeignKey("net_nodes.id", ondelete="CASCADE"))
    medium_type: Mapped[str] = mapped_column(String(32), default="Fiber")
    capacity_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    distance_m: Mapped[int | None] = mapped_column(Integer, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    info: Mapped[str | None] = mapped_column(String(255), nullable=True)
    source_node: Mapped["NetNode"] = relationship("NetNode", foreign_keys=[source_node_id], back_populates="outgoing_links")
    target_node: Mapped["NetNode"] = relationship("NetNode", foreign_keys=[target_node_id], back_populates="incoming_links")

class NetworkHost(Base):
    __tablename__ = "network_hosts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    ip_networks: Mapped[list["IpNetwork"]] = relationship(back_populates="network_host")

class IpNetwork(Base):
    __tablename__ = "ip_networks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    cidr: Mapped[str] = mapped_column(String(64), nullable=False)
    gateway: Mapped[str | None] = mapped_column(String(64), nullable=True)
    vlan_id: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    network_host_id: Mapped[int | None] = mapped_column(ForeignKey("network_hosts.id", ondelete="SET NULL"), nullable=True)
    net_device_id: Mapped[int | None] = mapped_column(ForeignKey("net_devices.id", ondelete="SET NULL"), nullable=True)
    net_device_dhcp_server_id: Mapped[int | None] = mapped_column(ForeignKey("net_device_dhcp_servers.id", ondelete="SET NULL"), nullable=True)
    
    network_host: Mapped["NetworkHost | None"] = relationship(back_populates="ip_networks")
    net_devices: Mapped[list["NetDevice"]] = relationship(back_populates="ip_network", foreign_keys="NetDevice.ip_network_id")
    customer_devices: Mapped[list["CustomerDevice"]] = relationship(back_populates="ip_network")
    managing_net_device: Mapped["NetDevice | None"] = relationship(back_populates="managed_ip_networks", foreign_keys=[net_device_id])
    dhcp_server: Mapped["NetDeviceDhcpServer | None"] = relationship(back_populates="ip_networks")


class NetDeviceProducer(Base):
    __tablename__ = "net_device_producers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    alternative_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    models: Mapped[list["NetDeviceModel"]] = relationship(back_populates="producer")

class NetDeviceType(Base):
    __tablename__ = "net_device_types"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    models: Mapped[list["NetDeviceModel"]] = relationship(back_populates="device_type")

class NetDeviceModel(Base):
    __tablename__ = "net_device_models"
    __table_args__ = (UniqueConstraint("producer_id", "name", name="uq_net_device_models_producer_name"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    producer_id: Mapped[int] = mapped_column(ForeignKey("net_device_producers.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    alternative_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    type_id: Mapped[int | None] = mapped_column(ForeignKey("net_device_types.id", ondelete="SET NULL"), nullable=True)
    producer: Mapped["NetDeviceProducer"] = relationship(back_populates="models")
    device_type: Mapped["NetDeviceType | None"] = relationship(back_populates="models")
    devices: Mapped[list["NetDevice"]] = relationship(back_populates="net_device_model")

class NetDeviceInterface(Base):
    __tablename__ = "net_device_interfaces"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    net_device_id: Mapped[int] = mapped_column(ForeignKey("net_devices.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    mac_address: Mapped[str | None] = mapped_column(String(32), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    net_device: Mapped["NetDevice"] = relationship(back_populates="interfaces")
    dhcp_servers: Mapped[list["NetDeviceDhcpServer"]] = relationship(back_populates="interface")

class NetDeviceIpPool(Base):
    __tablename__ = "net_device_ip_pools"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    net_device_id: Mapped[int] = mapped_column(ForeignKey("net_devices.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    ranges: Mapped[str] = mapped_column(Text, nullable=False)
    net_device: Mapped["NetDevice"] = relationship(back_populates="ip_pools")

class NetDeviceDhcpServer(Base):
    __tablename__ = "net_device_dhcp_servers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    net_device_id: Mapped[int] = mapped_column(ForeignKey("net_devices.id", ondelete="CASCADE"), nullable=False)
    interface_id: Mapped[int | None] = mapped_column(ForeignKey("net_device_interfaces.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    address_pool_name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    net_device: Mapped["NetDevice"] = relationship(back_populates="dhcp_servers")
    interface: Mapped["NetDeviceInterface | None"] = relationship(back_populates="dhcp_servers")
    ip_networks: Mapped[list["IpNetwork"]] = relationship(back_populates="dhcp_server")

class NetDevice(Base):
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
    ip_network_id: Mapped[int | None] = mapped_column(ForeignKey("ip_networks.id", ondelete="SET NULL"), nullable=True)
    net_node_id: Mapped[int | None] = mapped_column(ForeignKey("net_nodes.id", ondelete="SET NULL"), nullable=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    net_device_model_id: Mapped[int | None] = mapped_column(ForeignKey("net_device_models.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[NetDeviceStatus] = mapped_column(
        Enum(NetDeviceStatus, values_callable=lambda x: [e.value for e in x]),
        default=NetDeviceStatus.active,
        nullable=False,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    driver_type: Mapped[str | None] = mapped_column(String(32), nullable=True)
    mgmt_username: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mgmt_password_encrypted: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    # Monitoring fields
    last_seen: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_online: Mapped[bool] = mapped_column(Boolean, default=True)
    latency_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    net_device_model: Mapped["NetDeviceModel | None"] = relationship(back_populates="devices")
    ip_network: Mapped["IpNetwork | None"] = relationship(back_populates="net_devices", foreign_keys=[ip_network_id])
    net_node: Mapped["NetNode | None"] = relationship(back_populates="devices")
    owner_customer: Mapped["Customer | None"] = relationship(back_populates="owned_net_devices", foreign_keys="NetDevice.customer_id")
    customer_devices: Mapped[list["CustomerDevice"]] = relationship(back_populates="net_device", foreign_keys="CustomerDevice.net_device_id")
    interfaces: Mapped[list["NetDeviceInterface"]] = relationship(back_populates="net_device", cascade="all, delete-orphan")
    ip_pools: Mapped[list["NetDeviceIpPool"]] = relationship(back_populates="net_device", cascade="all, delete-orphan")
    dhcp_servers: Mapped[list["NetDeviceDhcpServer"]] = relationship(back_populates="net_device", cascade="all, delete-orphan")
    managed_ip_networks: Mapped[list["IpNetwork"]] = relationship(back_populates="managing_net_device", foreign_keys="IpNetwork.net_device_id")

class CustomerDevice(Base):
    __tablename__ = "customer_devices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    name: Mapped[str | None] = mapped_column(String(128), nullable=True)
    hostname: Mapped[str] = mapped_column(String(255), nullable=False)
    login: Mapped[str | None] = mapped_column(String(64), nullable=True)
    passwd: Mapped[str | None] = mapped_column(String(64), nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    mac_address: Mapped[str | None] = mapped_column(String(32), nullable=True)
    status: Mapped[CustomerDeviceStatus] = mapped_column(Enum(CustomerDeviceStatus), default=CustomerDeviceStatus.active, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    net_device_id: Mapped[int | None] = mapped_column(ForeignKey("net_devices.id", ondelete="SET NULL"), nullable=True)
    ip_network_id: Mapped[int | None] = mapped_column(ForeignKey("ip_networks.id", ondelete="SET NULL"), nullable=True)
    dhcp_server: Mapped[str | None] = mapped_column(String(128), nullable=True)
    dhcp_interface: Mapped[str | None] = mapped_column(String(64), nullable=True)
    customer: Mapped["Customer"] = relationship(back_populates="devices")
    net_device: Mapped["NetDevice | None"] = relationship(back_populates="customer_devices", foreign_keys="CustomerDevice.net_device_id")
    ip_network: Mapped["IpNetwork | None"] = relationship(back_populates="customer_devices")
    groups: Mapped[list["CustomerDeviceGroup"]] = relationship(secondary="node_group_members", back_populates="devices")
    sessions: Mapped[list["CustomerDeviceSession"]] = relationship(back_populates="device", cascade="all, delete-orphan")
    notices: Mapped[list["CustomerDeviceNotice"]] = relationship(back_populates="device", cascade="all, delete-orphan")
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="device")

class CustomerDeviceGroup(Base):
    __tablename__ = "node_groups"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    devices: Mapped[list["CustomerDevice"]] = relationship(secondary="node_group_members", back_populates="groups")

class CustomerDeviceSession(Base):
    __tablename__ = "node_sessions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("customer_devices.id", ondelete="CASCADE"), nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(64), nullable=True)
    source: Mapped[str] = mapped_column(String(32), default="manual", nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    device: Mapped["CustomerDevice"] = relationship(back_populates="sessions")

class CustomerDeviceNotice(Base):
    __tablename__ = "node_notices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    device_id: Mapped[int] = mapped_column(ForeignKey("customer_devices.id", ondelete="CASCADE"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str | None] = mapped_column(Text, nullable=True)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    device: Mapped["CustomerDevice"] = relationship(back_populates="notices")

class TrafficStat(Base):
    __tablename__ = "traffic_stats"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    device_id: Mapped[int | None] = mapped_column(ForeignKey("customer_devices.id", ondelete="SET NULL"), nullable=True)
    period_start: Mapped[date] = mapped_column(Date, nullable=False)
    period_end: Mapped[date] = mapped_column(Date, nullable=False)
    bytes_in: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    bytes_out: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    note: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
