# Specification: Automated Versioning System

## Overview
The goal is to ensure every `git push` is associated with a unique, incremented version number. This provides traceability and makes it easier to reference specific releases.

## Requirements

### 1. Version Increment Logic
- Support Semantic Versioning (Major.Minor.Patch).
- Default to incrementing the **Patch** version.
- Ability to manually specify Major or Minor increments.

### 2. Version Storage
- Centralized `VERSION` file in the project root.
- Synchronization with `app/__init__.py` for runtime access.

### 3. Git Integration
- Automatically create a Git tag (e.g., `v1.2.3`) matching the new version.
- Commit the version change before pushing.
- Push both the commit and the tag.

### 4. User Experience
- Provide a simple CLI tool (e.g., `python scripts/push_version.py`).
- Clear feedback on the old and new version numbers.
