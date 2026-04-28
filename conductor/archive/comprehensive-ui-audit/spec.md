# Specification: Comprehensive UI Audit & Bugfixing

## Overview
Perform a systematic verification of the entire CRM portal user interface. The goal is to ensure that every page, form, button, and interaction works as expected, follows consistent patterns, and handles edge cases (like null values) gracefully.

## Scope

### 1. Page Verification
- Every link in the sidebar must lead to a functional page.
- Breadcrumbs must accurately reflect the navigation path.

### 2. Form & CRUD Verification
- **Create**: Forms must validate required fields and save data correctly.
- **Read**: List views must display data correctly, including handling empty states.
- **Update**: Edit forms must be pre-filled and correctly persist changes without side effects (e.g., unexpected ID re-assignment).
- **Delete**: Delete actions must prompt for confirmation and successfully remove records.

### 3. Interaction Audit
- **Search**: Search inputs must filter lists correctly.
- **Toggles**: Status switches (active/inactive) must work instantly.
- **Action Buttons**: Edit, Delete, and custom action buttons must trigger the correct behavior.

### 4. Bugfixing Priorities
- **None strings**: Replace literal "None" text with empty strings or placeholders (—).
- **ID Integrity**: Ensure editing a record does not change its primary identifier or number sequence.
- **Router completeness**: Ensure all app features are accessible via registered routes.
