# Implementation Plan: Reliability Foundation

## Phase 1: Test Infrastructure & Unit Tests [checkpoint: 66eafc9]
- [x] Configure pytest and conftest.py (Set up in-memory SQLite for tests) 8a4a50c
- [x] Implement Unit Tests for Tariff.monthly_price_gross and bidirectional calculations. 8365631
- [x] Implement Unit Tests for TERYT address parsing and geocoding logic. b38354f
- [x] Research and implement GugikGeocodingService using official WSDL (GUGiK Geoportal). 4253730
- [x] Cleanup: Remove VoIP and Hosting related models, routers, and templates. 75b6282
- [x] Stabilize Core Flows: Focus on Mikrotik Import, Customers, Customer Devices, Nodes, Subscriptions, Tariffs, and Portal User/Role Management. Skip Documents, Storage, and Geocoding for now. 75b6282

## Phase 2: Integration & API Testing [checkpoint: 75b6282]
- [x] Create 	ests/test_integration_crud.py for Customers, Nodes, and Tariffs. 66eafc9
- [x] Implement API tests for Subscription creation (verifying device-linking logic). a66a0ce

## Phase 3: Hardware Mocking (The "Digital Twin") [checkpoint: 4253730]
- [x] Create 	ests/mocks/mikrotik_service.py to simulate RouterOS responses. df81b2d
- [x] Implement tests for the Sprawdź diagnostic tool using mocks. aada05e

## Phase 4: E2E Browser Testing
- [x] Set up playwright (or pytest-playwright). 4253730
- [x] Create automated flow: Login -> Search TERYT -> Add Node -> Verify Map (Geocoding check skipped per user steering). 75b6282
