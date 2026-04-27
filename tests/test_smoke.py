import re

from fastapi.testclient import TestClient

from app.config import CRM_ADMIN_PASSWORD, CRM_ADMIN_USER
from app.main import app


def test_login_page_ok(client):
    r = client.get("/login")
    assert r.status_code == 200


def test_root_redirects_when_not_logged_in(client):
    r = client.get("/", follow_redirects=False)
    assert r.status_code == 303
    assert r.headers.get("location") == "/login"


def test_dashboard_and_snms_config_pages_with_admin_session(client):
    r = client.post(
        "/login",
        data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
        follow_redirects=False,
    )
    assert r.status_code == 302
    assert r.headers.get("location") == "/"
    home = client.get("/")
    assert home.status_code == 200
    assert "Pulpit" in home.text or "dashboard" in home.text.lower()

    for path in (
        "/config",
        "/config/divisions",
        "/config/vat-rates",
        "/config/number-plans",
        "/messages",
        "/messages/new",
        "/messages/api/template/1",
        "/helpdesk/reports",
        "/finances/invoices/new",
        "/customer-devices/search",
        "/customers/search",
        "/admin/users",
        "/admin/users/new",
        "/admin/user-groups",
        "/admin/user-groups/new",
    ):
        resp = client.get(path, follow_redirects=False)
        assert resp.status_code == 200, f"{path} -> {resp.status_code}"

        add_alias = client.get("/admin/users/add", follow_redirects=False)
        assert add_alias.status_code == 303
        assert add_alias.headers.get("location") == "/admin/users/new"

        ug_alias = client.get("/admin/user-groups/add", follow_redirects=False)
        assert ug_alias.status_code == 303
        assert ug_alias.headers.get("location") == "/admin/user-groups/new"
        cust_add = client.get("/customers/add", follow_redirects=False)
        assert cust_add.status_code == 303
        assert cust_add.headers.get("location") == "/customers/new"

        notices_hub = client.get("/customer-devices/notices", follow_redirects=False)
        assert notices_hub.status_code == 200

        warn_alias = client.get("/customers/warn", follow_redirects=False)
        assert warn_alias.status_code == 303
        assert warn_alias.headers.get("location") == "/customers/notices"

        print_alias = client.get("/customers/print", follow_redirects=False)
        assert print_alias.status_code == 303
        assert print_alias.headers.get("location") == "/customers/reports"

        cg_add = client.get("/customer-groups/add", follow_redirects=False)
        assert cg_add.status_code == 303
        assert cg_add.headers.get("location") == "/customer-groups/new"

        node_add = client.get("/nodes/add", follow_redirects=False)
        assert node_add.status_code == 307
        assert node_add.headers.get("location") == "/customer-devices/new"

        for ng_path in ("/node-groups", "/node-groups/new"):
            ng = client.get(ng_path, follow_redirects=False)
            assert ng.status_code == 200, f"{ng_path} -> {ng.status_code}"
        ng_alias = client.get("/node-groups/add", follow_redirects=False)
        assert ng_alias.status_code == 303
        assert ng_alias.headers.get("location") == "/node-groups/new"

        nr = client.get("/customer-devices/reports", follow_redirects=False)
        assert nr.status_code == 200
        node_csv = client.get("/customer-devices/reports.csv")
        assert node_csv.status_code == 200
        assert "text/csv" in node_csv.headers.get("content-type", "")
        print_alias = client.get("/customer-devices/print", follow_redirects=False)
        assert print_alias.status_code == 303
        assert print_alias.headers.get("location") == "/customer-devices/reports"

        nn = client.get("/net-nodes", follow_redirects=False)
        assert nn.status_code == 200
        nn_search = client.get("/net-nodes/search", follow_redirects=False)
        assert nn_search.status_code == 200

        nd_search = client.get("/net-devices/search", follow_redirects=False)
        assert nd_search.status_code == 200
        nd_add = client.get("/net-devices/add", follow_redirects=False)
        assert nd_add.status_code == 303
        assert nd_add.headers.get("location") == "/net-devices/new"
        nd_rep = client.get("/net-devices/reports", follow_redirects=False)
        assert nd_rep.status_code == 200
        nd_print = client.get("/net-devices/print", follow_redirects=False)
        assert nd_print.status_code == 303
        assert nd_print.headers.get("location") == "/net-devices/reports"

        ip_s = client.get("/ip-networks/search", follow_redirects=False)
        assert ip_s.status_code == 200
        cat = client.get("/config/netdev-catalog", follow_redirects=False)
        assert cat.status_code == 200
        nh = client.get("/config/network-hosts", follow_redirects=False)
        assert nh.status_code == 200
        ip_add = client.get("/ip-networks/add", follow_redirects=False)
        assert ip_add.status_code == 303
        assert ip_add.headers.get("location") == "/ip-networks/new"

        ta = client.get("/finances/tariffs/add", follow_redirects=False)
        assert ta.status_code == 303
        assert ta.headers.get("location") == "/finances/tariffs"
        pa = client.get("/finances/payments/add", follow_redirects=False)
        assert pa.status_code == 303
        assert pa.headers.get("location") == "/finances/payments"

        inv_add = client.get("/finances/invoices/add", follow_redirects=False)
        assert inv_add.status_code == 303
        assert inv_add.headers.get("location") == "/finances/invoices/new"
        bal_add = client.get("/finances/balance/add", follow_redirects=False)
        assert bal_add.status_code == 303
        assert bal_add.headers.get("location") == "/finances/balance"

        cash_add = client.get("/finances/cash/add", follow_redirects=False)
        assert cash_add.status_code == 303
        assert cash_add.headers.get("location") == "/finances/cash"

        csv_resp = client.get("/helpdesk/reports.csv")
        assert csv_resp.status_code == 200
        assert "text/csv" in csv_resp.headers.get("content-type", "")
        assert b"tytul" in csv_resp.content.lower()

        inv_page = client.get("/finances/invoices")
        assert inv_page.status_code == 200
        m = re.search(r"/finances/invoices/(\d+)/edit", inv_page.text)
        if m:
            ed = client.get(f"/finances/invoices/{m.group(1)}/edit")
            assert ed.status_code == 200

        del_r = client.post("/finances/invoices/999999/delete", follow_redirects=False)
        assert del_r.status_code == 303
        assert del_r.headers.get("location") == "/finances/invoices"

def test_static_health_no_crash_on_finances_list(client):
    client.post(
        "/login",
        data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
    )
    r = client.get("/finances/invoices")
    assert r.status_code == 200

