import pytest
from unittest.mock import patch, MagicMock
from app.services.notification_service import notification_service
from app.models.monitoring import SystemNotification

def test_notify():
    with patch("app.services.notification_service.SessionLocal") as mock_session_local:
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        
        notification_service.notify("Title", "Message", level="warning")
        
        assert mock_db.add.called
        notif = mock_db.add.call_args[0][0]
        assert isinstance(notif, SystemNotification)
        assert notif.title == "Title"
        assert notif.message == "Message"
        assert notif.level == "warning"
        assert mock_db.commit.called
        assert mock_db.close.called

def test_get_unread_count():
    with patch("app.services.notification_service.SessionLocal") as mock_session_local:
        mock_db = MagicMock()
        mock_session_local.return_value = mock_db
        mock_db.scalar.return_value = 5
        
        count = notification_service.get_unread_count()
        assert count == 5
        assert mock_db.close.called
