var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AccessTechnology, InvoiceDocumentKind, InvoiceStatus, LedgerEntryKind } from "./common.js";
import { Customer } from "./customer.js";
import { CustomerDevice } from "./network.js";
let Tariff = class Tariff {
    id;
    name;
    monthlyPrice;
    description;
    active;
    speedDownMbps;
    speedUpMbps;
    vatRateId;
    subscriptions;
};
__decorate([
    PrimaryGeneratedColumn()
], Tariff.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], Tariff.prototype, "name", void 0);
__decorate([
    Column({ type: "real", name: "monthly_price" })
], Tariff.prototype, "monthlyPrice", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], Tariff.prototype, "description", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], Tariff.prototype, "active", void 0);
__decorate([
    Column({ type: "integer", name: "speed_down_mbps", nullable: true })
], Tariff.prototype, "speedDownMbps", void 0);
__decorate([
    Column({ type: "integer", name: "speed_up_mbps", nullable: true })
], Tariff.prototype, "speedUpMbps", void 0);
__decorate([
    Column({ type: "integer", name: "vat_rate_id", nullable: true })
], Tariff.prototype, "vatRateId", void 0);
__decorate([
    OneToMany(() => Subscription, (subscription) => subscription.tariff)
], Tariff.prototype, "subscriptions", void 0);
Tariff = __decorate([
    Entity("tariffs")
], Tariff);
export { Tariff };
let Subscription = class Subscription {
    id;
    customerId;
    tariffId;
    deviceId;
    startDate;
    endDate;
    active;
    technology;
    speedDownMbps;
    speedUpMbps;
    customer;
    tariff;
    device;
};
__decorate([
    PrimaryGeneratedColumn()
], Subscription.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id" })
], Subscription.prototype, "customerId", void 0);
__decorate([
    Column({ type: "integer", name: "tariff_id" })
], Subscription.prototype, "tariffId", void 0);
__decorate([
    Column({ type: "integer", name: "device_id", nullable: true })
], Subscription.prototype, "deviceId", void 0);
__decorate([
    Column({ type: "date", name: "start_date", default: () => "CURRENT_DATE" })
], Subscription.prototype, "startDate", void 0);
__decorate([
    Column({ type: "date", name: "end_date", nullable: true })
], Subscription.prototype, "endDate", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], Subscription.prototype, "active", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: AccessTechnology,
        default: AccessTechnology.ftth,
    })
], Subscription.prototype, "technology", void 0);
__decorate([
    Column({ type: "integer", name: "speed_down_mbps", nullable: true })
], Subscription.prototype, "speedDownMbps", void 0);
__decorate([
    Column({ type: "integer", name: "speed_up_mbps", nullable: true })
], Subscription.prototype, "speedUpMbps", void 0);
__decorate([
    ManyToOne(() => Customer, { onDelete: "CASCADE" }),
    JoinColumn({ name: "customer_id" })
], Subscription.prototype, "customer", void 0);
__decorate([
    ManyToOne(() => Tariff, (tariff) => tariff.subscriptions, { onDelete: "RESTRICT" }),
    JoinColumn({ name: "tariff_id" })
], Subscription.prototype, "tariff", void 0);
__decorate([
    ManyToOne(() => CustomerDevice, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "device_id" })
], Subscription.prototype, "device", void 0);
Subscription = __decorate([
    Entity("subscriptions")
], Subscription);
export { Subscription };
let Invoice = class Invoice {
    id;
    number;
    customerId;
    amount;
    status;
    issueDate;
    divisionId;
    vatRateId;
    documentKind;
    amountNet;
    amountVat;
    customer;
};
__decorate([
    PrimaryGeneratedColumn()
], Invoice.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 64, unique: true })
], Invoice.prototype, "number", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id" })
], Invoice.prototype, "customerId", void 0);
__decorate([
    Column({ type: "real" })
], Invoice.prototype, "amount", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: InvoiceStatus,
        default: InvoiceStatus.draft,
    })
], Invoice.prototype, "status", void 0);
__decorate([
    Column({ type: "date", name: "issue_date", default: () => "CURRENT_DATE" })
], Invoice.prototype, "issueDate", void 0);
__decorate([
    Column({ type: "integer", name: "division_id", nullable: true })
], Invoice.prototype, "divisionId", void 0);
__decorate([
    Column({ type: "integer", name: "vat_rate_id", nullable: true })
], Invoice.prototype, "vatRateId", void 0);
__decorate([
    Column({
        type: "simple-enum",
        name: "document_kind",
        enum: InvoiceDocumentKind,
        default: InvoiceDocumentKind.invoice,
    })
], Invoice.prototype, "documentKind", void 0);
__decorate([
    Column({ type: "real", name: "amount_net", nullable: true })
], Invoice.prototype, "amountNet", void 0);
__decorate([
    Column({ type: "real", name: "amount_vat", nullable: true })
], Invoice.prototype, "amountVat", void 0);
__decorate([
    ManyToOne(() => Customer, { onDelete: "CASCADE" }),
    JoinColumn({ name: "customer_id" })
], Invoice.prototype, "customer", void 0);
Invoice = __decorate([
    Entity("invoices")
], Invoice);
export { Invoice };
let RecurringPayment = class RecurringPayment {
    id;
    customerId;
    name;
    amount;
    intervalMonths;
    dayOfMonth;
    active;
    nextRun;
    customer;
};
__decorate([
    PrimaryGeneratedColumn()
], RecurringPayment.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id" })
], RecurringPayment.prototype, "customerId", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], RecurringPayment.prototype, "name", void 0);
__decorate([
    Column({ type: "real" })
], RecurringPayment.prototype, "amount", void 0);
__decorate([
    Column({ type: "integer", name: "interval_months", default: 1 })
], RecurringPayment.prototype, "intervalMonths", void 0);
__decorate([
    Column({ type: "integer", name: "day_of_month", default: 1 })
], RecurringPayment.prototype, "dayOfMonth", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], RecurringPayment.prototype, "active", void 0);
__decorate([
    Column({ type: "date", name: "next_run", nullable: true })
], RecurringPayment.prototype, "nextRun", void 0);
__decorate([
    ManyToOne(() => Customer, { onDelete: "CASCADE" }),
    JoinColumn({ name: "customer_id" })
], RecurringPayment.prototype, "customer", void 0);
RecurringPayment = __decorate([
    Entity("recurring_payments")
], RecurringPayment);
export { RecurringPayment };
let LedgerEntry = class LedgerEntry {
    id;
    customerId;
    amount;
    kind;
    description;
    postedAt;
    customer;
};
__decorate([
    PrimaryGeneratedColumn()
], LedgerEntry.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id" })
], LedgerEntry.prototype, "customerId", void 0);
__decorate([
    Column({ type: "real" })
], LedgerEntry.prototype, "amount", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: LedgerEntryKind,
    })
], LedgerEntry.prototype, "kind", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], LedgerEntry.prototype, "description", void 0);
__decorate([
    Column({ type: "datetime", name: "posted_at", default: () => "CURRENT_TIMESTAMP" })
], LedgerEntry.prototype, "postedAt", void 0);
__decorate([
    ManyToOne(() => Customer, { onDelete: "CASCADE" }),
    JoinColumn({ name: "customer_id" })
], LedgerEntry.prototype, "customer", void 0);
LedgerEntry = __decorate([
    Entity("ledger_entries")
], LedgerEntry);
export { LedgerEntry };
let CashReceipt = class CashReceipt {
    id;
    customerId;
    amount;
    description;
    issuedAt;
    customer;
};
__decorate([
    PrimaryGeneratedColumn()
], CashReceipt.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id", nullable: true })
], CashReceipt.prototype, "customerId", void 0);
__decorate([
    Column({ type: "real" })
], CashReceipt.prototype, "amount", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], CashReceipt.prototype, "description", void 0);
__decorate([
    Column({ type: "datetime", name: "issued_at", default: () => "CURRENT_TIMESTAMP" })
], CashReceipt.prototype, "issuedAt", void 0);
__decorate([
    ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "customer_id" })
], CashReceipt.prototype, "customer", void 0);
CashReceipt = __decorate([
    Entity("cash_receipts")
], CashReceipt);
export { CashReceipt };
//# sourceMappingURL=finance.js.map