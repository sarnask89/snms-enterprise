# Mapowanie LMS ↔ SNMS (CRM Portal)

Źródło schematu LMS: `crm-portal/lms-26/lms-LMS_26/doc/lms.mysql` (tabele `nodes`, `netnodes`, `netdevices`, `networks`).

| LMS (tabela) | SNMS | Uwagi |
|----------------|------|--------|
| `nodes` | [`Node`](app/models.py) — UI: **Komputery / urządzenia klientów**, URL `/customer-devices` | Punkt przyłączenia abonenta: `ownerid` → `customer_id`, `netid` → `ip_network_id`, `netdev` → `net_device_id`. |
| `netnodes` | [`NetNode`](app/models.py) — **Węzły sieci (POP)**, `/net-nodes` | Infrastruktura / miejsce instalacji; `location_type` (piwnica, klatka, piętro, inne), adres TERYT opcjonalnie w modelu. |
| `netdevices` | [`NetDevice`](app/models.py) — `/net-devices` | `netnodeid` → `net_node_id`, `ownerid` → `customer_id`, `netdevicemodelid` → `net_device_model_id` (katalog: producenci / typy / modele). |
| `netdeviceproducers` / `netdevicetypes` / `netdevicemodels` | [`NetDeviceProducer`](app/models.py), [`NetDeviceType`](app/models.py), [`NetDeviceModel`](app/models.py) — `/config/netdev-catalog` | Słowniki jak w LMS; wybór modelu na formularzu osprzętu. |
| `hosts` | [`NetworkHost`](app/models.py) — `/config/network-hosts` | Host rozdzielczy dla puli IP; `IpNetwork.network_host_id` ≈ LMS `networks.hostid`. |
| `networks` | [`IpNetwork`](app/models.py) — `/ip-networks` | Pula IP (CIDR); powiązanie komputerów przez `Node.ip_network_id`. |

**Zgodność wsteczna URL:** żądania `/nodes` i `/nodes/...` przekierowują na `/customer-devices` (z aliasem `add` → `new`). Menu w bazie synchronizuje się z [`nav_access.NAV_DEFINITION`](app/nav_access.py).
