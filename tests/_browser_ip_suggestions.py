"""Symulacja przeglądarki: logowanie → formularz → partial sugestii IP."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from fastapi.testclient import TestClient

from app.config import CRM_ADMIN_PASSWORD, CRM_ADMIN_USER
from app.main import app

c = TestClient(app)
r = c.post(
    "/login",
    data={"username": CRM_ADMIN_USER, "password": CRM_ADMIN_PASSWORD},
    follow_redirects=False,
)
print("login", r.status_code)
p = c.get("/customer-devices/new")
print("form", p.status_code)
block = re.search(
    r'<select[^>]*name="ip_network_id"[^>]*>(.*?)</select>', p.text, re.DOTALL
)
if not block:
    print("BRAK select ip_network_id")
    sys.exit(1)
opts = re.findall(r'<option value="(\d*)"', block.group(1))
vals = [x for x in opts if x]
print("ip_network_id wartości (niepuste):", vals[:10])
if not vals:
    print("Brak sieci IP w bazie — dodaj sieć w /ip-networks")
    sys.exit(0)
nid = vals[0]
u = f"/customer-devices/partials/ip-suggestions?ip_network_id={nid}&node_id="
r2 = c.get(u)
print("partial", r2.status_code, "bytes", len(r2.text))
print(r2.text[:500])
oc = r2.text.count("<option")
print("liczba <option w odpowiedzi:", oc)
