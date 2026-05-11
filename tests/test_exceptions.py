import pytest
from app.exceptions import AppException, ConfigError

def test_exceptions_inheritance():
    assert issubclass(ConfigError, AppException)
    assert issubclass(AppException, Exception)

def test_raise_exceptions():
    with pytest.raises(ConfigError):
        raise ConfigError("Test Config Error")
    
    with pytest.raises(AppException):
        raise ConfigError("Test Inherited Raise")
