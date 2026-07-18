# Bolt's Performance Journal

This journal tracks critical learnings and codebase-specific performance insights.

## 2026-07-18 - Optimized subscription list query using eager loading
**Learning:** Manual dictionary caches built by querying whole tables (`select(models.Customer).all()`) inside backend routers to look up fields in Jinja2 templates create massive memory and CPU overhead. These should always be replaced by using `joinedload()` on the main query and accessing relationship attributes directly.
**Action:** Used `joinedload` on the customer, tariff, and device relationships of the `Subscription` model, completely removing redundant full-table dictionary fetches.
