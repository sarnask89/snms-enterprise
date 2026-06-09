## 2026-06-21 - Standardizing Subscription Management UX
**Learning:** The `subscriptions.vue` page was using legacy Heroicons while newer parts of the CRM portal use Lucide icons. Standardizing these and adding a Refresh button with proper loading state alignment (`pendingSubscriptions` -> `:loading`) and Polish ARIA labels (`Odśwież listę`) provides a more consistent and accessible experience for operators.
**Action:** Always cross-reference icon sets and refresh patterns with newer dashboard pages (like `customer-devices.vue`) when editing older components.
