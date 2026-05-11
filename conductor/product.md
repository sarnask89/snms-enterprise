# Initial Concept
CRM Portal (FastAPI, without Strapi)

## Target Audience
Internal staff, ISP administrators, and network engineers managing customer subscriptions, network infrastructure, and billing.

## Core Goals
- Provide a centralized management portal for ISPs.
- Enable customer management, subscription tracking, and financial operations.
- Integrate network infrastructure monitoring and diagnostic tools.
- Automate interactions with hardware like Dasan OLTs and MikroTik routers.
- Maintain a robust audit log of all system changes.
- **Code Optimization & Object-Oriented Design:** Continuously refactor the codebase to reduce duplication, enforce strict object-oriented principles, and improve overall maintainability and performance.

## Key Features
- **Dashboard:** Overview of system status and quick access to key modules.
- **Customer Management:** Full lifecycle management of ISP customers.
- **Infrastructure Management:** Cataloging and monitoring of network nodes, devices (OLTs, routers), and IP networks.
- **Diagnostics:** Real-time diagnostic tools for OLTs and routers using SSH and API integrations.
- **Finance:** Invoicing, tariffs, and payment tracking.
- **TERYT Integration:** Synchronization with the official Polish territorial register for accurate address data.
- **HTMX + Jinja2 UI:** Fast, reactive user interface without the overhead of an SPA.