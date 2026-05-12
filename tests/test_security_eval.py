import pytest
from app.utils.parsing import safe_eval

def test_safe_eval_basic_arithmetic():
    assert safe_eval("1 + 1") == 2
    assert safe_eval("10 - 5") == 5
    assert safe_eval("2 * 3") == 6
    assert safe_eval("10 / 2") == 5.0
    assert safe_eval("-5 + 10") == 5

def test_safe_eval_comparisons():
    assert safe_eval("10 > 5") is True
    assert safe_eval("5 < 10") is True
    assert safe_eval("10 >= 10") is True
    assert safe_eval("10 <= 10") is True
    assert safe_eval("10 == 10") is True
    assert safe_eval("10 != 5") is True
    assert safe_eval("5 > 10") is False

def test_safe_eval_complex_expression():
    # Simulate '{last()} > 90' where {last()} is replaced by 95
    assert safe_eval("95 > 90") is True
    assert safe_eval("85 > 90") is False
    assert safe_eval("(10 + 5) * 2 > 25") is True

def test_safe_eval_rejection_of_dangerous_payloads():
    dangerous_payloads = [
        "__import__('os').system('ls')",
        "eval('1+1')",
        "getattr(int, '__abs__')",
        "()._class__.__base__.__subclasses__()",
        "open('/etc/passwd').read()",
        "import os",
        "lambda x: x",
        "1; import os",
    ]

    for payload in dangerous_payloads:
        with pytest.raises(ValueError) as excinfo:
            safe_eval(payload)
        assert "Invalid or unsafe expression" in str(excinfo.value)

def test_safe_eval_unsupported_nodes():
    # Lists, dicts, etc. should be rejected for our use case (triggers)
    with pytest.raises(ValueError):
        safe_eval("[1, 2, 3]")

    with pytest.raises(ValueError):
        safe_eval("{'a': 1}")
