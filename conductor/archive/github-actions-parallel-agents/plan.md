# Conductor Plan: GitHub Actions Parallel Agent Tasking

This plan guides the creation of a GitHub Actions workflow that runs multiple Gemini agents in parallel for different tasks.

## Plan Steps

- [x] **Gather Task Definitions:**
    - Use `ask_user` to get the list of independent tasks to be parallelized. For each task, we need a descriptive name and a detailed prompt for the agent.

- [x] **Create GitHub Actions Workflow Directory:**
    - Create the `.github/workflows` directory if it doesn't exist.

- [x] **Generate the GitHub Actions Workflow File:**
    - Use `write_file` to create `.github/workflows/parallel-agents.yml`.
    - The content of the YAML file will be generated based on the tasks gathered in step 1.
    - The workflow should be triggered on `workflow_dispatch` to allow manual triggering.
    - It will have a `jobs` section where each task from step 1 becomes a separate job.
    - All jobs will run in parallel.

- [x] **Define Each Job:**
    - Each job will run on `ubuntu-latest`.
    - It will have a step to checkout the code.
    - It will have a `run` step that executes a command to invoke the Gemini agent for the specific task. This will look something like:
      ```bash
      gemini --no-system-prompt invoke-agent generalist --prompt "..."
      ```
    - The prompt for each job will be the one provided by the user in step 1.

- [x] **Finalize and Inform User:**
    - Inform the user that the workflow has been created at `.github/workflows/parallel-agents.yml`.
    - Provide instructions on how to use it (e.g., "Go to the Actions tab in your GitHub repository and run the 'Parallel Agent Tasks' workflow.").
