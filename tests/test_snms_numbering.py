from unittest.mock import MagicMock
from datetime import date
from app.snms_numbering import allocate_next_document_number
from app import models

def test_allocate_next_document_number_default_template():
    db = MagicMock()
    plan = MagicMock(spec=models.NumberPlan)
    plan.next_number = 1
    plan.pattern_template = "{year}/{n}"
    
    result = allocate_next_document_number(db, plan)
    
    today = date.today()
    expected = f"{today.year}/0001"
    assert result == expected
    assert plan.next_number == 2
    db.add.assert_called_with(plan)
    db.flush.assert_called()

def test_allocate_next_document_number_custom_template():
    db = MagicMock()
    plan = MagicMock(spec=models.NumberPlan)
    plan.next_number = 10
    plan.pattern_template = "INV-{year}-{month}-{n:03d}"
    
    result = allocate_next_document_number(db, plan)
    
    today = date.today()
    expected = f"INV-{today.year}-{today.month:02d}-010"
    assert result == expected
    assert plan.next_number == 11

def test_allocate_next_document_number_invalid_template():
    db = MagicMock()
    plan = MagicMock(spec=models.NumberPlan)
    plan.next_number = 5
    plan.pattern_template = "INVALID-{unknown_key}"
    
    result = allocate_next_document_number(db, plan)
    
    today = date.today()
    # Fallback logic: rendered = f"{tpl}-{today.year}-{n:04d}"
    expected = f"INVALID-{{unknown_key}}-{today.year}-0005"
    assert result == expected
    assert plan.next_number == 6
