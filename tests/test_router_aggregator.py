import pytest
from fastapi import APIRouter
from fastapi.routing import APIRoute
from app.router_aggregator import get_core_router

def test_get_core_router_returns_router():
    """Verify that get_core_router returns an APIRouter instance."""
    router = get_core_router()
    assert isinstance(router, APIRouter)

def test_core_router_contains_expected_paths():
    """Verify that the core router includes expected paths from various modules."""
    router = get_core_router()
    
    # Extract all paths from the router
    # Note: some routes might be nested in other routers
    paths = set()
    for route in router.routes:
        if isinstance(route, APIRoute):
            paths.add(route.path)
            
    # Check for a sample of paths from different integrated routers
    expected_path_samples = [
        "/login",                # app.routers.auth
        "/customers",           # app.routers.customers
        "/api/v1/customers",    # app.routers.api_v1
        "/api/v2/auth/login",   # app.api.v2.aggregator -> app.api.v2.auth
        "/admin",               # app.routers.admin
        "/net-nodes",           # app.routers.net_nodes
        "/stats",               # app.routers.stats
    ]
    
    for expected_path in expected_path_samples:
        assert any(p == expected_path or p.startswith(expected_path + "/") for p in paths), \
            f"Expected path {expected_path} (or a subpath) not found in core router"

def test_core_router_module_inclusion_completeness():
    """
    Specifically verify that key modules from router_aggregator.py are included.
    This helps ensure that if someone accidentally deletes an include_router line,
    the test will fail.
    """
    router = get_core_router()
    paths = [route.path for route in router.routes if isinstance(route, APIRoute)]
    
    # Mapping of expected paths to their respective routers to ensure broad coverage
    expected_module_paths = {
        "api_v2": "/api/v2/dashboard/stats",
        "api_v1": "/api/v1/dashboard/stats",
        "auth": "/logout",
        "customers": "/customers/new",
        "net_nodes": "/net-nodes/new",
        "reports": "/admin/pit",
        "stats": "/stats",
        "monitoring": "/admin/monitoring",
    }
    
    for module, path in expected_module_paths.items():
        assert path in paths, f"Path {path} from module {module} missing in core router"
