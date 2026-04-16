import logging
from typing import TYPE_CHECKING
from fastapi import Request
from sqlalchemy.orm import Session
from app import models

if TYPE_CHECKING:
    from app.models import PortalUser

logger = logging.getLogger(__name__)


def record_audit(
    db: Session,
    action: str,
    resource_type: str | None = None,
    resource_id: int | None = None,
    details: str | None = None,
    actor: PortalUser | None = None,
    request: Request | None = None,
) -> None:
    """Rejestruje zdarzenie w tabeli audit_logs (D6)."""
    ip = None
    if request:
        # Próba wyłuskania IP (za proxy lub bezpośrednio)
        ip = request.headers.get("x-forwarded-for")
        if ip:
            ip = ip.split(",")[0].strip()
        else:
            ip = request.client.host if request.client else None

    # Jeśli nie podano aktora, próbujemy z request.state
    if not actor and request:
        actor = getattr(request.state, "portal_user", None)

    try:
        db.add(
            models.AuditLog(
                actor_id=actor.id if actor else None,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                details=details,
                ip_address=ip[:45] if ip else None,
            )
        )
    except Exception as e:
        logger.error(f"Failed to record audit log: {e}")
    # Nie robimy tu db.commit(), żeby log był częścią transakcji biznesowej
    # (lub żeby caller sam zdecydował, kiedy commitować).
