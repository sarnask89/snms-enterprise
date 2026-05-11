from __future__ import annotations

from sqladmin.authentication import AuthenticationBackend
from starlette.requests import Request
from starlette.responses import RedirectResponse

from app.database import db_manager
from app import models
from app.config import SECRET_KEY


class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        # sqladmin default login page isn't used because we use the portal's login
        # However, if someone hits /admin/login directly, we redirect to our portal login
        return True

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        from app.config import AUTH_ENABLED
        if not AUTH_ENABLED:
            return True

        uid = request.session.get("user_id")
        if not uid:
            return False

        db = db_manager.SessionLocal()
        try:
            user = db.get(models.PortalUser, int(uid))
            if user and user.active and user.role == models.UserRole.admin:
                return True
        except (TypeError, ValueError):
            pass
        finally:
            db.close()

        return False


authentication_backend = AdminAuth(secret_key=SECRET_KEY)
