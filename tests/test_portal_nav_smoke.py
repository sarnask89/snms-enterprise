"""
Symulacja przeglądarki (sesja + GET): każda ścieżka z menu i dodatkowe widoki.
Wymaga działającej bazy jak przy pytest (sqlite crm.sqlite).
"""
from __future__ import annotations

from typing import Iterable

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select

from app.config import CRM_ADMIN_PASSWORD, CRM_ADMIN_USER
from app.database import SessionLocal
from app import models
from app.main import app
from app.nav_access import NAV_DEFINITION

# Ścieżki spoza NAV (często linkowane z pulpitu / modułów)
EXTRA_GET_PATHS: tuple[str, ...] = (
    "/helpdesk/tickets",
    "/helpdesk/tickets/new",
    "/helpdesk/queues/new",
    "/helpdesk/categories/new",
    "/documents/new",
    "/messages/templates/new",
    "/voip/new",
    "/hosting/new",
    "/timetable/new",
    "/stats/new",
    "/config/new",
    "/teryt/ws/check",
)


def _login_client() -> TestClient:
    c = TestClient(app)
    r = c.post(
        "/login",
        data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
        follow_redirects=False,
    )
    assert r.status_code in (302, 303), f"login failed: {r.status_code} {r.text[:200]}"
    return c


def _collect_nav_paths() -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for _k, _lbl, path, _so in NAV_DEFINITION:
        p = path.rstrip("/") or "/"
        if p not in seen:
            seen.add(p)
            out.append(path if path == "/" else path.rstrip("/") or "/")
    return out


def _merge_paths() -> list[str]:
    s = set(_collect_nav_paths())
    for p in EXTRA_GET_PATHS:
        s.add(p)
    # Zachowaj sensowną kolejność: najpierw menu, potem extra
    ordered = [p for p in _collect_nav_paths() if p in s]
    for p in EXTRA_GET_PATHS:
        if p in s and p not in ordered:
            ordered.append(p)
    return ordered


@pytest.fixture(scope="module")
def admin_client() -> Iterable[TestClient]:
    yield _login_client()


@pytest.mark.parametrize("path", _merge_paths())
def test_admin_get_nav_and_extra_paths_200(admin_client: TestClient, path: str) -> None:
    r = admin_client.get(path, follow_redirects=True)
    assert r.status_code == 200, f"{path} -> {r.status_code}\n{r.text[:500]}"


def test_helpdesk_ticket_detail_if_any(admin_client: TestClient) -> None:
    db = SessionLocal()
    try:
        t = db.scalars(select(models.SupportTicket).limit(1)).first()
    finally:
        db.close()
    if not t:
        pytest.skip("brak zgłoszenia w bazie")
    r = admin_client.get(f"/helpdesk/tickets/{t.id}", follow_redirects=True)
    assert r.status_code == 200


def test_customer_edit_if_any(admin_client: TestClient) -> None:
    db = SessionLocal()
    try:
        c = db.scalars(select(models.Customer).limit(1)).first()
    finally:
        db.close()
    if not c:
        pytest.skip("brak klienta")
    r = admin_client.get(f"/customers/{c.id}/edit", follow_redirects=True)
    assert r.status_code == 200


def test_node_edit_if_any(admin_client: TestClient) -> None:
    db = SessionLocal()
    try:
        n = db.scalars(select(models.Node).limit(1)).first()
    finally:
        db.close()
    if not n:
        pytest.skip("brak komputera")
    r = admin_client.get(f"/customer-devices/{n.id}/edit", follow_redirects=True)
    assert r.status_code == 200


def test_ip_suggestions_partial_if_network(admin_client: TestClient) -> None:
    db = SessionLocal()
    try:
        net = db.scalars(select(models.IpNetwork).limit(1)).first()
    finally:
        db.close()
    if not net:
        pytest.skip("brak sieci IP")
    u = f"/customer-devices/partials/ip-suggestions?ip_network_id={net.id}&node_id="
    r = admin_client.get(u, follow_redirects=True)
    assert r.status_code == 200
    assert "node-ip-suggestions" in r.text


def test_legacy_nodes_redirect(admin_client: TestClient) -> None:
    r = admin_client.get("/nodes", follow_redirects=False)
    assert r.status_code in (302, 303, 307, 308)
    loc = r.headers.get("location", "")
    assert "customer-devices" in loc


def test_document_post_minimal(admin_client: TestClient) -> None:
    """Przycisk zapisu (POST) — dokument bez pliku."""
    db = SessionLocal()
    try:
        c = db.scalars(select(models.Customer).limit(1)).first()
    finally:
        db.close()
    if not c:
        pytest.skip("brak klienta")
    r = admin_client.post(
        "/documents/new",
        data={
            "title": "smoke-test-doc",
            "doc_type": "other",
            "customer_id": str(c.id),
            "notes": "pytest smoke",
        },
        follow_redirects=False,
    )
    assert r.status_code in (303, 302), r.text[:300]
    assert "/documents" in (r.headers.get("location") or "")


def test_helpdesk_search_get_form(admin_client: TestClient) -> None:
    r = admin_client.get("/helpdesk/search?q=test", follow_redirects=True)
    assert r.status_code == 200


def test_finances_tariffs_list_query(admin_client: TestClient) -> None:
    r = admin_client.get("/finances/tariffs", follow_redirects=True)
    assert r.status_code == 200
