import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketStatus } from "./common.js";
import { Customer } from "./customer.js";

@Entity("helpdesk_queues")
export class HelpdeskQueue {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 64, unique: true })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "integer", name: "sort_order", default: 0 })
    sortOrder!: number;

    @OneToMany(() => HelpdeskCategory, (category) => category.queue)
    categories!: HelpdeskCategory[];

    @OneToMany(() => SupportTicket, (ticket) => ticket.queue)
    tickets!: SupportTicket[];
}

@Entity("helpdesk_categories")
export class HelpdeskCategory {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "queue_id" })
    queueId!: number;

    @Column({ type: "varchar", length: 64 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @ManyToOne(() => HelpdeskQueue, (queue) => queue.categories, { onDelete: "CASCADE" })
    @JoinColumn({ name: "queue_id" })
    queue!: HelpdeskQueue;

    @OneToMany(() => SupportTicket, (ticket) => ticket.category)
    tickets!: SupportTicket[];
}

@Entity("support_tickets")
export class SupportTicket {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id", nullable: true })
    customerId?: number;

    @Column({ type: "integer", name: "queue_id", nullable: true })
    queueId?: number;

    @Column({ type: "integer", name: "category_id", nullable: true })
    categoryId?: number;

    @Column({ type: "integer", name: "assignee_id", nullable: true })
    assigneeId?: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text" })
    body!: string;

    @Column({
        type: "simple-enum",
        enum: TicketStatus,
        default: TicketStatus.open,
    })
    status!: TicketStatus;

    @Column({ type: "datetime", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: string;

    @Column({ type: "datetime", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: string;

    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer | null;

    @ManyToOne(() => HelpdeskQueue, (queue) => queue.tickets, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "queue_id" })
    queue?: HelpdeskQueue | null;

    @ManyToOne(() => HelpdeskCategory, (category) => category.tickets, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "category_id" })
    category?: HelpdeskCategory | null;
}
