import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

test("server starts and customers/groups parity baseline works", async (t) => {
    const tempDir = await mkdtemp(join(tmpdir(), "crm-portal-ts-"));
    const dbPath = join(tempDir, "baseline.sqlite");
    process.env.CRM_PORTAL_TS_DB_PATH = dbPath;
    process.env.CRM_PORTAL_TS_UPLOAD_ROOT = join(tempDir, "uploads");
    process.env.CRM_PORTAL_TS_BACKUP_ROOT = join(tempDir, "backups");

    const [{ startServer }, { AppDataSource }] = await Promise.all([
        import("../app.js"),
        import("../database.js"),
    ]);

    const server = await startServer(0);
    await AppDataSource.synchronize(true);

    t.after(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve();
            });
        });

        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
        }

        delete process.env.CRM_PORTAL_TS_DB_PATH;
        delete process.env.CRM_PORTAL_TS_UPLOAD_ROOT;
        delete process.env.CRM_PORTAL_TS_BACKUP_ROOT;
        await rm(tempDir, { recursive: true, force: true });
    });

    const address = server.address();
    assert.ok(address && typeof address !== "string");

    const baseUrl = `http://127.0.0.1:${address.port}`;

    const healthResponse = await fetch(`${baseUrl}/health`);
    assert.equal(healthResponse.status, 200);
    assert.deepEqual(await healthResponse.json(), { status: "ok", engine: "TypeScript" });

    const statusResponse = await fetch(`${baseUrl}/api/v1/module-status`);
    assert.equal(statusResponse.status, 200);

    const statusPayload = await statusResponse.json() as {
        activeModules: string[];
        migrationStatus: Array<{ module: string; status: string }>;
    };

    assert.ok(statusPayload.activeModules.includes("customers"));
    assert.ok(statusPayload.activeModules.includes("admin"));
    assert.ok(statusPayload.activeModules.includes("customer-groups"));
    assert.ok(statusPayload.activeModules.includes("documents"));
    assert.ok(statusPayload.activeModules.includes("net-nodes"));
    assert.ok(statusPayload.activeModules.includes("ip-networks"));
    assert.ok(statusPayload.activeModules.includes("net-devices"));
    assert.ok(statusPayload.activeModules.includes("finances"));
    assert.ok(statusPayload.activeModules.includes("helpdesk"));
    assert.ok(statusPayload.activeModules.includes("subscriptions"));
    assert.ok(statusPayload.activeModules.includes("teryt"));
    assert.ok(statusPayload.activeModules.includes("addresses"));
    assert.ok(statusPayload.activeModules.includes("diagnostics"));
    assert.ok(statusPayload.activeModules.includes("network-discovery"));
    assert.ok(statusPayload.activeModules.includes("pit"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "customer-groups" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "admin" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "audit" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "backups" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "documents" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "net-nodes" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "ip-networks" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "net-devices" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "reload" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "finances" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "helpdesk" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "subscriptions" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "teryt" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "addresses" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "diagnostics" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "network-discovery" && entry.status === "works_in_ts"));
    assert.ok(statusPayload.migrationStatus.some((entry) => entry.module === "pit" && entry.status === "works_in_ts"));

    const dashboardResponse = await fetch(`${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(dashboardResponse.status, 200);
    assert.deepEqual(await dashboardResponse.json(), {
        customers: 0,
        nodes: 0,
        devices: 0,
        tickets: 0,
    });

    const createdCustomer = await fetch(`${baseUrl}/api/v1/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerCode: "CUST-001",
            firstName: "Jan",
            lastName: "Kowalski",
            email: "jan@example.com",
            status: "active",
        }),
    });
    assert.equal(createdCustomer.status, 201);
    const customerPayload = await createdCustomer.json() as { id: number; groupCount: number };
    assert.ok(customerPayload.id > 0);
    assert.equal(customerPayload.groupCount, 0);

    const createdGroup = await fetch(`${baseUrl}/api/v1/customer-groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "VIP",
            description: "Klienci premium",
            memberIds: [customerPayload.id],
        }),
    });
    assert.equal(createdGroup.status, 201);
    const groupPayload = await createdGroup.json() as { id: number; customerCount: number; memberIds: number[] };
    assert.ok(groupPayload.id > 0);
    assert.equal(groupPayload.customerCount, 1);
    assert.deepEqual(groupPayload.memberIds, [customerPayload.id]);

    const groupList = await fetch(`${baseUrl}/api/v1/customer-groups`);
    assert.equal(groupList.status, 200);
    const groupListPayload = await groupList.json() as Array<{ name: string; customerCount: number }>;
    assert.equal(groupListPayload.length, 1);
    assert.equal(groupListPayload[0]?.name, "VIP");
    assert.equal(groupListPayload[0]?.customerCount, 1);

    const updatedGroup = await fetch(`${baseUrl}/api/v1/customer-groups/${groupPayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "VIP Plus",
            description: "Najważniejsi klienci",
            memberIds: [customerPayload.id],
        }),
    });
    assert.equal(updatedGroup.status, 200);
    const updatedGroupPayload = await updatedGroup.json() as { name: string };
    assert.equal(updatedGroupPayload.name, "VIP Plus");

    const filteredCustomers = await fetch(`${baseUrl}/api/v1/customers?q=Kow&status=active`);
    assert.equal(filteredCustomers.status, 200);
    const filteredCustomersPayload = await filteredCustomers.json() as Array<{ id: number; groupCount: number }>;
    assert.equal(filteredCustomersPayload.length, 1);
    assert.equal(filteredCustomersPayload[0]?.id, customerPayload.id);
    assert.equal(filteredCustomersPayload[0]?.groupCount, 1);

    const customerDetails = await fetch(`${baseUrl}/api/v1/customers/${customerPayload.id}`);
    assert.equal(customerDetails.status, 200);
    const customerDetailsPayload = await customerDetails.json() as {
        groups: Array<{ name: string }>;
    };
    assert.equal(customerDetailsPayload.groups[0]?.name, "VIP Plus");

    const createdNode = await fetch(`${baseUrl}/api/v1/net-nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Warszawa POP-1",
            locationDetail: "Piwnica A",
            locationType: "basement",
            nodeType: "POP",
            ownerType: "own",
            latitude: 52.2297,
            longitude: 21.0122,
            x1992: 486430.25,
            y1992: 637515.5,
            hasPower: true,
            hasEnvControl: false,
            info: "Główny punkt dystrybucyjny",
        }),
    });
    assert.equal(createdNode.status, 201);
    const nodePayload = await createdNode.json() as { id: number; name: string; hasPower: boolean };
    assert.ok(nodePayload.id > 0);
    assert.equal(nodePayload.name, "Warszawa POP-1");
    assert.equal(nodePayload.hasPower, true);

    const createdNetwork = await fetch(`${baseUrl}/api/v1/ip-networks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Backbone VLAN 100",
            cidr: "10.10.100.0/24",
            gateway: "10.10.100.1",
            vlanId: 100,
            description: "Sieć management",
            active: true,
        }),
    });
    assert.equal(createdNetwork.status, 201);
    const networkPayload = await createdNetwork.json() as { id: number; cidr: string; active: boolean };
    assert.ok(networkPayload.id > 0);
    assert.equal(networkPayload.cidr, "10.10.100.0/24");
    assert.equal(networkPayload.active, true);

    const createdNetDevice = await fetch(`${baseUrl}/api/v1/net-devices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Core Router 1",
            hostname: "cr1",
            serialNumber: "ABC123",
            managementIp: "10.10.100.2",
            deviceType: "router",
            status: "active",
            ipNetworkId: networkPayload.id,
            netNodeId: nodePayload.id,
            customerId: customerPayload.id,
            notes: "Router brzegowy",
        }),
    });
    assert.equal(createdNetDevice.status, 201);
    const netDevicePayload = await createdNetDevice.json() as {
        id: number;
        customer?: { id: number };
        ipNetwork?: { id: number };
        netNode?: { id: number };
    };
    assert.ok(netDevicePayload.id > 0);
    assert.equal(netDevicePayload.customer?.id, customerPayload.id);
    assert.equal(netDevicePayload.ipNetwork?.id, networkPayload.id);
    assert.equal(netDevicePayload.netNode?.id, nodePayload.id);

    const nodeList = await fetch(`${baseUrl}/api/v1/net-nodes?q=POP`);
    assert.equal(nodeList.status, 200);
    const nodeListPayload = await nodeList.json() as Array<{ id: number; deviceCount: number }>;
    assert.equal(nodeListPayload.length, 1);
    assert.equal(nodeListPayload[0]?.id, nodePayload.id);
    assert.equal(nodeListPayload[0]?.deviceCount, 1);

    const networkList = await fetch(`${baseUrl}/api/v1/ip-networks?q=100`);
    assert.equal(networkList.status, 200);
    const networkListPayload = await networkList.json() as Array<{ id: number; deviceCount: number }>;
    assert.equal(networkListPayload.length, 1);
    assert.equal(networkListPayload[0]?.id, networkPayload.id);
    assert.equal(networkListPayload[0]?.deviceCount, 1);

    const updatedNode = await fetch(`${baseUrl}/api/v1/net-nodes/${nodePayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            locationDetail: "Serwerownia B",
            hasEnvControl: true,
        }),
    });
    assert.equal(updatedNode.status, 200);
    const updatedNodePayload = await updatedNode.json() as { locationDetail: string; hasEnvControl: boolean };
    assert.equal(updatedNodePayload.locationDetail, "Serwerownia B");
    assert.equal(updatedNodePayload.hasEnvControl, true);

    const updatedNetDevice = await fetch(`${baseUrl}/api/v1/net-devices/${netDevicePayload.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            status: "maintenance",
            notes: "Planowany serwis",
        }),
    });
    assert.equal(updatedNetDevice.status, 200);
    const updatedNetDevicePayload = await updatedNetDevice.json() as { status: string; notes: string };
    assert.equal(updatedNetDevicePayload.status, "maintenance");
    assert.equal(updatedNetDevicePayload.notes, "Planowany serwis");

    const networkUsage = await fetch(`${baseUrl}/api/v1/ip-networks/${networkPayload.id}`);
    assert.equal(networkUsage.status, 200);
    const networkDetailsPayload = await networkUsage.json() as {
        id: number;
        deviceCount: number;
        customerDeviceCount: number;
    };
    assert.equal(networkDetailsPayload.id, networkPayload.id);
    assert.equal(networkDetailsPayload.deviceCount, 1);
    assert.equal(networkDetailsPayload.customerDeviceCount, 0);

    const dashboardAfterNetwork = await fetch(`${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(dashboardAfterNetwork.status, 200);
    assert.deepEqual(await dashboardAfterNetwork.json(), {
        customers: 1,
        nodes: 1,
        devices: 1,
        tickets: 0,
    });

    const importedLease = await fetch(`${baseUrl}/api/v1/network-discovery/import-lease`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            netDeviceId: netDevicePayload.id,
            ipNetworkId: networkPayload.id,
            hostname: "lease-a1b2.snms",
            ipAddress: "10.10.100.42",
            macAddress: "AA:BB:CC:DD:EE:42",
            comment: "Imported DHCP lease",
        }),
    });
    assert.equal(importedLease.status, 201);
    const importedLeasePayload = await importedLease.json() as {
        customerDevice: { id: number; customerId: number; ipAddress: string; netDeviceId: number; ipNetworkId: number };
        diagnostics: { ready: boolean; blockingChecks: number };
    };
    assert.ok(importedLeasePayload.customerDevice.id > 0);
    assert.equal(importedLeasePayload.customerDevice.customerId, customerPayload.id);
    assert.equal(importedLeasePayload.customerDevice.ipAddress, "10.10.100.42");
    assert.equal(importedLeasePayload.customerDevice.netDeviceId, netDevicePayload.id);
    assert.equal(importedLeasePayload.customerDevice.ipNetworkId, networkPayload.id);
    assert.equal(importedLeasePayload.diagnostics.ready, true);
    assert.equal(importedLeasePayload.diagnostics.blockingChecks, 0);

    const diagnosticsCheck = await fetch(`${baseUrl}/api/v1/diagnostics/check/${importedLeasePayload.customerDevice.id}`, {
        method: "POST",
    });
    assert.equal(diagnosticsCheck.status, 200);
    const diagnosticsCheckPayload = await diagnosticsCheck.json() as {
        customerDeviceId: number;
        ready: boolean;
        checks: Array<{ key: string; ok: boolean }>;
    };
    assert.equal(diagnosticsCheckPayload.customerDeviceId, importedLeasePayload.customerDevice.id);
    assert.equal(diagnosticsCheckPayload.ready, true);
    assert.ok(diagnosticsCheckPayload.checks.some((entry) => entry.key === "net_device_management_ip" && entry.ok));

    const importedLeaseList = await fetch(`${baseUrl}/api/v1/network-discovery/imported-leases?q=10.10.100.42`);
    assert.equal(importedLeaseList.status, 200);
    const importedLeaseListPayload = await importedLeaseList.json() as Array<{ id: number; ipAddress: string }>;
    assert.equal(importedLeaseListPayload.length, 1);
    assert.equal(importedLeaseListPayload[0]?.id, importedLeasePayload.customerDevice.id);

    const discoveredNetwork = await fetch(`${baseUrl}/api/v1/network-discovery/import-network`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            deviceId: netDevicePayload.id,
            name: "Discovered VLAN 200",
            cidr: "10.10.200.0/24",
            gateway: "10.10.200.1",
            vlanId: 200,
            comment: "Imported from discovery",
        }),
    });
    assert.equal(discoveredNetwork.status, 201);
    const discoveredNetworkPayload = await discoveredNetwork.json() as { id: number; cidr: string; sourceDeviceId: number };
    assert.ok(discoveredNetworkPayload.id > 0);
    assert.equal(discoveredNetworkPayload.cidr, "10.10.200.0/24");
    assert.equal(discoveredNetworkPayload.sourceDeviceId, netDevicePayload.id);

    const pitExport = await fetch(`${baseUrl}/api/v1/pit/export/nodes`);
    assert.equal(pitExport.status, 200);
    assert.ok(pitExport.headers.get("content-type")?.includes("application/gml+xml"));
    const pitGml = await pitExport.text();
    assert.ok(pitGml.includes("EPSG:2180"));
    assert.ok(pitGml.includes("Warszawa POP-1"));
    assert.ok(pitGml.includes("486430.25 637515.5"));

    const pitSync = await fetch(`${baseUrl}/api/v1/pit/sync`, { method: "POST" });
    assert.equal(pitSync.status, 200);
    const pitSyncPayload = await pitSync.json() as { totalNodes: number; exportableNodes: number; missingCoordinates: number };
    assert.equal(pitSyncPayload.totalNodes, 1);
    assert.equal(pitSyncPayload.exportableNodes, 1);
    assert.equal(pitSyncPayload.missingCoordinates, 0);

    const createdTariff = await fetch(`${baseUrl}/api/v1/finances/tariffs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "FTTH 600",
            monthlyPrice: 89.99,
            description: "Plan FTTH 600/100",
            speedDownMbps: 600,
            speedUpMbps: 100,
            active: true,
        }),
    });
    assert.equal(createdTariff.status, 201);
    const tariffPayload = await createdTariff.json() as { id: number; monthlyPrice: number; active: boolean };
    assert.ok(tariffPayload.id > 0);
    assert.equal(tariffPayload.monthlyPrice, 89.99);
    assert.equal(tariffPayload.active, true);

    const tariffList = await fetch(`${baseUrl}/api/v1/finances/tariffs?q=FTTH`);
    assert.equal(tariffList.status, 200);
    const tariffListPayload = await tariffList.json() as Array<{ id: number; name: string }>;
    assert.equal(tariffListPayload.length, 1);
    assert.equal(tariffListPayload[0]?.id, tariffPayload.id);

    const createdSubscription = await fetch(`${baseUrl}/api/v1/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            deviceId: null,
            tariffId: tariffPayload.id,
            startDate: "2026-05-14",
            active: true,
            technology: "FTTH",
            speedDownMbps: 600,
            speedUpMbps: 100,
        }),
    });
    assert.equal(createdSubscription.status, 201);
    const subscriptionPayload = await createdSubscription.json() as {
        id: number;
        customer?: { id: number };
        tariff?: { id: number };
        active: boolean;
    };
    assert.ok(subscriptionPayload.id > 0);
    assert.equal(subscriptionPayload.customer?.id, customerPayload.id);
    assert.equal(subscriptionPayload.tariff?.id, tariffPayload.id);
    assert.equal(subscriptionPayload.active, true);

    const subscriptionList = await fetch(`${baseUrl}/api/v1/subscriptions`);
    assert.equal(subscriptionList.status, 200);
    const subscriptionListPayload = await subscriptionList.json() as Array<{ id: number; technology: string }>;
    assert.equal(subscriptionListPayload.length, 1);
    assert.equal(subscriptionListPayload[0]?.id, subscriptionPayload.id);
    assert.equal(subscriptionListPayload[0]?.technology, "FTTH");

    const toggledSubscription = await fetch(`${baseUrl}/api/v1/subscriptions/${subscriptionPayload.id}/toggle`, {
        method: "POST",
    });
    assert.equal(toggledSubscription.status, 200);
    const toggledSubscriptionPayload = await toggledSubscription.json() as { active: boolean };
    assert.equal(toggledSubscriptionPayload.active, false);

    const createdInvoice = await fetch(`${baseUrl}/api/v1/finances/invoices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            number: "FV/2026/05/0001",
            customerId: customerPayload.id,
            amount: 89.99,
            status: "draft",
            documentKind: "invoice",
            issueDate: "2026-05-14",
        }),
    });
    assert.equal(createdInvoice.status, 201);
    const invoicePayload = await createdInvoice.json() as { id: number; number: string; status: string };
    assert.ok(invoicePayload.id > 0);
    assert.equal(invoicePayload.number, "FV/2026/05/0001");
    assert.equal(invoicePayload.status, "draft");

    const invoiceList = await fetch(`${baseUrl}/api/v1/finances/invoices?q=FV/2026`);
    assert.equal(invoiceList.status, 200);
    const invoiceListPayload = await invoiceList.json() as Array<{ id: number; number: string }>;
    assert.equal(invoiceListPayload.length, 1);
    assert.equal(invoiceListPayload[0]?.id, invoicePayload.id);

    const createdPayment = await fetch(`${baseUrl}/api/v1/finances/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            name: "Stała opłata FTTH",
            amount: 89.99,
            intervalMonths: 1,
            dayOfMonth: 10,
            active: true,
            nextRun: "2026-06-10",
        }),
    });
    assert.equal(createdPayment.status, 201);
    const paymentPayload = await createdPayment.json() as { id: number; amount: number; customer?: { id: number } };
    assert.ok(paymentPayload.id > 0);
    assert.equal(paymentPayload.amount, 89.99);
    assert.equal(paymentPayload.customer?.id, customerPayload.id);

    const paymentList = await fetch(`${baseUrl}/api/v1/finances/payments`);
    assert.equal(paymentList.status, 200);
    const paymentListPayload = await paymentList.json() as Array<{ id: number; active: boolean }>;
    assert.equal(paymentListPayload.length, 1);
    assert.equal(paymentListPayload[0]?.id, paymentPayload.id);
    assert.equal(paymentListPayload[0]?.active, true);

    const createdLedger = await fetch(`${baseUrl}/api/v1/finances/balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            amount: 89.99,
            kind: "debit",
            description: "Naliczona subskrypcja maj",
        }),
    });
    assert.equal(createdLedger.status, 201);
    const ledgerPayload = await createdLedger.json() as { id: number; kind: string; amount: number };
    assert.ok(ledgerPayload.id > 0);
    assert.equal(ledgerPayload.kind, "debit");
    assert.equal(ledgerPayload.amount, 89.99);

    const ledgerList = await fetch(`${baseUrl}/api/v1/finances/balance`);
    assert.equal(ledgerList.status, 200);
    const ledgerListPayload = await ledgerList.json() as Array<{ id: number; customer?: { id: number } }>;
    assert.equal(ledgerListPayload.length, 1);
    assert.equal(ledgerListPayload[0]?.customer?.id, customerPayload.id);

    const createdCash = await fetch(`${baseUrl}/api/v1/finances/cash`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            amount: 89.99,
            description: "Wpłata gotówkowa",
        }),
    });
    assert.equal(createdCash.status, 201);
    const cashPayload = await createdCash.json() as { id: number; amount: number };
    assert.ok(cashPayload.id > 0);
    assert.equal(cashPayload.amount, 89.99);

    const cashList = await fetch(`${baseUrl}/api/v1/finances/cash`);
    assert.equal(cashList.status, 200);
    const cashListPayload = await cashList.json() as Array<{ id: number; description: string }>;
    assert.equal(cashListPayload.length, 1);
    assert.equal(cashListPayload[0]?.description, "Wpłata gotówkowa");

    const createdQueue = await fetch(`${baseUrl}/api/v1/helpdesk/queues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "default",
            description: "Kolejka domyślna",
        }),
    });
    assert.equal(createdQueue.status, 201);
    const queuePayload = await createdQueue.json() as { id: number; name: string };
    assert.ok(queuePayload.id > 0);
    assert.equal(queuePayload.name, "default");

    const createdCategory = await fetch(`${baseUrl}/api/v1/helpdesk/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            queueId: queuePayload.id,
            name: "Awaria",
            description: "Problemy z usługą",
        }),
    });
    assert.equal(createdCategory.status, 201);
    const categoryPayload = await createdCategory.json() as { id: number; queueId: number };
    assert.ok(categoryPayload.id > 0);
    assert.equal(categoryPayload.queueId, queuePayload.id);

    const createdTicket = await fetch(`${baseUrl}/api/v1/helpdesk/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            customerId: customerPayload.id,
            queueId: queuePayload.id,
            categoryId: categoryPayload.id,
            title: "Brak sygnału FTTH",
            body: "Klient zgłasza całkowity brak sygnału od rana.",
            status: "open",
        }),
    });
    assert.equal(createdTicket.status, 201);
    const ticketPayload = await createdTicket.json() as {
        id: number;
        status: string;
        queue?: { id: number };
        category?: { id: number };
        customer?: { id: number };
    };
    assert.ok(ticketPayload.id > 0);
    assert.equal(ticketPayload.status, "open");
    assert.equal(ticketPayload.queue?.id, queuePayload.id);
    assert.equal(ticketPayload.category?.id, categoryPayload.id);
    assert.equal(ticketPayload.customer?.id, customerPayload.id);

    const ticketList = await fetch(`${baseUrl}/api/v1/helpdesk/tickets?q=FTTH&status=open&queueId=${queuePayload.id}`);
    assert.equal(ticketList.status, 200);
    const ticketListPayload = await ticketList.json() as Array<{ id: number; title: string }>;
    assert.equal(ticketListPayload.length, 1);
    assert.equal(ticketListPayload[0]?.id, ticketPayload.id);

    const updatedTicketStatus = await fetch(`${baseUrl}/api/v1/helpdesk/tickets/${ticketPayload.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "pending" }),
    });
    assert.equal(updatedTicketStatus.status, 200);
    const updatedTicketStatusPayload = await updatedTicketStatus.json() as { status: string };
    assert.equal(updatedTicketStatusPayload.status, "pending");

    const assignedTicket = await fetch(`${baseUrl}/api/v1/helpdesk/tickets/${ticketPayload.id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigneeId: 101 }),
    });
    assert.equal(assignedTicket.status, 200);
    const assignedTicketPayload = await assignedTicket.json() as { assigneeId: number | null };
    assert.equal(assignedTicketPayload.assigneeId, 101);

    const helpdeskReports = await fetch(`${baseUrl}/api/v1/helpdesk/reports`);
    assert.equal(helpdeskReports.status, 200);
    const helpdeskReportsPayload = await helpdeskReports.json() as {
        totalTickets: number;
        byStatus: Record<string, number>;
        byQueue: Array<{ queueId: number | null; count: number }>;
    };
    assert.equal(helpdeskReportsPayload.totalTickets, 1);
    assert.equal(helpdeskReportsPayload.byStatus.pending, 1);
    assert.equal(helpdeskReportsPayload.byQueue[0]?.queueId, queuePayload.id);
    assert.equal(helpdeskReportsPayload.byQueue[0]?.count, 1);

    const dashboardAfterHelpdesk = await fetch(`${baseUrl}/api/v1/dashboard/stats`);
    assert.equal(dashboardAfterHelpdesk.status, 200);
    assert.deepEqual(await dashboardAfterHelpdesk.json(), {
        customers: 1,
        nodes: 1,
        devices: 2,
        tickets: 1,
    });

    const documentContent = "Umowa testowa SNMS";
    const createdDocument = await fetch(`${baseUrl}/api/v1/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title: "Umowa klienta",
            docType: "contract",
            customerId: customerPayload.id,
            notes: "Dokument podpisany elektronicznie",
            originalFilename: "umowa.txt",
            mimeType: "text/plain",
            contentBase64: Buffer.from(documentContent, "utf8").toString("base64"),
        }),
    });
    assert.equal(createdDocument.status, 201);
    const documentPayload = await createdDocument.json() as {
        id: number;
        title: string;
        customer?: { id: number };
        originalFilename: string | null;
    };
    assert.ok(documentPayload.id > 0);
    assert.equal(documentPayload.title, "Umowa klienta");
    assert.equal(documentPayload.customer?.id, customerPayload.id);
    assert.equal(documentPayload.originalFilename, "umowa.txt");

    const documentList = await fetch(`${baseUrl}/api/v1/documents?q=Umowa`);
    assert.equal(documentList.status, 200);
    const documentListPayload = await documentList.json() as Array<{ id: number; fileSize: number | null }>;
    assert.equal(documentListPayload.length, 1);
    assert.equal(documentListPayload[0]?.id, documentPayload.id);
    assert.ok((documentListPayload[0]?.fileSize ?? 0) > 0);

    const downloadedDocument = await fetch(`${baseUrl}/api/v1/documents/${documentPayload.id}/download`);
    assert.equal(downloadedDocument.status, 200);
    assert.equal(downloadedDocument.headers.get("content-type"), "text/plain");
    assert.equal(await downloadedDocument.text(), documentContent);

    const deletedDocument = await fetch(`${baseUrl}/api/v1/documents/${documentPayload.id}`, {
        method: "DELETE",
    });
    assert.equal(deletedDocument.status, 204);

    const documentListAfterDelete = await fetch(`${baseUrl}/api/v1/documents`);
    assert.equal(documentListAfterDelete.status, 200);
    const documentListAfterDeletePayload = await documentListAfterDelete.json() as Array<unknown>;
    assert.equal(documentListAfterDeletePayload.length, 0);

    const tercXml = `
        <root>
            <row><WOJ>14</WOJ><POW></POW><GMI></GMI><NAZWA>mazowieckie</NAZWA></row>
            <row><WOJ>14</WOJ><POW>65</POW><GMI></GMI><NAZWA>warszawski zachodni</NAZWA></row>
        </root>
    `;

    const simcXml = `
        <root>
            <row><WOJ>14</WOJ><POW>65</POW><GMI>01</GMI><RODZ_GMI>1</RODZ_GMI><NAZWA>Ożarów Mazowiecki</NAZWA><SYM>0982950</SYM></row>
        </root>
    `;

    const ulicXml = `
        <root>
            <row><SYM>0982950</SYM><CECHA>ul.</CECHA><NAZWA_1>Poznańska</NAZWA_1><NAZWA_2></NAZWA_2><SYM_UL>15566</SYM_UL></row>
        </root>
    `;

    const importedTerc = await fetch(`${baseUrl}/api/v1/teryt/import/terc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: tercXml }),
    });
    assert.equal(importedTerc.status, 200);
    assert.deepEqual(await importedTerc.json(), {
        importedStates: 1,
        importedDistricts: 1,
    });

    const importedSimc = await fetch(`${baseUrl}/api/v1/teryt/import/simc`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: simcXml }),
    });
    assert.equal(importedSimc.status, 200);
    assert.deepEqual(await importedSimc.json(), {
        importedCities: 1,
    });

    const importedUlic = await fetch(`${baseUrl}/api/v1/teryt/import/ulic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xmlContent: ulicXml }),
    });
    assert.equal(importedUlic.status, 200);
    assert.deepEqual(await importedUlic.json(), {
        importedStreets: 1,
    });

    const terytCities = await fetch(`${baseUrl}/api/v1/teryt/cities?q=Oża`);
    assert.equal(terytCities.status, 200);
    const terytCitiesPayload = await terytCities.json() as Array<{
        id: number;
        name: string;
        district?: { name: string };
        streetCount: number;
        isManaged: boolean;
        isDefault: boolean;
    }>;
    assert.equal(terytCitiesPayload.length, 1);
    assert.equal(terytCitiesPayload[0]?.name, "Ożarów Mazowiecki");
    assert.equal(terytCitiesPayload[0]?.district?.name, "warszawski zachodni");
    assert.equal(terytCitiesPayload[0]?.streetCount, 1);
    assert.equal(terytCitiesPayload[0]?.isManaged, false);
    assert.equal(terytCitiesPayload[0]?.isDefault, false);

    const cityId = terytCitiesPayload[0]?.id ?? 0;
    assert.ok(cityId > 0);

    const citySuggestions = await fetch(`${baseUrl}/api/v1/teryt/suggest?kind=city&q=Oża`);
    assert.equal(citySuggestions.status, 200);
    const citySuggestionsPayload = await citySuggestions.json() as Array<{ text: string; type: string }>;
    assert.equal(citySuggestionsPayload.length, 1);
    assert.equal(citySuggestionsPayload[0]?.text, "Ożarów Mazowiecki");
    assert.equal(citySuggestionsPayload[0]?.type, "city");

    const streetSuggestions = await fetch(`${baseUrl}/api/v1/teryt/suggest?kind=street&cityId=${cityId}&q=Poz`);
    assert.equal(streetSuggestions.status, 200);
    const streetSuggestionsPayload = await streetSuggestions.json() as Array<{ text: string; type: string }>;
    assert.equal(streetSuggestionsPayload.length, 1);
    assert.equal(streetSuggestionsPayload[0]?.text, "ul. Poznańska");
    assert.equal(streetSuggestionsPayload[0]?.type, "street");

    const setManaged = await fetch(`${baseUrl}/api/v1/addresses/cities/${cityId}/toggle-managed`, {
        method: "POST",
    });
    assert.equal(setManaged.status, 200);
    const setManagedPayload = await setManaged.json() as { id: number; isManaged: boolean; isDefault: boolean };
    assert.equal(setManagedPayload.id, cityId);
    assert.equal(setManagedPayload.isManaged, true);
    assert.equal(setManagedPayload.isDefault, false);

    const setDefault = await fetch(`${baseUrl}/api/v1/addresses/cities/${cityId}/set-default`, {
        method: "POST",
    });
    assert.equal(setDefault.status, 200);
    const setDefaultPayload = await setDefault.json() as { id: number; isManaged: boolean; isDefault: boolean };
    assert.equal(setDefaultPayload.id, cityId);
    assert.equal(setDefaultPayload.isManaged, true);
    assert.equal(setDefaultPayload.isDefault, true);

    const managedCities = await fetch(`${baseUrl}/api/v1/addresses/cities?managedOnly=true`);
    assert.equal(managedCities.status, 200);
    const managedCitiesPayload = await managedCities.json() as Array<{ id: number; isManaged: boolean; isDefault: boolean }>;
    assert.equal(managedCitiesPayload.length, 1);
    assert.equal(managedCitiesPayload[0]?.id, cityId);
    assert.equal(managedCitiesPayload[0]?.isManaged, true);
    assert.equal(managedCitiesPayload[0]?.isDefault, true);

    const addressSearch = await fetch(`${baseUrl}/api/v1/addresses/search-teryt?q=Oża`);
    assert.equal(addressSearch.status, 200);
    const addressSearchPayload = await addressSearch.json() as Array<{ id: number; name: string }>;
    assert.equal(addressSearchPayload.length, 1);
    assert.equal(addressSearchPayload[0]?.id, cityId);
    assert.equal(addressSearchPayload[0]?.name, "Ożarów Mazowiecki");

    const adminInfo = await fetch(`${baseUrl}/api/v1/admin/info`);
    assert.equal(adminInfo.status, 200);
    const adminInfoPayload = await adminInfo.json() as { engine: string; dbKind: string };
    assert.equal(adminInfoPayload.engine, "TypeScript");
    assert.equal(adminInfoPayload.dbKind, "SQLite");

    const createdReload = await fetch(`${baseUrl}/api/v1/admin/reload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Smoke reload test" }),
    });
    assert.equal(createdReload.status, 201);
    const reloadPayload = await createdReload.json() as { id: number; note: string | null };
    assert.ok(reloadPayload.id > 0);
    assert.equal(reloadPayload.note, "Smoke reload test");

    const reloadList = await fetch(`${baseUrl}/api/v1/admin/reload`);
    assert.equal(reloadList.status, 200);
    const reloadListPayload = await reloadList.json() as Array<{ id: number; note: string | null }>;
    assert.equal(reloadListPayload.length, 1);
    assert.equal(reloadListPayload[0]?.id, reloadPayload.id);

    const createdBackup = await fetch(`${baseUrl}/api/v1/admin/backups/create`, {
        method: "POST",
    });
    assert.equal(createdBackup.status, 201);
    const backupPayload = await createdBackup.json() as { filename: string; sizeBytes: number; downloadUrl: string };
    assert.ok(backupPayload.filename.endsWith(".sqlite"));
    assert.ok(backupPayload.sizeBytes > 0);

    const backupList = await fetch(`${baseUrl}/api/v1/admin/backups`);
    assert.equal(backupList.status, 200);
    const backupListPayload = await backupList.json() as Array<{ filename: string }>;
    assert.equal(backupListPayload.length, 1);
    assert.equal(backupListPayload[0]?.filename, backupPayload.filename);

    const downloadedBackup = await fetch(`${baseUrl}${backupPayload.downloadUrl}`);
    assert.equal(downloadedBackup.status, 200);
    assert.ok((await downloadedBackup.arrayBuffer()).byteLength > 0);

    const auditLogs = await fetch(`${baseUrl}/api/v1/admin/audit-logs`);
    assert.equal(auditLogs.status, 200);
    const auditLogsPayload = await auditLogs.json() as Array<{ action: string; details: string | null }>;
    assert.ok(auditLogsPayload.some((entry) => entry.action === "config_reload" && entry.details === "Smoke reload test"));
    assert.ok(auditLogsPayload.some((entry) => entry.action === "backup_create" && entry.details?.includes(backupPayload.filename)));

    const deletedBackup = await fetch(`${baseUrl}/api/v1/admin/backups/${encodeURIComponent(backupPayload.filename)}`, {
        method: "DELETE",
    });
    assert.equal(deletedBackup.status, 204);

    const backupListAfterDelete = await fetch(`${baseUrl}/api/v1/admin/backups`);
    assert.equal(backupListAfterDelete.status, 200);
    const backupListAfterDeletePayload = await backupListAfterDelete.json() as Array<unknown>;
    assert.equal(backupListAfterDeletePayload.length, 0);

    const deleteGroup = await fetch(`${baseUrl}/api/v1/customer-groups/${groupPayload.id}`, {
        method: "DELETE",
    });
    assert.equal(deleteGroup.status, 204);
});
