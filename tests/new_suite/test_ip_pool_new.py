import re
import pytest
import ipaddress
from app.ip_pool import _norm_ipv4, validate_node_ip_assignment, free_ipv4_suggestions, collect_used_ipv4_in_network
from app import models

def test_norm_ipv4_valid():
    assert _norm_ipv4("192.168.1.1") == "192.168.1.1"
    assert _norm_ipv4(" 192.168.1.1/24 ") == "192.168.1.1"
    assert _norm_ipv4("10.0.0.1 ") == "10.0.0.1"

def test_norm_ipv4_invalid():
    assert _norm_ipv4(None) is None
    assert _norm_ipv4("") is None
    assert _norm_ipv4("  ") is None
    assert _norm_ipv4("not-an-ip") is None
    assert _norm_ipv4("256.256.256.256") is None
    assert _norm_ipv4("2001:db8::1") is None

def test_validate_node_ip_assignment_edge_cases(session):
    # Empty IP
    assert validate_node_ip_assignment(session, None, "") == (True, None)
    
    # Invalid IP string (hits line 140)
    ok, msg = validate_node_ip_assignment(session, None, "invalid")
    assert ok is False
    assert "Niepoprawny" in msg

    # ip_network_id is None (hits line 159)
    assert validate_node_ip_assignment(session, None, "10.0.0.1") == (True, None)

    # Non-existent network (hits line 163)
    ok, msg = validate_node_ip_assignment(session, 9999, "10.0.0.1")
    assert ok is False
    assert "nie istnieje" in msg

def test_validate_node_ip_assignment_duplicate_node(session):
    node1 = models.Node(customer_id=1, hostname="node1", ip_address="10.0.0.5", status=models.NodeStatus.active)
    session.add(node1)
    session.commit()
    
    # Duplicate on another node (hits line 149)
    ok, msg = validate_node_ip_assignment(session, None, "10.0.0.5")
    assert ok is False
    assert "innego komputera" in msg
    
    # Exclude current node (hits line 146 continue)
    ok, msg = validate_node_ip_assignment(session, None, "10.0.0.5", exclude_node_id=node1.id)
    assert ok is True

def test_validate_node_ip_assignment_duplicate_net_device(session):
    dev = models.NetDevice(name="SW1", management_ip="10.0.0.10", status=models.NetDeviceStatus.active)
    session.add(dev)
    session.commit()
    
    # Duplicate on NetDevice (hits line 156)
    ok, msg = validate_node_ip_assignment(session, None, "10.0.0.10")
    assert ok is False
    assert "urządzenia sieciowego" in msg

def test_validate_node_ip_assignment_network_logic(session):
    net = models.IpNetwork(name="T1", cidr="10.0.0.0/24", active=True)
    session.add(net)
    session.commit()
    
    # Outside CIDR (hits line 175)
    ok, msg = validate_node_ip_assignment(session, net.id, "10.0.1.1")
    assert ok is False
    assert "nie należy do wybranej puli" in msg
    
    # Success (hits line 181)
    ok, msg = validate_node_ip_assignment(session, net.id, "10.0.0.50")
    assert ok is True

def test_collect_used_ipv4_invalid_cidr(session):
    # Invalid CIDR (hits line 43)
    net = models.IpNetwork(name="Bad", cidr="invalid", active=True)
    assert collect_used_ipv4_in_network(session, net) == set()
    
    # IPv6 network (hits line 45)
    net6 = models.IpNetwork(name="IPv6", cidr="2001:db8::/32", active=True)
    assert collect_used_ipv4_in_network(session, net6) == set()

