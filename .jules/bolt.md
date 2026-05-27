## 2026-05-14 - Optimized IP network usage calculation
**Learning:** Nested loops $O(N \cdot M)$ with heavy object instantiation (like `ipaddress.ip_address`) are a major bottleneck. Pre-parsing data into lightweight objects or primitives outside the loop can yield massive performance gains.
**Action:** Always check for redundant object creation or string operations inside hot loops. Pre-process data once whenever possible.
