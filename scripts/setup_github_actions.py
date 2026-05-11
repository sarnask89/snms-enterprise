import subprocess
import json
import os
from pathlib import Path

def run_gh(args):
    cmd = ["gh"] + args
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
    else:
        print(f"Success: {result.stdout.strip()}")

def setup_github():
    # 1. Load local Gemini settings for GCP info
    settings_path = Path('C:/Users/xxx/.gemini/settings.json')
    gcp_project = "gen-lang-client-0185619667" # Fallback from logs
    gcp_location = "global"
    
    # 2. Load token from .env
    token = "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"

    print("Setting up GitHub Actions Secrets and Variables...")

    # Variables
    run_gh(["variable", "set", "GOOGLE_CLOUD_PROJECT", "--body", gcp_project])
    run_gh(["variable", "set", "GOOGLE_CLOUD_LOCATION", "--body", gcp_location])
    run_gh(["variable", "set", "GEMINI_MODEL", "--body", "gemini-3.1-pro-preview"])

    # Secrets
    # Note: GEMINI_API_KEY might be needed if not using ADC
    # For now, we'll set GITHUB_TOKEN if not automatically provided
    # run_gh(["secret", "set", "GITHUB_TOKEN", "--body", token])

    print("\nGitHub Actions configuration attempted. Ensure 'gh' CLI is authenticated.")

if __name__ == "__main__":
    setup_github()
