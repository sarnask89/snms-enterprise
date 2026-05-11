from __future__ import annotations
from datetime import date, datetime, timezone
from decimal import Decimal
from sqlalchemy import Boolean, Date, Enum, ForeignKey, Integer, Numeric, String, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.common import InvoiceStatus, InvoiceDocumentKind, AccessTechnology, LedgerEntryKind

class Tariff(Base):
    __tablename__ = "tariffs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    monthly_price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    speed_down_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    speed_up_mbps: Mapped[int | None] = mapped_column(Integer, nullable=True)
    vat_rate_id: Mapped[int | None] = mapped_column(ForeignKey("vat_rates.id", ondelete="SET NULL"), nullable=True)

    vat_rate: Mapped["VatRate | None"] = relationship()
    subscriptions: Mapped[list["Subscription"]] = relationship(back_populates="tariff")

    @property
    def monthly_price_gross(self) -> Decimal:
        price = Decimal(str(self.monthly_price))
        if self.vat_rate:
            rate = Decimal(str(self.vat_rate.rate_percent))
            return (price * (Decimal("100") + rate) / Decimal("100")).quantize(Decimal("0.01"))
        return price.quantize(Decimal("0.01"))

class Subscription(Base):
    __tablename__ = "subscriptions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    tariff_id: Mapped[int] = mapped_column(ForeignKey("tariffs.id"), nullable=False)
    device_id: Mapped[int | None] = mapped_column(ForeignKey("customer_devices.id"), nullable=True)
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
    device: Mapped["CustomerDevice | None"] = relationship(back_populates="subscriptions")

class Invoice(Base):
    __tablename__ = "invoices"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    number: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(Enum(InvoiceStatus), default=InvoiceStatus.draft, nullable=False)
    issue_date: Mapped[date] = mapped_column(Date, default=date.today, nullable=False)
    division_id: Mapped[int | None] = mapped_column(ForeignKey("divisions.id", ondelete="SET NULL"), nullable=True)
    vat_rate_id: Mapped[int | None] = mapped_column(ForeignKey("vat_rates.id", ondelete="SET NULL"), nullable=True)
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
    posted_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

class CashReceipt(Base):
    __tablename__ = "cash_receipts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id", ondelete="SET NULL"), nullable=True)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    issued_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
