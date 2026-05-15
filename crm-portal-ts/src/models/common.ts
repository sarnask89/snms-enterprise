export enum CustomerStatus {
    active = "active",
    suspended = "suspended",
    terminated = "terminated"
}

export enum InvoiceStatus {
    draft = "draft",
    issued = "issued",
    paid = "paid"
}

export enum InvoiceDocumentKind {
    invoice = "invoice",
    proforma = "proforma",
    debit_note = "debit_note"
}

export enum NumberPlanDocType {
    invoice = "invoice",
    proforma = "proforma",
    debit_note = "debit_note",
    customer = "customer"
}

export enum TicketStatus {
    open = "open",
    pending = "pending",
    closed = "closed"
}

export enum CustomerDeviceStatus {
    active = "active",
    inactive = "inactive"
}

export enum NetNodeLocationType {
    basement = "basement",
    staircase = "staircase",
    floor = "floor",
    other = "other"
}

export enum NetDeviceStatus {
    active = "active",
    inactive = "inactive",
    maintenance = "maintenance"
}

export enum UserRole {
    admin = "admin",
    manager = "manager",
    service = "service",
    view = "view",
    customer = "customer"
}

export enum LedgerEntryKind {
    debit = "debit",
    credit = "credit"
}

export enum AccessTechnology {
    ftth = "FTTH",
    hfc = "HFC",
    adsl = "ADSL",
    ethernet = "Ethernet",
    wireless = "Wireless",
    copper = "Copper",
    other = "Other"
}

export enum MessageStatus {
    draft = "draft",
    sent = "sent"
}
