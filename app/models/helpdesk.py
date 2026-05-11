from __future__ import annotations
from datetime import datetime, timezone
from sqlalchemy import Enum, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.common import TicketStatus

class HelpdeskQueue(Base):
    __tablename__ = "helpdesk_queues"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    categories: Mapped[list["HelpdeskCategory"]] = relationship(back_populates="queue", cascade="all, delete-orphan")
    tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="queue_ref")

class HelpdeskCategory(Base):
    __tablename__ = "helpdesk_categories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    queue_id: Mapped[int] = mapped_column(ForeignKey("helpdesk_queues.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    queue: Mapped["HelpdeskQueue"] = relationship(back_populates="categories")
    tickets: Mapped[list["SupportTicket"]] = relationship(back_populates="category_ref")

class SupportTicket(Base):
    __tablename__ = "support_tickets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    queue_id: Mapped[int | None] = mapped_column(ForeignKey("helpdesk_queues.id"), nullable=True)
    category_id: Mapped[int | None] = mapped_column(ForeignKey("helpdesk_categories.id"), nullable=True)
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("portal_users.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[TicketStatus] = mapped_column(Enum(TicketStatus), default=TicketStatus.open, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    customer: Mapped["Customer"] = relationship(back_populates="tickets")
    queue_ref: Mapped["HelpdeskQueue"] = relationship(back_populates="tickets")
    category_ref: Mapped["HelpdeskCategory | None"] = relationship(back_populates="tickets")
    assignee: Mapped["PortalUser | None"] = relationship(back_populates="assigned_tickets")
