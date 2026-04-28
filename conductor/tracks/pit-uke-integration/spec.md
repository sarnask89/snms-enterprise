# Specification: UKE PIT System Integration

## Overview
The goal is to allow the system to export network infrastructure data in a format compliant with the UKE PIT (Punkt Informacyjny ds. Telekomunikacji) system requirements. This requires precise geographical data in the PUWG 1992 (EPSG:2180) coordinate system.

## Requirements

### 1. Coordinate System Support
- The system must store and handle coordinates in PUWG 1992 (EPSG:2180).
- Transformation or retrieval from GUGiK (ULDK API) is required for all addresses and network nodes.
- Latitude/Longitude (WGS84) is insufficient for UKE PIT GML files.

### 2. TERYT Integration
- Full 14-digit TERYT identifiers (SIMC + ULIC + number) must be used to precisely locate objects.
- Integration with the existing `TerytImportService` and `GugikGeocodingService`.

### 3. GML Generation
- Export of infrastructure data (nodes, lines, services) into GML format compliant with UKE PIT schema.
- Support for key PIT attributes:
    - Object ID (TERYT based)
    - X, Y coordinates in EPSG:2180
    - Object type (e.g., node, cable, duct)

### 4. Data Synchronization
- Background process or UI trigger to fetch PUWG 1992 coordinates for existing addresses.
- Auto-sync for new addresses added to the system.

## Data Model Changes
- **Address Model**: Add `x_1992` and `y_1992` fields.
- **NetNode Model**: Add `x_1992` and `y_1992` fields (if distinct from address).

## API Endpoints
- `GET /api/v1/pit/export`: Export GML file for the entire network or selected nodes.
- `POST /api/v1/pit/sync`: Trigger coordinate synchronization for all addresses.

## UI Requirements
- View/Edit PUWG 1992 coordinates in address and node forms.
- PIT Export button in the Admin or Diagnostics panel.
- Status indicator for coordinate synchronization.
