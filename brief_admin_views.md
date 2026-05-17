### Podsumowanie Użytkowników

**ModelView**: `PortalUserAdmin`
- **Kolumny**: `id`, `username`, `role`, `active`
- **Szukanie**: `username`
- **Nazwa**: "Użytkownik Portalu"
- **Rodzaj ikony**: `fa-solid fa-user-shield`
- **Kategoria**: "Użytkownicy"

**ModelView**: `PortalUserGroupAdmin`
- **Kolumny**: `id`, `name`
- **Szukanie**: `name`
- **Nazwa**: "Grupa Użytkowników"
- **Rodzaj ikony**: `fa-solid fa-users-gear`
- **Kategoria**: "Użytkownicy"

### Podsumowanie CRM

**ModelView**: `CustomerAdmin`
- **Kolumny**: `id`, `customer_code`, `first_name`, `last_name`, `status`
- **Szukanie**: `customer_code`, `last_name`, `email`
- **Nazwa**: "Klient"
- **Rodzaj ikony**: `fa-solid fa-users`
- **Kategoria**: "CRM"

**ModelView**: `CustomerGroupAdmin`
- **Kolumny**: `id`, `name`
- **Szukanie**: `name`
- **Nazwa**: "Grupa Klientów"
- **Rodzaj ikony**: `fa-solid fa-people-group`
- **Kategoria**: "CRM"

**ModelView**: `CustomerNoticeAdmin`
- **Kolumny**: `id`, `customer_id`, `title`, `is_active`
- **Szukanie**: `title`
- **Nazwa**: "Notatka o Kliencie"
- **Rodzaj ikony**: `fa-solid fa-note-sticky`
- **Kategoria**: "CRM"

**ModelView**: `SubscriptionAdmin`
- **Kolumny**: `id`, `customer_id`, `tariff_id`, `active`
- **Szukanie**: `customer_id`, `tariff_id`
- **Nazwa**: "Abonament"
- **Rodzaj ikony**: `fa-solid fa-file-contract`
- **Kategoria**: "CRM"

### Podsumowanie Finanse

**ModelView**: `TariffAdmin`
- **Kolumny**: `id`, `name`, `monthly_price`, `active`
- **Szukanie**: `name`
- **Nazwa**: "Taryfa"
- **Rodzaj ikony**: `fa-solid fa-tags`
- **Kategoria**: "Finanse"

**ModelView**: `InvoiceAdmin`
- **Kolumny**: `id`, `number`, `amount`, `status`, `issue_date`
- **Szukanie**: `number`
- **Nazwa**: "Faktura"
- **Rodzaj ikony**: `fa-solid fa-file-invoice-dollar`
- **Kategoria**: "Finanse"

**ModelView**: `VatRateAdmin`
- **Kolumny**: `id`, `label`, `rate_percent`, `is_default`
- **Szukanie**: `label`
- **Nazwa**: "Stawka VAT"
- **Rodzaj ikony**: `fa-solid fa-percent`
- **Kategoria**: "Finanse"

### Podsumowanie Sieć

**ModelView**: `NetNodeAdmin`
- **Kolumny**: `id`, `name`, `location_city_id`
- **Szukanie**: `name`
- **Nazwa**: "Węzeł Sieciowy"
- **Rodzaj ikony**: `fa-solid fa-network-wired`
- **Kategoria**: "Sieć"

**ModelView**: `NetDeviceAdmin`
- **Kolumny**: `id`, `name`, `management_ip`, `status`
- **Szukanie**: `name`, `management_ip`
- **Nazwa**: "Urządzenie"
- **Rodzaj ikony**: `fa-solid fa-server`
- **Kategoria**: "Sieć"

**ModelView**: `CustomerDeviceAdmin`
- **Kolumny**: `id`, `hostname`, `ip_address`, `status`
- **Szukanie**: `hostname`, `ip_address`
- **Nazwa**: "Urządzenie Klienta"
- **Rodzaj ikony**: `fa-solid fa-desktop`
- **Kategoria**: "CRM"

**ModelView**: `CustomerDeviceGroupAdmin`
- **Kolumny**: `id`, `name`
- **Szukanie**: `name`
- **Nazwa**: "Grupa Usług"
- **Rodzaj ikony**: `fa-solid fa-layer-group`
- **Kategoria**: "Sieć"

**ModelView**: `IpNetworkAdmin`
- **Kolumny**: `id`, `name`, `cidr`, `active`
- **Szukanie**: `