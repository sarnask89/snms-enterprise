# Specification: Dasan OLT Integration

## Overview
This track implements the integration layer necessary to communicate with Dasan Optical Line Terminals (OLTs). The goal is to provide real-time diagnostic information (e.g., ONU status, optical signal levels, connected MAC addresses) directly within the CRM Portal interface without requiring manual SSH logins.

## Requirements
- Connect to Dasan OLTs via SSH using encrypted credentials stored in the `NetDevice` model.
- Parse custom CLI outputs for commands like `show onu active`, `show olt mac`, and `show olt rx-power`.
- Automatically map discovered ONUs to their parent OLT infrastructure inside the `NetDevice` database table.
- Link individual `CustomerDevice` records to their associated parent ONUs using MAC address lookups.
- Expose an API endpoint that renders a real-time diagnostic view for a selected PON port or customer device using HTMX.

## Architecture
- **DasanService:** A dedicated Python service class wrapping `paramiko` to handle SSH connections and command parsing.
- **Data Models:** Expand `NetDevice` to support parent-child relationships (OLT -> ONU) and associate `CustomerDevice` records with ONU uplink ports.
- **API & UI:** Provide REST/HTMX endpoints under `/diagnostics/olt-lookup` and `/net-devices/{id}/pon-port/` that feed live templates with structured data.