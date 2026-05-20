## 2025-05-14 - [Optimize IP membership checks in nested loops]
**Learning:** String parsing of IP addresses using the `ipaddress` module is computationally expensive. When performed inside nested loops (e.g., matching $N$ networks against $M$ nodes), it creates a significant bottleneck ($O(N \times M)$ parsing operations).
**Action:** Always pre-parse IP addresses into `ipaddress.ip_address` objects outside of nested loops to reduce complexity to $O(M)$ parsing operations and $O(N \times M)$ simple membership checks.
