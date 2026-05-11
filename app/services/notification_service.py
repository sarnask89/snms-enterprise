from app.database import SessionLocal
from app.models.monitoring import SystemNotification
import sqlalchemy as sa

class NotificationService:
    @staticmethod
    def notify(title, message, level="info", source="system"):
        db = SessionLocal()
        notif = SystemNotification(
            title=title,
            message=message,
            level=level,
            source=source
        )
        db.add(notif)
        db.commit()
        db.close()
        # In the future, we could trigger WebSockets/Emails here

    @staticmethod
    def get_unread_count():
        db = SessionLocal()
        count = db.scalar(sa.select(sa.func.count(SystemNotification.id)).where(SystemNotification.is_read == False))
        db.close()
        return count or 0

notification_service = NotificationService()
