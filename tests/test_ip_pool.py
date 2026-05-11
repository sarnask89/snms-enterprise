import pytest
from unittest.mock import MagicMock
from app.ip_pool import _norm_ipv4, collect_used_ipv4_in_network, free_ipv4_suggestions, validate_node_ip_assignment
from app import models

def test_norm_ipv4():
    assert _norm_ipv4("192.168.1.1") == "192.168.1.1"
    assert _norm_ipv4(" 192.168.1.1/24 ") == "192.168.1.1"
    assert _norm_ipv4("invalid") is None
    assert _norm_ipv4("") is None
    assert _norm_ipv4(None) is None

def test_collect_used_ipv4_in_network():
    db = MagicMock()
    net = MagicMock(spec=models.IpNetwork)
    net.cidr = "192.168.1.0/24"
    net.gateway = "192.168.1.1"
    net.id = 1
    
    # Mock devices
    device1 = MagicMock(spec=models.CustomerDevice)
    device1.id = 10
    device1.ip_address = "192.168.1.2"
    
    device2 = MagicMock(spec=models.CustomerDevice)
    device2.id = 11
    device2.ip_address = "192.168.1.3"
    
    # Mock net devices
    net_dev = MagicMock(spec=models.NetDevice)
    net_dev.management_ip = "192.168.1.10"
    
    db.scalars.return_value.all.side_effect = [[device1, device2], [net_dev]]
    
    used = collect_used_ipv4_in_network(db, net)
    assert used == {"192.168.1.1", "192.168.1.2", "192.168.1.3", "192.168.1.10"}

def test_free_ipv4_suggestions():
    db = MagicMock()
    net = MagicMock(spec=models.IpNetwork)
    net.cidr = "192.168.1.0/29" # 8 addresses, 6 hosts
    net.gateway = "192.168.1.1"
    net.active = True
    net.id = 1
    
    db.get.return_value = net
    
    # Mock used addresses
    device = MagicMock(spec=models.CustomerDevice)
    device.id = 10
    device.ip_address = "192.168.1.2"
    
    db.scalars.return_value.all.side_effect = [[device], []]
    
    suggestions = free_ipv4_suggestions(db, 1)
    # Expected: 192.168.1.3, .4, .5, .6 (excluding .1 gateway and .2 device)
    assert "192.168.1.3" in suggestions
    assert "192.168.1.1" not in suggestions
    assert "192.168.1.2" not in suggestions
    assert len(suggestions) == 4

def test_validate_node_ip_assignment_duplicate_global():
    db = MagicMock()
    
    # Mock another device with same IP
    other = MagicMock(spec=models.CustomerDevice)
    other.id = 2
    other.ip_address = "10.0.0.1"
    
    db.scalars.return_value.all.side_effect = [[other], []]
    
    ok, err = validate_node_ip_assignment(db, None, "10.0.0.1", exclude_node_id=1)
    assert ok is False
    assert "już przypisany do innego komputera" in err

def test_validate_node_ip_assignment_out_of_cidr():
    db = MagicMock()
    net = MagicMock(spec=models.IpNetwork)
    net.cidr = "192.168.1.0/24"
    net.id = 1
    
    db.get.return_value = net
    db.scalars.return_value.all.return_value = []
    
    ok, err = validate_node_ip_assignment(db, 1, "10.0.0.1")
    assert ok is False
    assert "nie należy do wybranej puli" in err
