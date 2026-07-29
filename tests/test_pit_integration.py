import pytest
from app import models
from app.services.pit_exporter import generate_pit_gml

def test_generate_pit_gml_basic():
    # Mock some nodes
    node1 = models.NetNode(id=1, name="Test Node 1", x_1992=650000.0, y_1992=250000.0)
    node2 = models.NetNode(id=2, name="Test Node 2", x_1992=650100.0, y_1992=250100.0)
    
    gml = generate_pit_gml([node1, node2])
    
    assert "gml:FeatureCollection" in gml
    assert "pit:Wezel" in gml
    assert "650000.0 250000.0" in gml
    assert "urn:ogc:def:crs:EPSG::2180" in gml

@pytest.mark.asyncio
async def test_sync_pit_coordinates_task_performance_eager_loading(mocker):
    """
    Test that sync_pit_coordinates_task uses eager loading (joinedload)
    to query NetNodes, preventing N+1 database queries.
    """
    from unittest.mock import MagicMock
    from app.routers.pit import sync_pit_coordinates_task

    mock_session = MagicMock()
    mock_session.scalars.return_value.all.return_value = []

    mocker.patch("app.database.db_manager.SessionLocal", return_value=mock_session)
    mocker.patch("app.routers.pit.GugikGeocodingService")

    await sync_pit_coordinates_task()

    # Verify that scalars was called
    assert mock_session.scalars.called
    call_args = mock_session.scalars.call_args[0][0]

    # Check that select contains options for eager loading
    options = call_args._with_options
    assert len(options) > 0

    # Verify that location_city and location_street are included in the joinedload options
    paths = [str(opt.path) for opt in options]
    assert any("location_city" in p for p in paths)
    assert any("location_street" in p for p in paths)
