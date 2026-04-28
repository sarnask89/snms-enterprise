# Conductor Workflow

## Task Lifecycle
1. **Research**: Analyze the task within the context of the track spec and plan.
2. **Implementation**: 
    - Write/Update code logic in `app/`.
    - Update templates in `templates/`.
    - Apply database migrations if schema changes.
3. **Testing**: 
    - Create/Update tests in `tests/`.
    - Run tests using `pytest`.
    - Verify UI manually via MCP Browser if applicable.
4. **Validation**: Ensure the task meets all criteria in the Implementation Plan.
5. **Documentation**: Update the local `plan.md` status.

## Commit Guidelines
- Use Conventional Commits.
- Scope: `feat(<module>)`, `fix(<module>)`, `refactor(<module>)`.
- Conductor specific: `chore(conductor): ...`.

## Review Protocol
- Run `arxitect:architecture-review` for significant architectural changes.
- Final verification with `verification-before-completion` skill.
