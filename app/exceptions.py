class AppException(Exception):
    """Base exception for the application."""
    pass

class ConfigError(AppException):
    """Exception for configuration errors."""
    pass
