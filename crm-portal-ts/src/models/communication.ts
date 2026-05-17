import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MessageStatus } from "./common.js";
import { Customer } from "./customer.js";
import { CustomerDevice } from "./network.js";

@Entity("message_templates")
export class MessageTemplate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128, unique: true })
    name!: string;

    @Column({ type: "varchar", length: 255 })
    subject!: string;

    @Column({ type: "text" })
    body!: string;
}

@Entity("outbound_messages")
export class OutboundMessage {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id", nullable: true })
    customerId?: number;

    @Column({ type: "integer", name: "template_id", nullable: true })
    templateId?: number;

    @Column({ type: "varchar", length: 255 })
    subject!: string;

    @Column({ type: "text" })
    body!: string;

    @Column({
        type: "simple-enum",
        enum: MessageStatus,
        default: MessageStatus.draft,
    })
    status!: MessageStatus;

    @Column({ type: "datetime", name: "sent_at", nullable: true })
    sentAt?: Date;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer | null;

    @ManyToOne(() => MessageTemplate, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "template_id" })
    template?: MessageTemplate | null;
}

@Entity("calendar_events")
export class CalendarEvent {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "datetime", name: "starts_at" })
    startsAt!: Date;

    @Column({ type: "datetime", name: "ends_at" })
    endsAt!: Date;

    @Column({ type: "integer", name: "customer_id", nullable: true })
    customerId?: number;

    @Column({ type: "boolean", default: false })
    done!: boolean;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer | null;
}

@Entity("traffic_stats")
export class TrafficStat {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "device_id", nullable: true })
    deviceId?: number;

    @Column({ type: "date", name: "period_start" })
    periodStart!: string;

    @Column({ type: "date", name: "period_end" })
    periodEnd!: string;

    @Column({ type: "integer", name: "bytes_in", default: 0 })
    bytesIn!: number;

    @Column({ type: "integer", name: "bytes_out", default: 0 })
    bytesOut!: number;

    @Column({ type: "text", nullable: true })
    note?: string;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @ManyToOne(() => CustomerDevice, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "device_id" })
    device?: CustomerDevice | null;
}
