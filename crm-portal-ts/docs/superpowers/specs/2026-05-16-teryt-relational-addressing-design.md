## TERYT Relational Addressing Design

### Goal
- Import single XML files `TERC`, `SIMC`, and `ULIC` into the TS runtime.
- Build full relational TERYT links for:
  - `wojewodztwo`
  - `powiat`
  - `gmina`
  - `miejscowosc`
  - `ulica`
- Use imported TERYT data for autosuggestions and default address prefill.
- Persist both human-readable address text and relational TERYT identifiers on customers and customer devices.

### Source Of Truth
- The implementation should reuse proven logic from the backup FastAPI project where possible:
  - `C:\Users\xxx\crm-portal-backup\app\teryt_import.py`
  - `C:\Users\xxx\crm-portal-backup\app\routers\teryt.py`
  - `C:\Users\xxx\crm-portal-backup\app\routers\addresses.py`
- The current TS runtime is the execution target and remains the product surface.

### Recommended Architecture
- Extend the TERYT model with an explicit `LocationCommune` entity instead of trying to infer communes from city rows.
- Keep text address fields for backward compatibility.
- Add relational TERYT ids next to text fields on:
  - customer correspondence address
  - customer-device installation address
- Treat imported TERYT rows as a local authoritative dictionary for autosuggestions.
- Treat the default managed area as a relational selection rooted in `commune`, with derived default district/state/city.

### Location Model

#### State
- `LocationState`
  - `id`
  - `name`
  - `terytCode`
  - `isActive`

#### District
- `LocationDistrict`
  - `id`
  - `stateId`
  - `name`
  - `terytCode`
  - `isActive`

#### Commune
- `LocationCommune`
  - `id`
  - `districtId`
  - `name`
  - `terytCode`
  - `communeCode`
  - `communeType`
  - `isManaged`
  - `isDefault`
  - `isActive`

#### City
- `LocationCity`
  - `id`
  - `districtId`
  - `communeId`
  - `name`
  - `terytCode`
  - `communeCode`
  - `communeType`
  - `isManaged`
  - `isDefault`
  - `isActive`

#### Street
- `LocationStreet`
  - `id`
  - `cityId`
  - `communeId`
  - `name`
  - `terytCode`

### Import Rules

#### TERC
- `TERC` creates or updates:
  - states
  - districts
  - communes
- Commune identity is based on:
  - `WOJ`
  - `POW`
  - `GMI`
  - `RODZ`

#### SIMC
- `SIMC` creates or updates cities and binds them to:
  - district
  - commune
- City identity is based on `SYM`.

#### ULIC
- `ULIC` creates or updates streets and binds them to:
  - city
  - commune
- Street identity is based on:
  - `cityId`
  - `SYM_UL`

### Default Managed Area
- The user can mark a commune as managed.
- The user can mark exactly one commune as default.
- When a commune becomes default:
  - it becomes managed automatically
  - its parent district and state become the default geographical context
  - the preferred default city inside that commune is selected automatically
- Recommended city-selection rule:
  - prefer an already default city in that commune
  - otherwise pick the alphabetically first city in that commune

### Customer Address Model
- Customer keeps one correspondence address.
- Customer should store:
  - `correspondenceStateId`
  - `correspondenceDistrictId`
  - `correspondenceCommuneId`
  - `correspondenceCityId`
  - `correspondenceStreetId`
  - text fields already present today
- Saving from UI should sync text fields from selected TERYT rows.

### Customer Device Address Model
- Each customer device keeps its own installation address.
- Customer device should store:
  - `installationStateId`
  - `installationDistrictId`
  - `installationCommuneId`
  - `installationCityId`
  - `installationStreetId`
  - text fields already present today
- Saving from UI should sync text fields from selected TERYT rows.

### API Changes

#### TERYT
- Keep local XML import endpoints, but accept uploaded file content rather than only raw pasted XML.
- Add API endpoints for:
  - state suggestions
  - district suggestions
  - commune suggestions
  - city suggestions
  - street suggestions
  - default managed area payload
  - managed/default commune toggles
- Return relational metadata in suggestion payloads so the UI can cascade selections.

#### Customers
- Extend serialization and update/create payloads with correspondence TERYT ids.

#### Customer Devices
- Extend serialization and update/create payloads with installation TERYT ids.

### Frontend Changes

#### TERYT Page
- Replace textarea-only import with XML file upload per dataset:
  - `TERC`
  - `SIMC`
  - `ULIC`
- Show imported counters and managed/default commune controls.

#### Customer Form
- Add autosuggestion controls for correspondence:
  - wojewodztwo
  - powiat
  - gmina
  - miejscowosc
  - ulica
- If the user leaves the address untouched on a new customer, prefill it from the default area.

#### Customer Device Editing
- Add installation-address editing UI using the same autosuggestion pattern.
- If there is no explicit user choice yet, prefill from the default area.

### Testing Strategy
- Add migration tests for new location and address-id fields.
- Add backend tests for:
  - `TERC` importing states, districts, communes
  - `SIMC` linking cities to communes
  - `ULIC` linking streets to cities and communes
  - setting managed/default commune
  - default area resolution
  - address suggestions at each level
  - customer save with correspondence TERYT ids
  - customer-device save with installation TERYT ids
- Add frontend coverage for:
  - customer detail address prefill
  - customer address suggestions
  - XML import UI logic where practical

### Out Of Scope
- ZIP ingestion from GUS
- Online SOAP TERYT sync in this round
- Building-number registries and parcel-level addressing
- Forced backfill of all existing customer records into TERYT ids
