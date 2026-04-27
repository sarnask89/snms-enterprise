# Specification - Customer & Address Management

## Overview
This track focuses on the foundational customer management capabilities, integrated with GUS TERYT for address verification. It ensures that every customer record is linked to a valid geographical location according to official Polish dictionaries.

## Scope
- **Address Management:**
  - Search interface for TERYT cities, streets, and building numbers.
  - Linking customer locations to specific TERYT IDs.
- **Customer CRM:**
  - Basic CRUD for customer profiles.
  - Association of customers with service addresses.
- **Integration:**
  - UI components for address lookup (HTMX-powered).
  - Backend logic for querying local TERYT cache/API.

## Technical Details
- **Backend:** FastAPI with SQLModel.
- **Frontend:** HTMX with Tailwind CSS.
- **Data Source:** GUS TERYT API (via existing `app/teryt_ws.py` or similar).

## Constraints
- Must adhere to Polish address standards (TERYT).
- UI must be consistent with the existing dashboard theme.
