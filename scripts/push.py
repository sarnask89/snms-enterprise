import subprocess
import sys
from pathlib import Path
from bump_version import bump_version

def run_command(cmd):
    print(f"Running: {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error: {result.stderr}")
        sys.exit(1)
    return result.stdout

def push_with_version(part="patch"):
    # 1. Bump version
    new_version = bump_version(part)
    
    # 2. Git operations
    run_command("git add scripts/VERSION app/__init__.py scripts/bump_version.py scripts/push.py")
    run_command(f'git commit -m "chore: bump version to {new_version}"')
    run_command(f"git tag v{new_version}")
    
    # 3. Push
    print(f"Pushing v{new_version} to remote...")
    run_command("git push origin main --tags")
    print("Successfully pushed with new version tag.")

if __name__ == "__main__":
    part = sys.argv[1] if len(sys.argv) > 1 else "patch"
    push_with_version(part)
