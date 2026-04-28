from __future__ import annotations

import logging
import os
from pathlib import Path

from alembic import command
from alembic.config import Config
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models
from app.config import (
    BASE_DIR,
    CRM_ADMIN_PASSWORD,
    CRM_ADMIN_USER,
    UPLOAD_ROOT,
)
from app.database import Base, SessionLocal, engine
from app.security import hash_password

logger = logging.getLogger("app.init_db")


def seed() -> None:
    """Tworzy domyślnego administratora, jeśli baza jest pusta (D4)."""
    db = SessionLocal()
    try:
        if db.query(models.PortalUser).filter_by(username=CRM_ADMIN_USER).count() == 0:
            logger.info(f"Seeding default admin user: {CRM_ADMIN_USER}")
            admin = models.PortalUser(
                username=CRM_ADMIN_USER,
                password_hash=hash_password(CRM_ADMIN_PASSWORD),
                role=models.UserRole.admin,
                active=True,
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


def ensure_default_catalog_seed() -> None:
    """Zapewnia podstawowe wpisy w słownikach technicznych."""
    db = SessionLocal()
    try:
        # Typy urządzeń
        if db.query(models.NetDeviceType).count() == 0:
            for n in ("router", "switch", "olt", "ont", "server", "other"):
                db.add(models.NetDeviceType(name=n))
        
        # Stawki VAT
        if db.query(models.VatRate).count() == 0:
            db.add(models.VatRate(label="23%", rate_percent=23.0, is_default=True))
            db.add(models.VatRate(label="8%", rate_percent=8.0, is_default=False))
            db.add(models.VatRate(label="5%", rate_percent=5.0, is_default=False))
            db.add(models.VatRate(label="ZW", rate_percent=0.0, is_default=False))
            
        db.commit()
    finally:
        db.close()


def ensure_plan_extensions() -> None:
    """Placeholder dla przyszłych rozszerzeń (np. moduły PIT/UKE)."""
    pass


def ensure_portal_rbac() -> None:
    """Inicjalizuje uprawnienia menu dla ról (D5)."""
    from app.nav_access import seed_nav_menu_and_permissions
    db = SessionLocal()
    try:
        seed_nav_menu_and_permissions(db)
    finally:
        db.close()


def ensure_helpdesk_seed() -> None:
    """Tworzy domyślne kolejki i kategorie helpdesku."""
    db = SessionLocal()
    try:
        if db.query(models.HelpdeskQueue).count() == 0:
            q1 = models.HelpdeskQueue(name="Obsługa Klienta", description="Sprawy ogólne i umowy", sort_order=10)
            q2 = models.HelpdeskQueue(name="Serwis Techniczny", description="Problemy z łączem i sprzętem", sort_order=20)
            db.add_all([q1, q2])
            db.flush()
            
            db.add(models.HelpdeskCategory(name="Błąd faktury", queue_id=q1.id))
            db.add(models.HelpdeskCategory(name="Zmiana taryfy", queue_id=q1.id))
            db.add(models.HelpdeskCategory(name="Brak internetu", queue_id=q2.id))
            db.add(models.HelpdeskCategory(name="Słaby sygnał WiFi", queue_id=q2.id))
            db.commit()
    finally:
        db.close()


def ensure_app_settings() -> None:
    """Inicjalizuje kluczowe ustawienia systemowe."""
    db = SessionLocal()
    try:
        if db.query(models.AppSetting).count() == 0:
            db.add(models.AppSetting(key="company_name", value="Twoja Firma ISP"))
            db.add(models.AppSetting(key="support_phone", value="+48 123 456 789"))
            db.commit()
    finally:
        db.close()


def ensure_message_templates_seed() -> None:
    """Tworzy domyślne szablony wiadomości."""
    db = SessionLocal()
    try:
        if db.query(models.MessageTemplate).count() == 0:
            db.add(models.MessageTemplate(
                name="Domyślny",
                subject="Wiadomość z CRM",
                body="Dzień dobry,\n\nTo jest wiadomość testowa."
            ))
            db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def run_migrations() -> None:
    """Uruchamia migracje Alembic programowo (D6)."""
    if os.environ.get("TESTING"):
        return
    cfg = Config(str(BASE_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BASE_DIR / "alembic"))
    command.upgrade(cfg, "head")


def init_all() -> None:
    UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    # Rely only on metadata for now to ensure startup
    Base.metadata.create_all(bind=engine)
    # run_migrations()
    
    from app.config_validation import report_startup_config
    report_startup_config()
    
    seed()
    ensure_default_catalog_seed()
    ensure_plan_extensions()
    ensure_portal_rbac()
    ensure_helpdesk_seed()
    ensure_app_settings()
    ensure_message_templates_seed()
    validate_local_teryt_data()


def validate_local_teryt_data() -> None:
    """Weryfikuje czy lokalne tabele TERYT mają jakiekolwiek dane."""
    if os.environ.get("TESTING") or os.environ.get("SKIP_HEALTHCHECKS"):
        return

    db = SessionLocal()
    try:
        states_count = db.query(models.LocationState).count()
        cities_count = db.query(models.LocationCity).count()
        
        if states_count > 0 and cities_count > 0:
            logger.info(f"Local TERYT data: OK ({states_count} states, {cities_count} cities)")
        else:
            logger.warning("Local TERYT data is MISSING or incomplete. Run TERYT sync to populate.")
    except Exception as e:
        logger.error(f"Failed to validate local TERYT data: {e}")
    finally:
        db.close()
