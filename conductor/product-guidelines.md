# Product Guidelines

## Design Principles
- **Simplicity & Performance:** The UI should be fast and responsive, leveraging HTMX to minimize full page reloads and keeping client-side state minimal.
- **Consistency:** Maintain a consistent visual hierarchy and interaction model across all modules (Customers, Infrastructure, Finance).
- **Accessibility:** Ensure the portal is usable via keyboard navigation and respects standard accessibility contrasts.

## Code Quality & Architecture
- **Object-Oriented Focus:** Encapsulate business logic into well-defined classes and services (e.g., `DasanService`, `MikrotikService`). Avoid polluting FastAPI routers with complex logic.
- **DRY (Don't Repeat Yourself):** Identify repetitive code patterns, especially in database queries and UI templates, and extract them into reusable utilities or Jinja2 macros.
- **Strict Typing:** Use Python type hints extensively to leverage FastAPI's validation and improve developer experience.
- **Auditability:** Every state-changing operation must be logged using the centralized audit service.

## Development Workflow
- **Iterative Refactoring:** Prioritize refactoring existing large files into smaller, focused modules when adding new features.
- **Testing:** Ensure all new services and complex logic have accompanying unit tests. Reproduce bugs with test cases before applying fixes.