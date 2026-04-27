from app.logging import setup_logging

# Initialize logging when the package is imported
# This ensures it's configured even if main.py is managed by others
setup_logging()
