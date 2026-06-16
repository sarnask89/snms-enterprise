## 2026-06-16 - Optimization Regression and Recovery
**Learning:** Optimizing algorithms by pre-parsing data (like IP addresses) can significantly boost performance by avoiding repetitive operations in nested loops. However, it's critical to ensure the optimization doesn't skip edge cases (e.g., null or empty values) that were implicitly handled by the original logic.
**Action:** Always verify that filtered or pre-parsed datasets maintain full parity with the original iteration logic, especially when matching on multiple criteria (e.g., both ID and CIDR).
