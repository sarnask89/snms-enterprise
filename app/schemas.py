from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import CustomerStatus, TicketStatus


class CustomerBase(BaseModel):
    customer_code: str = Field(..., min_length=1, max_length=32)
    first_name: str = Field(..., min_length=1, max_length=128)
    last_name: str = Field(..., min_length=1, max_length=128)
    email: EmailStr | None = None
    phone: str | None = Field(None, max_length=64)
    status: CustomerStatus = CustomerStatus.active
    location_state_id: int | None = None
    location_district_id: int | None = None
    location_city_id: int | None = None
    location_street_id: int | None = None
    street_number: str | None = Field(None, max_length=32)


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    creation_date: date


class SupportTicketBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    body: str | None = None
    status: TicketStatus = TicketStatus.open
    queue: str = "default"
    queue_id: int | None = None
    category_id: int | None = None
    customer_id: int | None = None
    assignee_id: int | None = None


class SupportTicketCreate(SupportTicketBase):
    pass


class SupportTicketUpdate(SupportTicketBase):
    pass


class SupportTicketRead(SupportTicketBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime
