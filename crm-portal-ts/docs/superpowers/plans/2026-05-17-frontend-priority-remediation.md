# Frontend Priority Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ujednolicić trzy priorytetowe ekrany frontendu (`network/devices`, `customer-devices`, `operations`) do wzorca Nuxt UI v4 dashboard i domknąć ich najważniejsze luki funkcjonalne.

**Architecture:** Każdy ekran ma używać `UDashboardPanel` z `UDashboardNavbar` i `UTable`, a formularze i akcje mają przejść na semantyczne komponenty Nuxt UI. Prace idą ekran po ekranie, zaczynając od `network/devices`, bo ten moduł ma największą lukę między backendem a UI.

**Tech Stack:** Nuxt 4, @nuxt/ui v4, useFetch, UTable, UDashboardPanel, UDashboardToolbar, UModal/UDropdownMenu, node:test

---

### Task 1: Network Devices parity

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\network\devices.vue`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\network-devices-page.test.mjs`

- [ ] Przebudować ekran do `UDashboardPanel` z pełnoszeroką tabelą i toolbarami zgodnymi z Nuxt UI dashboard.
- [ ] Dodać brakujące pola backendowe do formularza: `snmpCommunity`, `loginUrl`, `driverType`, `mgmtUsername`.
- [ ] Zastąpić przyciski akcji w wierszu pojedynczym `UDropdownMenu`.
- [ ] Dodać akcję przejścia do `operations` dla urządzenia i zachować edycję/usuwanie.
- [ ] Dodać test plikowy potwierdzający dashboard shell, brakujące pola i dropdown akcji.

### Task 2: Customer Devices operational actions

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\customer-devices.vue`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\customer-devices-page.test.mjs`

- [ ] Rozszerzyć menu działań urządzenia klienta o przejście do diagnostyki, klienta i workflow operacyjnego.
- [ ] Dodać odkrywalne akcje dla rekordów `ONU` i urządzeń manualnych.
- [ ] Zachować tabelaryczny układ `UTable` i filtry status/vendor/type.

### Task 3: Operations import ergonomics

**Files:**
- Modify: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\app\pages\operations.vue`
- Test: `C:\Users\xxx\crm-portal\crm-portal-ts\frontend\tests\operations-page.test.mjs`

- [ ] Zastąpić ręczne pola ID dla klienta, sieci i urządzenia wyszukiwalnymi selektorami Nuxt UI.
- [ ] Uporządkować sekcje według workflow: profile, scan, session import, diagnostics.
- [ ] Zachować obecny zakres funkcjonalny bez regresji Dasan/Mikrotik.
