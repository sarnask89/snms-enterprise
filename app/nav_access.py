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
    ("device_groups", "Grupy urządzeń", "/device-groups", 22.5),
    ("admin_discovery", "Odkrywanie Mikrotik", "/admin/discovery", 23),
    ("admin_pit", "PIT UKE", "/admin/pit", 24),
    ("admin_passport", "Paszportyzacja", "/admin/passport/map", 25),
    ("monitoring", "Monitorowanie", "/admin/monitoring", 26),
    ("network_tools", "Narzędzia i Skanery", "/admin/network-tools", 27),
    ("monitoring_gpu", "Infrastruktura AI", "/admin/monitoring/gpu", 27.5),
    ("monitor_config", "Szablony NMS", "/admin/monitor-config", 28),
    ("diagnostics", "Diagnostyka", "/diagnostics", 29),
    
    # Sieci
    ("ip_networks", "Adresacja IPv4", "/ip-networks", 30),
    ("net_usage", "Wykorzystanie IP", "/ip-networks/usage", 31),
    ("addresses", "Baza adresowa", "/addresses", 32),
    
    # Finanse
    ("subscriptions", "Usługi / Subskrypcje", "/subscriptions", 41),
    ("tariffs", "Plany taryfowe", "/finances/tariffs", 42),
    ("invoices", "Faktury i Dokumenty", "/finances/invoices", 43),
    ("payments", "Płatności cykliczne", "/finances/payments", 44),
    ("ledger", "Księga i Bilans", "/finances/balance", 45),
    ("cash", "Kasa i Paragony", "/finances/cash", 46),
    ("bulk_invoicing", "Masowe fakturowanie", "/bulk/invoicing", 47),
    
    # Helpdesk
    ("helpdesk_tickets", "Zgłoszenia (Tickets)", "/helpdesk/tickets", 50),
    ("helpdesk_queues", "Kolejki helpdesk", "/helpdesk/queues", 51),
    ("helpdesk_reports", "Raporty helpdesk", "/helpdesk/reports", 52),

    # Dokumenty
    ("documents", "Repozytorium dokumentów", "/documents", 70),

    # TERYT
    ("teryt", "Przeglądaj TERYT", "/teryt/browse", 80),
    ("teryt_cities", "Słownik miejscowości", "/teryt/cities", 81),
    ("admin_teryt_sync", "Synchronizacja GUS", "/admin/teryt-sync", 82),
    
    # System / Administracja
    ("portal_users", "Użytkownicy", "/admin/users", 100),
    ("portal_roles", "Role i Uprawnienia", "/admin/menu-access", 100.5),
    ("portal_user_groups", "Grupy personelu", "/admin/user-groups", 100.6),
    ("admin_audit_logs", "Dziennik zdarzeń", "/admin/audit-logs", 120),
    ("admin_backups", "Kopie zapasowe", "/admin/backups", 121),
    ("admin_reload", "Przeładowanie cache", "/admin/reload", 122),
    ("builder", "Kreator Modułów", "/builder", 123),
    ("search", "Szukaj globalnie", "/search", 124),
    ("reports", "Generator raportów", "/reports", 125),
    
    # Konfiguracja SNMS
    ("config_divisions", "Oddziały / Firmy", "/config/divisions", 130),
    ("config_netdev_catalog", "Katalog osprzętu", "/config/netdev-catalog", 131),
    ("config_network_hosts", "Pule IP (Hosty)", "/config/network-hosts", 132),
    ("config_number_plans", "Plany numeracji", "/config/number-plans", 133),
    ("config_vat", "Stawki VAT", "/config/vat-rates", 134),
    ("snms_entities", "Obiekty SNMS", "/snms", 135),
    
    # Profil
    ("auth_password", "Zmiana hasła", "/auth/change-password", 200),
]

# Sekcje bocznego menu (Kolejność wyświetlania)
NAV_GROUPS: list[tuple[str, tuple[str, ...]]] = [
    ("Start", ("dashboard",)),
    ("Klienci", ("customers", "customer_add", "customer_groups")),
    ("Infrastruktura", ("net_nodes", "net_map", "nodes", "netdevices", "device_groups", "monitoring", "network_tools", "monitoring_gpu", "monitor_config", "diagnostics", "admin_discovery", "admin_pit", "admin_passport")),
    ("Sieci IP", ("ip_networks", "net_usage", "addresses")),
    ("Finanse", ("subscriptions", "tariffs", "invoices", "payments", "ledger", "cash", "bulk_invoicing")),
    ("Helpdesk", ("helpdesk_tickets", "helpdesk_queues", "helpdesk_reports")),
    ("Dokumenty", ("documents",)),
    ("TERYT / Adresy", ("teryt", "teryt_cities", "admin_teryt_sync")),
    ("Konfiguracja", ("config_divisions", "config_netdev_catalog", "config_network_hosts", "config_number_plans", "config_vat", "snms_entities")),
    ("System", ("portal_users", "portal_roles", "portal_user_groups", "builder", "search", "reports", "admin_audit_logs", "admin_backups", "admin_reload")),
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
        "teryt",
        "helpdesk_tickets",
    }
    return {
        models.UserRole.admin: admin_keys,
        models.UserRole.manager: manager_keys,
        models.UserRole.service: service_keys,
        models.UserRole.view: {"dashboard", "auth_password", "helpdesk_tickets"},
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
    if "customer_groups" in visible_menu_keys and _under_prefix(p, "/customer-groups"):
        return True
    if "nodes" in visible_menu_keys and _under_prefix(p, "/customer-devices"):
        return True
    if "node_groups" in visible_menu_keys and _under_prefix(p, "/node-groups"):
        return True
    if "net_nodes" in visible_menu_keys and _under_prefix(p, "/net-nodes"):
        return True
    if "netdevices" in visible_menu_keys and _under_prefix(p, "/net-devices"):
        return True
    if "device_groups" in visible_menu_keys and _under_prefix(p, "/device-groups"):
        return True
    if "monitoring" in visible_menu_keys and _under_prefix(p, "/admin/monitoring"):
        return True
    if "network_tools" in visible_menu_keys and _under_prefix(p, "/admin/network-tools"):
        return True
    if "monitor_config" in visible_menu_keys and _under_prefix(p, "/admin/monitor-config"):
        return True
    if "diagnostics" in visible_menu_keys and _under_prefix(p, "/diagnostics"):
        return True
    if "dashboard" in visible_menu_keys and _under_prefix(p, "/admin/stats"):
        return True
    if "addresses" in visible_menu_keys and _under_prefix(p, "/addresses"):
        return True
    if "search" in visible_menu_keys and _under_prefix(p, "/search"):
        return True
    if "reports" in visible_menu_keys and _under_prefix(p, "/reports"):
        return True
    if "builder" in visible_menu_keys and _under_prefix(p, "/builder"):
        return True
    if "snms_entities" in visible_menu_keys and _under_prefix(p, "/snms"):
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
