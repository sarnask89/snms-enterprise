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
