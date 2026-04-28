# Specification: GitHub Actions for Parallel Agent Tasking

## 1. Objective

To create a reusable GitHub Actions workflow that can execute multiple, independent tasks in parallel by invoking Gemini agents.

## 2. Requirements

-   The workflow must be manually triggerable via `workflow_dispatch`.
-   The workflow must accept a list of tasks as input. Each task should include a name and a detailed prompt for the agent.
-   The workflow must create a separate job for each task, and all jobs must run in parallel.
-   Each job must use a Gemini agent (e.g., `generalist`) to execute the task based on the provided prompt.
-   The implementation should be placed in `.github/workflows/parallel-agents.yml`.

## 3. Acceptance Criteria

-   A new workflow file is created at `.github/workflows/parallel-agents.yml`.
-   The workflow can be manually triggered from the GitHub Actions UI.
-   When triggered with a list of tasks, the workflow runs one job per task in parallel.
-   Each job successfully invokes a Gemini agent with the correct prompt.
