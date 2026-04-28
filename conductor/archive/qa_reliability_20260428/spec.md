# Specification: QA & Reliability Foundation

## Goal
Implement a comprehensive, automated testing framework for the CRM Portal to ensure calculation accuracy, data integrity, and hardware logic reliability.

## Core Components
1. **Automated Logic Testing**: Unit tests for VAT math, pricing, and address parsing.
2. **Persistence Integrity**: Integration tests for database operations (CRUD) using a temporary test database.
3. **Hardware Service Mocking**: A framework to simulate Mikrotik/OLT responses for testing diagnostics without physical devices.
4. **E2E UI Verification**: Automated browser flows for critical paths (Login, New Node, New Subscription).

## Success Criteria
- pytest executes all tests with 0 failures.
- Hardware-dependent code is testable via Mocks.
- Code coverage report is generated.
