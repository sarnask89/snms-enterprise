"""Create tables and seed minimal TERYT-like + demo rows."""

import os

from alembic import command
from alembic.config import Config
from sqlalchemy import func, select, text

from app import models  # noqa: F401 — register models
from app.config import CRM_ADMIN_PASSWORD, CRM_ADMIN_USER, UPLOAD_ROOT
from app.database import Base, SessionLocal, engine
from app.nav_access import seed_nav_menu_and_permissions, sync_new_nav_items_and_permissions
from app.security import hash_password


def seed() -> None:
    db = SessionLocal()
    try:
        if db.scalars(select(models.LocationState).limit(1)).first():
            return

        maz = models.LocationState(name="Mazowieckie", teryt_code="14")
        db.add(maz)
        db.flush()

        warsaw_d = models.LocationDistrict(state_id=maz.id, name="powiat Warszawa")
        db.add(warsaw_d)
        db.flush()

        city = models.LocationCity(district_id=warsaw_d.id, name="Warszawa")
        db.add(city)
        db.flush()

        db.add(models.LocationStreet(city_id=city.id, name="Marszałkowska"))
        db.add(models.LocationStreet(city_id=city.id, name="Krakowskie Przedmieście"))

        t1 = models.Tariff(
            name="Internet 300/30",
            monthly_price=79.00,
            description="Światłowód",
        )
        t2 = models.Tariff(
            name="Internet + TV",
            monthly_price=119.00,
            description="Pakiet",
        )
        db.add(t1)
        db.add(t2)
        db.flush()

        grp = models.CustomerGroup(name="Retail", description="Grupa demo")
        db.add(grp)
        db.flush()

        c = models.Customer(
            customer_code="C-00001",
            first_name="Jan",
            last_name="Kowalski",
            email="jan@example.com",
            phone="+48123456789",
            status=models.CustomerStatus.active,
            location_state_id=maz.id,
            location_district_id=warsaw_d.id,
            location_city_id=city.id,
            street_number="10",
        )
        db.add(c)
        db.flush()

        c.groups.append(grp)

        db.add(
            models.Node(
                customer_id=c.id,
                hostname="demo-host-1",
                ip_address="10.0.0.10",
                mac_address="00:11:22:33:44:55",
                status=models.NodeStatus.active,
            )
        )
        db.add(
            models.Subscription(
                customer_id=c.id,
                tariff_id=t1.id,
                start_date=c.creation_date,
                active=True,
            )
        )

        db.add(
            models.Invoice(
                number="FV/2026/0001",
                customer_id=c.id,
                amount=79.00,
                status=models.InvoiceStatus.issued,
            )
        )
        db.add(
            models.SupportTicket(
                queue="default",
                title="Brak zasięgu Wi-Fi",
                body="Klient zgłasza słaby sygnał w pokoju.",
                status=models.TicketStatus.open,
                customer_id=c.id,
            )
        )
        db.add(
            models.Document(
                title="Umowa abonencka C-00001",
                doc_type="contract",
                customer_id=c.id,
            )
        )

        db.commit()
    finally:
        db.close()


