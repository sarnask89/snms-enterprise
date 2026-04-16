# Pętla parity LMS ↔ SNMS Enterprise (`crm-portal`)

Źródło LMS: `lms-LMS_26/lib/menu.php` (`?m=…`). Kolejność pozycji w menu bocznym SNMS: `app/nav_access.py` (`NAV_GROUPS`), zgodnie z kolejnością submenu w LMS tam, gdzie jest mapowanie 1:1. Jedna iteracja (`x++`) = jedna logiczna luka + testy smoke / nawigacji.

| x | LMS `?m=` | SNMS (ścieżka) | Pliki / notatki |
|---|-----------|----------------|-----------------|
| 0 | `netdevprint` | `/net-devices/reports`, `/reports.csv`, `/print` | `routers/netdevices.py`, `templates/netdevices/reports.html`, `nav_access.py` (`netdevices_reports`) |
| 1 | `netdevsearch`, `netdevadd` | `/net-devices/search`, `GET /net-devices?q=…`, `/add`→`/new` | `netdevices.py`, `netdevices/search.html`, lista + filtr, `nav_access` (`netdevices_search`, `netdevices_add`) |
| 2 | `netsearch`, `netadd` | `/ip-networks/search`, `GET /ip-networks?q=…`, `/add`→`/new` | `ip_networks.py`, `ip_networks/search.html`, lista + filtr (VLAN jeśli `q` numeryczne), `nav_access` (`ip_networks_search`, `ip_networks_add`); rola `view` + te klucze |
| 3 | `tariffadd`, `paymentadd` | `/finances/tariffs/add`→`/tariffs`, `/finances/payments/add`→`/payments` | `finances.py`; menu: `tariff_add`, `finances_payment_add`; przesunięte `sort_order` (finanse–config); **fix** grupa Sieci IP w `NAV_GROUPS` |
| 4 | `invoicenew`, `balancenew` | `/finances/invoices/add`→`/invoices/new`, `/finances/balance/add`→`/balance` | `finances.py`; menu: `invoice_add`, `finances_balance_add`; grupa **Finanse** w `NAV_GROUPS` uzupełniona (taryfa/płatność/bilans); `view_keys` |
| 5 | `receiptadd` | `/finances/cash/add`→`/cash` | `finances.py`; `finances_cash_add`; `sort_order` po Kasie; `view_keys` |

Następna iteracja (propozycja): helpdesk **`ticketadd`** alias lub VoIP **`voipaccountadd`** — wg `menu.php`.
