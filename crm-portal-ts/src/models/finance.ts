import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AccessTechnology, InvoiceDocumentKind, InvoiceStatus, LedgerEntryKind } from "./common.js";
import { Customer } from "./customer.js";
import { CustomerDevice } from "./network.js";

@Entity("tariffs")
export class Tariff {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "real", name: "monthly_price" })
    monthlyPrice!: number;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "boolean", default: true })
    active!: boolean;

    @Column({ type: "integer", name: "speed_down_mbps", nullable: true })
    speedDownMbps?: number;

    @Column({ type: "integer", name: "speed_up_mbps", nullable: true })
    speedUpMbps?: number;

    @Column({ type: "integer", name: "vat_rate_id", nullable: true })
    vatRateId?: number;

    @OneToMany(() => Subscription, (subscription) => subscription.tariff)
    subscriptions!: Subscription[];
}

@Entity("subscriptions")
export class Subscription {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id" })
    customerId!: number;

    @Column({ type: "integer", name: "tariff_id" })
    tariffId!: number;

    @Column({ type: "integer", name: "device_id", nullable: true })
    deviceId?: number;

    @Column({ type: "date", name: "start_date", default: () => "CURRENT_DATE" })
    startDate!: string;

    @Column({ type: "date", name: "end_date", nullable: true })
    endDate?: string;

    @Column({ type: "boolean", default: true })
    active!: boolean;

    @Column({
        type: "simple-enum",
        enum: AccessTechnology,
        default: AccessTechnology.ftth,
    })
    technology!: AccessTechnology;

    @Column({ type: "integer", name: "speed_down_mbps", nullable: true })
    speedDownMbps?: number;

    @Column({ type: "integer", name: "speed_up_mbps", nullable: true })
    speedUpMbps?: number;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;

    @ManyToOne(() => Tariff, (tariff) => tariff.subscriptions, { onDelete: "RESTRICT" })
    @JoinColumn({ name: "tariff_id" })
    tariff!: Tariff;

    @ManyToOne(() => CustomerDevice, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "device_id" })
    device?: CustomerDevice | null;
}

@Entity("invoices")
export class Invoice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 64, unique: true })
    number!: string;

    @Column({ type: "integer", name: "customer_id" })
    customerId!: number;

    @Column({ type: "real" })
    amount!: number;

    @Column({
        type: "simple-enum",
        enum: InvoiceStatus,
        default: InvoiceStatus.draft,
    })
    status!: InvoiceStatus;

    @Column({ type: "date", name: "issue_date", default: () => "CURRENT_DATE" })
    issueDate!: string;

    @Column({ type: "integer", name: "division_id", nullable: true })
    divisionId?: number;

    @Column({ type: "integer", name: "vat_rate_id", nullable: true })
    vatRateId?: number;

    @Column({
        type: "simple-enum",
        name: "document_kind",
        enum: InvoiceDocumentKind,
        default: InvoiceDocumentKind.invoice,
    })
    documentKind!: InvoiceDocumentKind;

    @Column({ type: "real", name: "amount_net", nullable: true })
    amountNet?: number;

    @Column({ type: "real", name: "amount_vat", nullable: true })
    amountVat?: number;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;
}

@Entity("recurring_payments")
export class RecurringPayment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id" })
    customerId!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "real" })
    amount!: number;

    @Column({ type: "integer", name: "interval_months", default: 1 })
    intervalMonths!: number;

    @Column({ type: "integer", name: "day_of_month", default: 1 })
    dayOfMonth!: number;

    @Column({ type: "boolean", default: true })
    active!: boolean;

    @Column({ type: "date", name: "next_run", nullable: true })
    nextRun?: string;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;
}

@Entity("ledger_entries")
export class LedgerEntry {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id" })
    customerId!: number;

    @Column({ type: "real" })
    amount!: number;

    @Column({
        type: "simple-enum",
        enum: LedgerEntryKind,
    })
    kind!: LedgerEntryKind;

    @Column({ type: "varchar", length: 255 })
    description!: string;

    @Column({ type: "datetime", name: "posted_at", default: () => "CURRENT_TIMESTAMP" })
    postedAt!: string;

    @ManyToOne(() => Customer, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;
}

@Entity("cash_receipts")
export class CashReceipt {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id", nullable: true })
    customerId?: number;

    @Column({ type: "real" })
    amount!: number;

    @Column({ type: "varchar", length: 255 })
    description!: string;

    @Column({ type: "datetime", name: "issued_at", default: () => "CURRENT_TIMESTAMP" })
    issuedAt!: string;

    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer | null;
}