def ensure_default_catalog_seed() -> None:
    """Minimalny katalog osprzętu i hosty sieci przy pustych tabelach."""
    db = SessionLocal()
    try:
        if db.scalar(select(func.count()).select_from(models.NetDeviceType)) == 0:
            for n in ("router", "switch", "ont", "server", "other"):
                db.add(models.NetDeviceType(name=n[:50]))
            db.flush()
        if db.scalar(select(func.count()).select_from(models.NetDeviceProducer)) == 0:
            db.add(models.NetDeviceProducer(name="Inny"))
            db.add(models.NetDeviceProducer(name="MikroTik"))
            db.flush()
        if db.scalar(select(func.count()).select_from(models.NetDeviceModel)) == 0:
            p = db.scalars(select(models.NetDeviceProducer).limit(1)).first()
            t = db.scalars(
                select(models.NetDeviceType).where(models.NetDeviceType.name == "router")
            ).first()
            if p:
                db.add(
                    models.NetDeviceModel(
                        producer_id=p.id,
                        name="RB — przykład",
                        type_id=t.id if t else None,
                    )
                )
        if db.scalar(select(func.count()).select_from(models.NetworkHost)) == 0:
            db.add(models.NetworkHost(name="default", description="Domyślny host rozdzielczy sieci IP"))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_plan_extensions() -> None:
    """Uzupełnienie danych demo przy istniejącej bazie (nowe tabele po migracji create_all)."""
    db = SessionLocal()
    try:
        if db.scalar(select(func.count()).select_from(models.Customer)) == 0:
            return

        if db.scalar(select(func.count()).select_from(models.CustomerGroup)) == 0:
            g = models.CustomerGroup(name="Retail", description="Domyślna (auto)")
            db.add(g)
            db.flush()
            c = db.scalars(select(models.Customer).limit(1)).first()
            if c:
                c.groups.append(g)

        if db.scalar(select(func.count()).select_from(models.Node)) == 0:
            c = db.scalars(select(models.Customer).limit(1)).first()
            if c:
                db.add(
                    models.Node(
                        customer_id=c.id,
                        hostname="auto-host-1",
                        status=models.NodeStatus.active,
                    )
                )

        if db.scalar(select(func.count()).select_from(models.Subscription)) == 0:
            c = db.scalars(select(models.Customer).limit(1)).first()
            t = db.scalars(select(models.Tariff).limit(1)).first()
            if c and t:
                db.add(
                    models.Subscription(
                        customer_id=c.id,
                        tariff_id=t.id,
                        start_date=c.creation_date,
                        active=True,
                    )
                )

        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_portal_rbac() -> None:
    """Tabele portal_users / menu / uprawnienia oraz konta demo (gdy brak użytkowników)."""
    db = SessionLocal()
    try:
        seed_nav_menu_and_permissions(db)
        sync_new_nav_items_and_permissions(db)
        n_users = db.scalar(select(func.count()).select_from(models.PortalUser))
        if n_users == 0:
            seed_pw = os.environ.get("CRM_SEED_PASSWORD", CRM_ADMIN_PASSWORD)
            accounts = [
                (CRM_ADMIN_USER, CRM_ADMIN_PASSWORD, models.UserRole.admin),
                ("manager", seed_pw, models.UserRole.manager),
                ("service", seed_pw, models.UserRole.service),
                ("view", seed_pw, models.UserRole.view),
            ]
            for username, password, role in accounts:
                db.add(
                    models.PortalUser(
                        username=username,
                        password_hash=hash_password(password),
                        role=role,
                        active=True,
                    )
                )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_helpdesk_seed() -> None:
    db = SessionLocal()
    try:
        if db.scalars(select(models.HelpdeskQueue).limit(1)).first() is None:
            q = models.HelpdeskQueue(
                name="default",
                description="Kolejka domyślna (demo)",
                sort_order=0,
            )
            db.add(q)
            db.flush()
            db.add(models.HelpdeskCategory(name="Ogólne", queue_id=q.id, sort_order=0))
        dq = db.scalars(select(models.HelpdeskQueue).where(models.HelpdeskQueue.name == "default")).first()
        if dq:
            for t in db.scalars(
                select(models.SupportTicket).where(models.SupportTicket.queue_id.is_(None))
            ).all():
                t.queue_id = dq.id
                t.queue = dq.name
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_app_settings() -> None:
    db = SessionLocal()
    try:
        if (
            db.scalars(
                select(models.AppSetting).where(models.AppSetting.key == "site.copyright_text")
            ).first()
            is None
        ):
            db.add(
                models.AppSetting(
                    key="site.copyright_text",
                    value="© SNMS Enterprise",
                )
            )
            db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_message_templates_seed() -> None:
    db = SessionLocal()
    try:
        if db.scalar(select(func.count()).select_from(models.MessageTemplate)) == 0:
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
    from app.config import BASE_DIR
    cfg = Config(str(BASE_DIR / "alembic.ini"))
    cfg.set_main_option("script_location", str(BASE_DIR / "alembic"))
    command.upgrade(cfg, "head")


def init_all() -> None:
    UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    # Rely only on metadata for now to ensure startup
    Base.metadata.create_all(bind=engine)
    run_migrations()
    seed()
    ensure_default_catalog_seed()
    ensure_plan_extensions()
    ensure_portal_rbac()
    ensure_helpdesk_seed()
    ensure_app_settings()
    ensure_message_templates_seed()