def test_collect_used_ipv4_loops(session):
    net = models.IpNetwork(name="L1", cidr="10.0.0.0/24", active=True, gateway="10.0.0.1")
    session.add(net)
    session.flush()
    
    node = models.Node(customer_id=1, hostname="n1", ip_address="10.0.0.2", status=models.NodeStatus.active)
    node_no_ip = models.Node(customer_id=1, hostname="n2", ip_address="", status=models.NodeStatus.active) # hits line 59
    node_bad_ip = models.Node(customer_id=1, hostname="n3", ip_address="999.999.999.999", status=models.NodeStatus.active) # hits line 64-65
    
    dev = models.NetDevice(name="d1", management_ip="10.0.0.3", ip_network_id=net.id)
    dev_no_ip = models.NetDevice(name="d2", management_ip=None, ip_network_id=net.id) # hits line 75
    dev_bad_ip = models.NetDevice(name="d3", management_ip="bad", ip_network_id=net.id) # hits line 80-81
    
    session.add_all([node, node_no_ip, node_bad_ip, dev, dev_no_ip, dev_bad_ip])
    session.commit()
    
    used = collect_used_ipv4_in_network(session, net)
    assert "10.0.0.1" in used # gateway
    assert "10.0.0.2" in used # node (hits line 63)
    assert "10.0.0.3" in used # device (hits line 79)
    
    # Exclude hits line 56
    used_ex = collect_used_ipv4_in_network(session, net, exclude_node_id=node.id)
    assert "10.0.0.2" not in used_ex

def test_validate_node_ip_assignment_errors(session):
    # Invalid CIDR on network (hits line 167-168)
    net = models.IpNetwork(name="Bad", cidr="invalid", active=True)
    session.add(net)
    session.commit()
    ok, msg = validate_node_ip_assignment(session, net.id, "10.0.0.1")
    assert ok is False
    assert "Niepoprawny CIDR" in msg
    
    # IPv6 network (hits line 171)
    net6 = models.IpNetwork(name="V6", cidr="2001:db8::/32", active=True)
    session.add(net6)
    session.commit()
    ok, msg = validate_node_ip_assignment(session, net6.id, "10.0.0.1")
    assert ok is False
    assert "musi być IPv4" in msg

def test_free_ipv4_suggestions_hosts_error(session):
    # network with /32 hits hosts() loop or potential error if library behaves differently
    # But to hit line 109-110 we need ValueError from hosts()
    # Mocking is easier here if we really want to hit it, but let's try a weird network
    net = models.IpNetwork(name="Weird", cidr="10.0.0.0/24", active=True)
    session.add(net)
    session.commit()
    
    from unittest.mock import patch
    with patch("ipaddress.IPv4Network.hosts", side_effect=ValueError("Test")):
        assert free_ipv4_suggestions(session, net.id) == []

def test_free_ipv4_suggestions_logic(session):
    net = models.IpNetwork(name="S1", cidr="10.0.0.0/29", active=True, gateway="10.0.0.1")
    session.add(net)
    session.flush()
    
    # Add node to take an IP
    node = models.Node(customer_id=1, hostname="n1", ip_address="10.0.0.2", status=models.NodeStatus.active)
    session.add(node)
    session.commit()
    
    # .0 is net, .7 is broadcast. hosts() should give .1 to .6
    # .1 is gateway (used), .2 is node (used)
    # expected: .3, .4, .5, .6 (hits line 111-118)
    sugg = free_ipv4_suggestions(session, net.id)
    assert sugg == ["10.0.0.3", "10.0.0.4", "10.0.0.5", "10.0.0.6"]
    
    # Limit (hits line 117 break)
    sugg_lim = free_ipv4_suggestions(session, net.id, limit=2)
    assert sugg_lim == ["10.0.0.3", "10.0.0.4"]

def test_free_ipv4_suggestions_edge_cases(session):
    # Inactive net (hits line 96)
    net_off = models.IpNetwork(name="Off", cidr="10.0.0.0/24", active=False)
    session.add(net_off)
    session.commit()
    assert free_ipv4_suggestions(session, net_off.id) == []
    
    # Invalid CIDR (hits line 100)
    net_bad = models.IpNetwork(name="Bad", cidr="bad", active=True)
    session.add(net_bad)
    session.commit()
    assert free_ipv4_suggestions(session, net_bad.id) == []
    
    # IPv6 net (hits line 102)
    net6 = models.IpNetwork(name="V6", cidr="2001:db8::/32", active=True)
    session.add(net6)
    session.commit()
    assert free_ipv4_suggestions(session, net6.id) == []
