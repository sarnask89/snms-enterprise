export var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["active"] = "active";
    CustomerStatus["suspended"] = "suspended";
    CustomerStatus["terminated"] = "terminated";
})(CustomerStatus || (CustomerStatus = {}));
export var CustomerType;
(function (CustomerType) {
    CustomerType["individual"] = "individual";
    CustomerType["company"] = "company";
})(CustomerType || (CustomerType = {}));
export var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["bankTransfer"] = "bank_transfer";
    PaymentMethod["cash"] = "cash";
    PaymentMethod["directDebit"] = "direct_debit";
    PaymentMethod["card"] = "card";
    PaymentMethod["other"] = "other";
})(PaymentMethod || (PaymentMethod = {}));
export var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["draft"] = "draft";
    InvoiceStatus["issued"] = "issued";
    InvoiceStatus["paid"] = "paid";
})(InvoiceStatus || (InvoiceStatus = {}));
export var InvoiceDocumentKind;
(function (InvoiceDocumentKind) {
    InvoiceDocumentKind["invoice"] = "invoice";
    InvoiceDocumentKind["proforma"] = "proforma";
    InvoiceDocumentKind["debit_note"] = "debit_note";
})(InvoiceDocumentKind || (InvoiceDocumentKind = {}));
export var NumberPlanDocType;
(function (NumberPlanDocType) {
    NumberPlanDocType["invoice"] = "invoice";
    NumberPlanDocType["proforma"] = "proforma";
    NumberPlanDocType["debit_note"] = "debit_note";
    NumberPlanDocType["customer"] = "customer";
})(NumberPlanDocType || (NumberPlanDocType = {}));
export var TicketStatus;
(function (TicketStatus) {
    TicketStatus["open"] = "open";
    TicketStatus["pending"] = "pending";
    TicketStatus["closed"] = "closed";
})(TicketStatus || (TicketStatus = {}));
export var CustomerDeviceStatus;
(function (CustomerDeviceStatus) {
    CustomerDeviceStatus["active"] = "active";
    CustomerDeviceStatus["inactive"] = "inactive";
})(CustomerDeviceStatus || (CustomerDeviceStatus = {}));
export var NetNodeLocationType;
(function (NetNodeLocationType) {
    NetNodeLocationType["basement"] = "basement";
    NetNodeLocationType["staircase"] = "staircase";
    NetNodeLocationType["floor"] = "floor";
    NetNodeLocationType["other"] = "other";
})(NetNodeLocationType || (NetNodeLocationType = {}));
export var NetDeviceStatus;
(function (NetDeviceStatus) {
    NetDeviceStatus["active"] = "active";
    NetDeviceStatus["inactive"] = "inactive";
    NetDeviceStatus["maintenance"] = "maintenance";
})(NetDeviceStatus || (NetDeviceStatus = {}));
export var UserRole;
(function (UserRole) {
    UserRole["admin"] = "admin";
    UserRole["manager"] = "manager";
    UserRole["service"] = "service";
    UserRole["view"] = "view";
    UserRole["customer"] = "customer";
})(UserRole || (UserRole = {}));
export var LedgerEntryKind;
(function (LedgerEntryKind) {
    LedgerEntryKind["debit"] = "debit";
    LedgerEntryKind["credit"] = "credit";
})(LedgerEntryKind || (LedgerEntryKind = {}));
export var AccessTechnology;
(function (AccessTechnology) {
    AccessTechnology["ftth"] = "FTTH";
    AccessTechnology["hfc"] = "HFC";
    AccessTechnology["adsl"] = "ADSL";
    AccessTechnology["ethernet"] = "Ethernet";
    AccessTechnology["wireless"] = "Wireless";
    AccessTechnology["copper"] = "Copper";
    AccessTechnology["other"] = "Other";
})(AccessTechnology || (AccessTechnology = {}));
export var MessageStatus;
(function (MessageStatus) {
    MessageStatus["draft"] = "draft";
    MessageStatus["sent"] = "sent";
})(MessageStatus || (MessageStatus = {}));
//# sourceMappingURL=common.js.map