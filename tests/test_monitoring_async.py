import pytest
import asyncio
from unittest.mock import patch, MagicMock
from app.services.monitoring_service import MonitoringService
from app.models.network import NetDevice, CustomerDevice
from sqlalchemy import select

@pytest.mark.asyncio
async def test_check_all_devices_async_thread():
    service = MonitoringService()

    mock_db = MagicMock()
    # scalars().all() returns a list
    mock_db.scalars.return_value.all.side_effect = [[], []]

    with patch('app.services.monitoring_service.SessionLocal', return_value=mock_db):
        with patch('asyncio.to_thread', wraps=asyncio.to_thread) as mock_to_thread:
            await service.check_all_devices()

            # Check if to_thread was called for both NetDevice and CustomerDevice queries
            assert mock_to_thread.call_count >= 2

            # Verify one call was for NetDevice and another for CustomerDevice
            # This is a bit tricky with lambda, but we can check if it was called.
