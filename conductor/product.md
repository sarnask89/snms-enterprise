# Product Definition - CRM Portal

## Vision
The CRM Portal is a centralized management system designed to streamline ISP operations. It combines customer management, billing automation, and a robust helpdesk system, all while ensuring high data integrity through official GUS TERYT integration. It also serves as a monitoring and diagnostic hub for network infrastructure.

## Target Users
- **Office Staff:** Managing customer profiles, tariffs, subscriptions, and financial records.
- **Support Team:** Handling technical issues, customer requests, and network monitoring.

## Core Goals
- **Data Integrity:** Leveraging official TERYT dictionaries for precise address management.
- **Network Awareness:** Proactive monitoring, alerting, and diagnostics for network infrastructure.
- **Automation & Reliability:** Reducing manual tasks through automated billing and ensuring system stability through comprehensive automated testing.
- **User Experience:** Utilizing HTMX and Tailwind for a modern, responsive, and efficient interface.

## Key Features
- **Client & Subscription Management:** Centralized hub for managing clients, their subscriptions, and notifications.
- **TERYT Integration:** Full synchronization with GUS services for address verification.
- **Invoice Automation & Tasks:** Streamlined billing cycles and automated background tasks.
- **Helpdesk & Diagnostics:** Integrated ticketing combined with comprehensive network diagnostics to track problems.
- **Infrastructure Monitoring:** Real-time monitoring, alerting, and statistical data collection for network health.

## Roadmap & Integrations
- **Network Management:**
  - **MikroTik:** Diagnostics and management via REST-API, SSH, and SNMP data collection.
  - **Dasan OLTs:** Management through SSH (CLI-in-CLI) and SNMP data collection.
  - **Hardware Mocking:** Isolated testing of hardware logic using a "Digital Twin" (MockMikrotikService).
- **Service Providers:**
  - **Avios TV:** Integration with television service provisioning.
