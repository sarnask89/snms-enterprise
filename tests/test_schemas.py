import pytest
from pydantic import ValidationError
from app.schemas import CustomerCreate, SupportTicketCreate
from app.models import CustomerStatus

def test_customer_create_valid():
    data = {
        "customer_code": "C001",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "status": CustomerStatus.active
    }
    customer = CustomerCreate(**data)
    assert customer.customer_code == "C001"
    assert customer.email == "john@example.com"

def test_customer_create_invalid_email():
    data = {
        "customer_code": "C001",
        "first_name": "John",
        "last_name": "Doe",
        "email": "invalid-email"
    }
    with pytest.raises(ValidationError):
        CustomerCreate(**data)

def test_support_ticket_create_defaults():
    data = {"title": "Internet broken"}
    ticket = SupportTicketCreate(**data)
    assert ticket.title == "Internet broken"
    assert ticket.status == "open"
    assert ticket.queue == "default"
