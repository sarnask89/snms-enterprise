import os
import pytest
from unittest.mock import patch, MagicMock

# Helper to provide common mocks for dependencies that might be missing in the environment
@pytest.fixture
def mock_dependencies():
    mock_sqla = MagicMock()
    mock_sqla.__path__ = []

    mock_modules = {
        'sqlalchemy': mock_sqla,
        'sqlalchemy.orm': MagicMock(),
        'sqlalchemy.pool': MagicMock(),
        'sqlalchemy.ext.declarative': MagicMock(),
        'sqlalchemy.schema': MagicMock(),
        'sqlalchemy.types': MagicMock(),
        'fastapi': MagicMock(),
        'alembic': MagicMock(),
        'alembic.config': MagicMock(),
        'alembic.command': MagicMock(),
    }

    with patch.dict('sys.modules', mock_modules):
        from app.init_db import run_migrations
        yield run_migrations

def test_run_migrations_skips_in_testing(mock_dependencies):
    """Verify that run_migrations returns early if TESTING env var is set."""
    run_migrations = mock_dependencies
    with patch.dict(os.environ, {"TESTING": "True"}):
        with patch("app.init_db.Config") as mock_config:
            with patch("app.init_db.command.upgrade") as mock_upgrade:
                run_migrations()
                mock_config.assert_not_called()
                mock_upgrade.assert_not_called()

def test_run_migrations_executes_when_not_testing(mock_dependencies):
    """Verify that run_migrations calls alembic upgrade when TESTING env var is NOT set."""
    run_migrations = mock_dependencies

    # We must ensure TESTING is NOT in os.environ for this test
    with patch.dict(os.environ, clear=False):
        if "TESTING" in os.environ:
            del os.environ["TESTING"]

        with patch("app.init_db.Config") as mock_config:
            with patch("app.init_db.command.upgrade") as mock_upgrade:
                run_migrations()

                # Verify configuration initialization
                from app.config import BASE_DIR
                mock_config.assert_called_once_with(str(BASE_DIR / "alembic.ini"))

                # Verify setting script_location
                cfg_instance = mock_config.return_value
                cfg_instance.set_main_option.assert_called_with(
                    "script_location", str(BASE_DIR / "alembic")
                )

                # Verify command upgrade call
                mock_upgrade.assert_called_once_with(cfg_instance, "head")
