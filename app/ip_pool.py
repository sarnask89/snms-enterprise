"""Pomocnicze funkcje IPv4: zajęte adresy w sieci, sugestie wolnych, walidacja przy zapisie komputera."""

from __future__ import annotations

import ipaddress
from typing import TYPE_CHECKING

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import models

if TYPE_CHECKING:
    pass

# Limit listy sugestii w <datalist> (pełna walidacja działa dla dowolnego hosta w CIDR).
_MAX_SUGGESTIONS = 512


def _norm_ipv4(raw: str | None) -> str | None:
    if not raw or not str(raw).strip():
        return None
    s = str(raw).strip().split("/")[0].strip()
    try:
        ip = ipaddress.ip_address(s)
    except ValueError:
        return None
    if not isinstance(ip, ipaddress.IPv4Address):
        return None
    return str(ip)


def collect_used_ipv4_in_network(
    db: Session,
    net: models.IpNetwork,
    *,
    exclude_node_id: int | None = None,
) -> set[str]:
    """Adresy uznane za zajęte w sieci: brama, komputery (nodes) w zakresie, osprzęt z management_ip w sieci."""
    try:
        ip_net = ipaddress.ip_network(net.cidr.strip(), strict=False)
    except ValueError:
        return set()
    if not isinstance(ip_net, ipaddress.IPv4Network):
        return set()

    used: set[str] = set()
    if net.gateway:
        g = _norm_ipv4(net.gateway)
        if g:
            used.add(g)

    nodes = list(db.scalars(select(models.Node)).all())
    for node in nodes:
        if exclude_node_id is not None and node.id == exclude_node_id:
            continue
        ip_s = _norm_ipv4(node.ip_address)
        if not ip_s:
            continue
        try:
            ip = ipaddress.ip_address(ip_s)
            if ip in ip_net:
                used.add(ip_s)
        except ValueError:
            continue

    devs = list(
        db.scalars(
            select(models.NetDevice).where(models.NetDevice.ip_network_id == net.id)
        ).all()
    )
    for d in devs:
        ip_s = _norm_ipv4(d.management_ip)
        if not ip_s:
            continue
        try:
            ip = ipaddress.ip_address(ip_s)
            if ip in ip_net:
                used.add(ip_s)
        except ValueError:
            continue

    return used


def free_ipv4_suggestions(
    db: Session,
    network_id: int,
    *,
    exclude_node_id: int | None = None,
    limit: int = _MAX_SUGGESTIONS,
) -> list[str]:
    """Lista wolnych adresów (do sugestii), ograniczona."""
    net = db.get(models.IpNetwork, network_id)
    if not net or not net.active:
        return []
    try:
        ip_net = ipaddress.ip_network(net.cidr.strip(), strict=False)
    except ValueError:
        return []
    if not isinstance(ip_net, ipaddress.IPv4Network):
        return []

    used = collect_used_ipv4_in_network(db, net, exclude_node_id=exclude_node_id)
    out: list[str] = []
    # /31, /32: hosts() zachowanie — dla typowego abonenckiego /24 iterujemy hosty
    try:
        gen = ip_net.hosts()
    except ValueError:
        return []
    for ip in gen:
        s = str(ip)
        if s in used:
            continue
        out.append(s)
        if len(out) >= limit:
            break
    return out


def validate_node_ip_assignment(
    db: Session,
    ip_network_id: int | None,
    ip_str: str | None,
    *,
    exclude_node_id: int | None = None,
) -> tuple[bool, str | None]:
    """
    Zwraca (True, None) gdy OK.
    Pusty IP — dozwolony.
    Przy wybranej sieci: IP musi być w CIDR i wolny (nie brama / inny host / osprzęt w tej sieci; wykluczany bieżący rekord).
    Zawsze: ten sam IPv4 nie może być na dwóch komputerach.
    """
    raw = (ip_str or "").strip()
    if not raw:
        return True, None

    ip_norm = _norm_ipv4(raw)
    if not ip_norm:
        return False, "Niepoprawny adres IPv4."

    # Globalny duplikat na innych komputerach (nodes)
    others = list(db.scalars(select(models.Node)).all())
    for node in others:
        if exclude_node_id is not None and node.id == exclude_node_id:
            continue
        o = _norm_ipv4(node.ip_address)
        if o and o == ip_norm:
            return False, "Ten adres IP jest już przypisany do innego komputera."

    # Globalny duplikat na osprzęcie (net devices)
    dev_others = list(db.scalars(select(models.NetDevice)).all())
    for d in dev_others:
        o = _norm_ipv4(d.management_ip)
        if o and o == ip_norm:
            return False, "Ten adres IP jest już przypisany do urządzenia sieciowego (management)."

    if ip_network_id is None:
        return True, None

    net = db.get(models.IpNetwork, ip_network_id)
    if not net:
        return False, "Wybrana sieć IP nie istnieje."

    try:
        ip_net = ipaddress.ip_network(net.cidr.strip(), strict=False)
    except ValueError:
        return False, "Niepoprawny CIDR wybranej sieci."

    if not isinstance(ip_net, ipaddress.IPv4Network):
        return False, "Wybrana sieć musi być IPv4."

    ip_obj = ipaddress.ip_address(ip_norm)
    if ip_obj not in ip_net:
        return False, "Adres nie należy do wybranej puli (CIDR)."

    used = collect_used_ipv4_in_network(db, net, exclude_node_id=exclude_node_id)
    if ip_norm in used:
        return False, "Adres jest zajęty w tej sieci (brama, inny komputer lub urządzenie)."

    return True, None
