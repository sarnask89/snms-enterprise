"""Pozycje menu nawigacji i widoczność per rola (konfigurowalna w bazie)."""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models

# (key, label, url_path, sort_order)
NAV_DEFINITION: list[tuple[str, str, str, float]] = [
    ("dashboard", "Pulpit", "/", 0),
    
    # Klienci
    ("customers", "Lista abonentów", "/customers", 10),
    ("customer_add", "Nowy abonent", "/customers/new", 11),
    ("customer_groups", "Grupy abonentów", "/customer-groups", 12),
    
    # Infrastruktura
    ("net_nodes", "Węzły sieci", "/net-nodes", 20),
    ("net_map", "Mapa topologii", "/net-nodes/topology", 20.5),
    ("nodes", "Urządzenia klientów", "/customer-devices", 21),
    ("netdevices", "Katalog osprzętu", "/net-devices", 22),
    
    # Sieci
    ("ip_networks", "Adresacja IPv4", "/ip-networks", 30),
    ("net_usage", "Wykorzystanie IP", "/ip-networks/usage", 31),
    
    # Finanse
    ("invoices", "Faktury i dokumenty", "/finances/invoices", 40),
    ("subscriptions", "Usługi / Subskrypcje", "/subscriptions", 41),
    ("tariffs", "Plany taryfowe", "/finances/tariffs", 42),
    ("finances_payments", "Płatności cykliczne", "/finances/payments", 43),
    ("finances_balance", "Księga (Ledger)", "/finances/balance", 44),
    ("finances_cash", "Kasa (KP/KW)", "/finances/cash", 45),
    
    # Helpdesk
    ("helpdesk", "Zgłoszenia", "/helpdesk", 50),
    ("helpdesk_queues", "Kolejki obsługi", "/helpdesk/queues", 51),
    ("helpdesk_categories", "Kategorie", "/helpdesk/categories", 52),
    ("helpdesk_reports", "Statystyki pomocy", "/helpdesk/reports", 53),
    
    # TERYT
    ("teryt", "Przeglądaj TERYT", "/teryt/browse", 60),
    ("teryt_cities", "Słownik miejscowości", "/teryt/cities", 61),
    ("admin_teryt_sync", "Synchronizacja GUS", "/admin/teryt-sync", 62),
    
    # System / Administracja
    ("portal_users", "Użytkownicy panelu", "/admin/users", 100),
    ("admin_audit_logs", "Dziennik zdarzeń", "/admin/audit-logs", 101),
    ("config_number_plans", "Plany numeracji", "/config/number-plans", 102),
    ("config_vat", "Stawki VAT", "/config/vat-rates", 103),
    ("admin_backups", "Kopie zapasowe", "/admin/backups", 104),
    ("admin_reload", "Przeładowanie cache", "/admin/reload", 105),
    
    # Profil
    ("auth_password", "Zmiana hasła", "/auth/change-password", 200),
]

# Sekcje bocznego menu (Kolejność wyświetlania)
NAV_GROUPS: list[tuple[str, tuple[str, ...]]] = [
    ("Start", ("dashboard",)),
    ("Klienci", ("customers", "customer_add", "customer_groups")),
    ("Infrastruktura", ("net_nodes", "net_map", "nodes", "netdevices")),
    ("Sieci IP", ("ip_networks", "net_usage")),
    ("Finanse", ("invoices", "subscriptions", "tariffs", "finances_payments", "finances_balance", "finances_cash")),
    ("Helpdesk", ("helpdesk", "helpdesk_queues", "helpdesk_categories", "helpdesk_reports")),
    ("TERYT / Adresy", ("teryt", "teryt_cities", "admin_teryt_sync")),
    ("System", ("portal_users", "admin_audit_logs", "config_number_plans", "config_vat", "admin_backups", "admin_reload")),
    ("Ustawienia", ("auth_password",)),
]


