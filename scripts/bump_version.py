import sys
from pathlib import Path

def bump_version(part="patch"):
    version_file = Path(__file__).parent / "VERSION"
    if not version_file.exists():
        current_version = "1.0.0"
    else:
        current_version = version_file.read_text().strip()
    
    major, minor, patch = map(int, current_version.split('.'))
    
    if part == "major":
        major += 1
        minor = 0
        patch = 0
    elif part == "minor":
        minor += 1
        patch = 0
    else:
        patch += 1
        
    new_version = f"{major}.{minor}.{patch}"
    version_file.write_text(new_version)
    print(f"Version bumped from {current_version} to {new_version}")
    return new_version

if __name__ == "__main__":
    part = sys.argv[1] if len(sys.argv) > 1 else "patch"
    bump_version(part)
