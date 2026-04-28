# CRM Portal Project Documentation

## 1. Architecture Overview

The `crm-portal` is a modern Customer Relationship Management system designed for Internet Service Providers (ISPs), focusing on automation, reporting (UKE/PIT), and hardware management.

### Tech Stack
- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.14+) providing a high-performance asynchronous web server.
- **Database**: [SQLite](https://www.sqlite.org/) with [SQLAlchemy](https://www.sqlalchemy.org/) ORM for structured data persistence.
- **Frontend**: A thin-server architecture using [Jinja2](https://jinja.palletsprojects.com/) templates and [HTMX](https://htmx.org/) for rich, dynamic user interfaces without complex JavaScript frameworks.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first responsive design.

### Core Architecture Patterns
- **Lifespan Management**: Database initialization and seed logic are handled via FastAPI's `lifespan` context manager.
- **Middleware**: Custom middleware for request logging and session-based user authentication (`PortalUserMiddleware`).
- **Dependency Injection**: Heavy use of FastAPI dependencies for database sessions (`get_db`) and permission enforcement.

---

## 2. Key Modules

### `app/models.py`: Database Schema
The database layer defines several critical ISP-specific entities:
- **Customers**: Core CRM data, including TERYT-integrated addresses and relationship with subscriptions.
- **Location Entities**: `LocationState`, `LocationDistrict`, `LocationCity`, `LocationStreet` mapped to the Polish TERYT register.
- **Network Management**:
  - `Node`: Customer-side network termination points.
  - `NetDevice`: Network infrastructure (Routers, Switches, OLTs).
  - `IpNetwork`: IP pool management and allocation.
- **Finances**: `Tariff`, `Subscription`, `Invoice`, and `LedgerEntry` for automated billing.
- **RBAC**: `PortalUser` with roles (`admin`, `manager`, `service`, `view`) controlling access to specific routers and UI elements.

### `app/routers/`: API and View Logic
Endpoints are organized by feature set:
- `customers.py`: Management of subscriber data and HTMX-powered search.
- `net_nodes.py` / `nodes.py`: Network endpoint management.
- `finances.py`: Billing, invoicing, and payment tracking.
- `teryt.py`: Search and synchronization with the national territorial register.
- `diagnostics.py`: Real-time network diagnostics using integration services.

### `app/services/`: Integration Layer
Services abstract external system interactions:
- **Mikrotik**: `MikrotikService` for communicating with RouterOS devices via API.
- **TERYT**: Integration with the Polish Teryt register for standardized address data.
- **Geocoding**: `GugikGeocodingService` for authoritative address-to-coordinate translation.

---

## 3. Hardware Mocking

For development and testing environments where physical hardware is unavailable, the project employs a mocking strategy:

### `MockMikrotikService`
Located in `tests/mocks/mikrotik_service.py`, this class inherits from `MikrotikService` and overrides network-bound methods.
- **Purpose**: Allows testing of diagnostics API, node management, and discovery logic without side effects on production hardware.
- **Capabilities**: Simulates active sessions, interface statistics, and device responses.
- **Usage**: Automatically injected during testing via `pytest` monkeypatching or dependency overrides.

---

## 4. Geocoding and Coordinate Systems

The project integrates with the **GUGiK (Geoportal.gov.pl)** API to ensure compliance with Polish regulatory requirements.

### Coordinate Systems
- **WGS84 (Global)**: Used for frontend map visualizations (e.g., displaying customer locations on OpenStreetMap).
- **PUWG 1992 (EPSG:2180)**: Used for authoritative reporting to **PIT (Punkt Informacyjny ds. Telekomunikacji)** and **UKE (Urząd Komunikacji Elektronicznej)**.

### Implementation Details
The `GugikGeocodingService` (`app/services/gugik.py`) handles translation:
- **`geocode_address`**: Converts address strings to WGS84 Lat/Lon.
- **`get_coordinates_for_pit_uke`**: Retrieves structured coordinates in **EPSG:2180** using SIMC and ULIC codes, ensuring sub-meter accuracy required for regulatory filings.

---

## 5. Testing Framework

The project uses [pytest](https://docs.pytest.org/) with a tiered isolation strategy to balance speed and coverage.

### Tier 1: Unit & Integration Tests (In-Memory)
- **Database**: Uses `sqlite://` (in-memory) for high speed.
- **Isolation**: Every test function receives a clean database instance.
- **Scope**: Logic validation, CRUD operations, and permission checks.

### Tier 2: E2E and UI Tests (File-Based)
- **Database**: Uses `test_e2e_crm.sqlite` (file-based) to persist state across complex multi-step scenarios.
- **Server**: A background `uvicorn` process is spawned using the `server` fixture, allowing real HTTP interaction.
- **Playwright**: Used for browser-based automation to verify HTMX interactions and frontend workflows.

### Test Configuration
- `pytest.ini`: Configures pythonpath and custom markers (`integration`).
- `tests/conftest.py`: Defines global fixtures for database sessions, API clients, and authenticated session states.