def _default_matrix() -> dict[models.UserRole, set[str]]:
    common = {"dashboard", "auth_password"}
    admin_keys = {n[0] for n in NAV_DEFINITION}
    manager_keys = admin_keys - {"portal_user_delete", "admin_backups"}
    service_keys = common | {
        "customers",
        "net_nodes",
        "nodes",
        "helpdesk",
        "teryt",
        "invoices"
    }
    return {
        models.UserRole.admin: admin_keys,
        models.UserRole.manager: manager_keys,
        models.UserRole.service: service_keys,
        models.UserRole.view: {"dashboard", "auth_password"},
    }


def visible_nav_items(db: Session, role: models.UserRole) -> list[models.NavMenuItem]:
    all_items = list(db.scalars(select(models.NavMenuItem).order_by(models.NavMenuItem.sort_order)).all())
    allowed_ids = {
        p.nav_item_id
        for p in db.scalars(
            select(models.RoleMenuPermission).where(
                models.RoleMenuPermission.role == role,
                models.RoleMenuPermission.allowed.is_(True),
            )
        ).all()
    }
    return [i for i in all_items if i.id in allowed_ids]


def grouped_visible_nav(
    visible_items: list[models.NavMenuItem]
) -> list[tuple[str, list[models.NavMenuItem]]]:
    """Zwraca nawigację pogrupowaną wg NAV_GROUPS dla dostarczonej listy elementów."""
    visible_map = {i.key: i for i in visible_items}
    
    grouped = []
    for section_title, keys in NAV_GROUPS:
        section_items = [visible_map[k] for k in keys if k in visible_map]
        if section_items:
            grouped.append((section_title, section_items))
    return grouped


def path_allowed_for_portal(path: str, visible_urls: list[str], visible_menu_keys: set[str]) -> bool:
    p = path.split("?", 1)[0].rstrip("/")
    if not p:
        return "dashboard" in visible_menu_keys
    
    def _under_prefix(url: str, prefix: str) -> bool:
        return url.rstrip("/") == prefix or url.startswith(prefix + "/")

    for vu in visible_urls:
        if _under_prefix(p, vu):
            return True

    # Specyficzne reguły dla powiązanych ścieżek
    if "customers" in visible_menu_keys and _under_prefix(p, "/customers"):
        return True
    if "helpdesk" in visible_menu_keys and _under_prefix(p, "/helpdesk"):
        return True
    if "invoices" in visible_menu_keys and _under_prefix(p, "/finances"):
        return True
    return False


def seed_nav_menu_and_permissions(db: Session) -> None:
    """Tworzy rekordy menu i domyślne uprawnienia dla ról."""
    # Tworzenie pozycji menu
    key_to_id = {}
    for key, label, url, sort in NAV_DEFINITION:
        item = db.scalars(select(models.NavMenuItem).where(models.NavMenuItem.key == key)).first()
        if not item:
            item = models.NavMenuItem(key=key, label=label, url_path=url, sort_order=sort)
            db.add(item)
            db.flush()
        else:
            # Aktualizacja labela i sort_order w razie zmian w kodzie
            item.label = label
            item.sort_order = sort
        key_to_id[key] = item.id

    # Tworzenie domyślnej macierzy uprawnień
    matrix = _default_matrix()
    for role, keys in matrix.items():
        for key in keys:
            if key in key_to_id:
                perm = db.scalars(
                    select(models.RoleMenuPermission).where(
                        models.RoleMenuPermission.role == role,
                        models.RoleMenuPermission.nav_item_id == key_to_id[key],
                    )
                ).first()
                if not perm:
                    db.add(models.RoleMenuPermission(role=role, nav_item_id=key_to_id[key], allowed=True))
    db.commit()


def sync_new_nav_items_and_permissions(db: Session) -> None:
    """Dodaje brakujące pozycje menu do bazy bez resetowania istniejących."""
    seed_nav_menu_and_permissions(db)
