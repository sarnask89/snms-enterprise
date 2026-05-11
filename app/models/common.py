from __future__ import annotations
import enum
from sqlalchemy import Column, ForeignKey, Table
from app.database import Base

# --- Enums ---

class CustomerStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class InvoiceStatus(str, enum.Enum):
    draft = "draft"
    issued = "issued"
    paid = "paid"

class InvoiceDocumentKind(str, enum.Enum):
    invoice = "invoice"
    proforma = "proforma"
    debit_note = "debit_note"

class NumberPlanDocType(str, enum.Enum):
    invoice = "invoice"
    proforma = "proforma"
    debit_note = "debit_note"
    customer = "customer"

class TicketStatus(str, enum.Enum):
    open = "open"
    pending = "pending"
    closed = "closed"

class CustomerDeviceStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"

class NetNodeLocationType(str, enum.Enum):
    basement = "basement"
    staircase = "staircase"
    floor = "floor"
    other = "other"

class NetDeviceStatus(str, enum.Enum):
    active = "active"
    inactive = "inactive"
    maintenance = "maintenance"

class UserRole(str, enum.Enum):
    admin = "admin"
    manager = "manager"
    service = "service"
    view = "view"
    customer = "customer"


class LedgerEntryKind(str, enum.Enum):
    debit = "debit"
    credit = "credit"

class AccessTechnology(str, enum.Enum):
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

# --- Association Tables ---

customer_group_member = Table(
    "customer_group_members",
    Base.metadata,
    Column("customer_id", ForeignKey("customers.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("customer_groups.id", ondelete="CASCADE"), primary_key=True),
)

node_group_member = Table(
    "node_group_members",
    Base.metadata,
    Column("device_id", ForeignKey("customer_devices.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("node_groups.id", ondelete="CASCADE"), primary_key=True),
)

portal_staff_group_member = Table(
    "portal_staff_group_members",
    Base.metadata,
    Column("user_id", ForeignKey("portal_users.id", ondelete="CASCADE"), primary_key=True),
    Column("group_id", ForeignKey("portal_user_groups.id", ondelete="CASCADE"), primary_key=True),
)
