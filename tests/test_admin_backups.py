import pytest
from fastapi.testclient import TestClient
from pathlib import Path
import shutil

def test_admin_backups_flow(admin_client: TestClient):
    # Ensure backups dir exists
    Path("backups").mkdir(exist_ok=True)
    
    # 1. List backups (initially empty or some existing)
    response = admin_client.get("/admin/backups")
    assert response.status_code == 200
    
    # 2. Create backup
    response = admin_client.post("/admin/backups/create", follow_redirects=True)
    assert response.status_code == 200
    assert "backup_" in response.text
    
    # Find the filename in the response
    import re
    match = re.search(r'backup_\d{8}_\d{6}\.sqlite', response.text)
    assert match is not None
    filename = match.group(0)
    
    # 3. Download backup
    response = admin_client.get(f"/admin/backups/download/{filename}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/x-sqlite3"
    
    # 4. Delete backup
    response = admin_client.post(f"/admin/backups/delete/{filename}", follow_redirects=True)
    assert response.status_code == 200
    assert filename not in response.text
    assert not (Path("backups") / filename).exists()
