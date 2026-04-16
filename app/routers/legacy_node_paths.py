"""Zgodność wsteczna: stare ścieżki `/nodes/*` → `/customer-devices/*`."""

from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

from app.deps import verify_session

router = APIRouter(prefix="/nodes", dependencies=[Depends(verify_session)])


@router.api_route("", methods=["GET", "HEAD", "POST"])
def legacy_nodes_root():
    return RedirectResponse("/customer-devices", status_code=307)


@router.api_route("/{path:path}", methods=["GET", "HEAD", "POST"])
def legacy_nodes_subpath(path: str):
    # Alias „add” → „new” (jak w routerze komputerów).
    if path.strip().rstrip("/") == "add":
        return RedirectResponse("/customer-devices/new", status_code=307)
    return RedirectResponse(f"/customer-devices/{path}", status_code=307)
