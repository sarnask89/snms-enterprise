var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketStatus } from "./common.js";
import { Customer } from "./customer.js";
let HelpdeskQueue = class HelpdeskQueue {
    id;
    name;
    description;
    sortOrder;
    categories;
    tickets;
};
__decorate([
    PrimaryGeneratedColumn()
], HelpdeskQueue.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 64, unique: true })
], HelpdeskQueue.prototype, "name", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], HelpdeskQueue.prototype, "description", void 0);
__decorate([
    Column({ type: "integer", name: "sort_order", default: 0 })
], HelpdeskQueue.prototype, "sortOrder", void 0);
__decorate([
    OneToMany(() => HelpdeskCategory, (category) => category.queue)
], HelpdeskQueue.prototype, "categories", void 0);
__decorate([
    OneToMany(() => SupportTicket, (ticket) => ticket.queue)
], HelpdeskQueue.prototype, "tickets", void 0);
HelpdeskQueue = __decorate([
    Entity("helpdesk_queues")
], HelpdeskQueue);
export { HelpdeskQueue };
let HelpdeskCategory = class HelpdeskCategory {
    id;
    queueId;
    name;
    description;
    queue;
    tickets;
};
__decorate([
    PrimaryGeneratedColumn()
], HelpdeskCategory.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "queue_id" })
], HelpdeskCategory.prototype, "queueId", void 0);
__decorate([
    Column({ type: "varchar", length: 64 })
], HelpdeskCategory.prototype, "name", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], HelpdeskCategory.prototype, "description", void 0);
__decorate([
    ManyToOne(() => HelpdeskQueue, (queue) => queue.categories, { onDelete: "CASCADE" }),
    JoinColumn({ name: "queue_id" })
], HelpdeskCategory.prototype, "queue", void 0);
__decorate([
    OneToMany(() => SupportTicket, (ticket) => ticket.category)
], HelpdeskCategory.prototype, "tickets", void 0);
HelpdeskCategory = __decorate([
    Entity("helpdesk_categories")
], HelpdeskCategory);
export { HelpdeskCategory };
let SupportTicket = class SupportTicket {
    id;
    customerId;
    queueId;
    categoryId;
    assigneeId;
    title;
    body;
    status;
    createdAt;
    updatedAt;
    customer;
    queue;
    category;
};
__decorate([
    PrimaryGeneratedColumn()
], SupportTicket.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id", nullable: true })
], SupportTicket.prototype, "customerId", void 0);
__decorate([
    Column({ type: "integer", name: "queue_id", nullable: true })
], SupportTicket.prototype, "queueId", void 0);
__decorate([
    Column({ type: "integer", name: "category_id", nullable: true })
], SupportTicket.prototype, "categoryId", void 0);
__decorate([
    Column({ type: "integer", name: "assignee_id", nullable: true })
], SupportTicket.prototype, "assigneeId", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], SupportTicket.prototype, "title", void 0);
__decorate([
    Column({ type: "text" })
], SupportTicket.prototype, "body", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: TicketStatus,
        default: TicketStatus.open,
    })
], SupportTicket.prototype, "status", void 0);
__decorate([
    Column({ type: "datetime", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
], SupportTicket.prototype, "createdAt", void 0);
__decorate([
    Column({ type: "datetime", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
], SupportTicket.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "customer_id" })
], SupportTicket.prototype, "customer", void 0);
__decorate([
    ManyToOne(() => HelpdeskQueue, (queue) => queue.tickets, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "queue_id" })
], SupportTicket.prototype, "queue", void 0);
__decorate([
    ManyToOne(() => HelpdeskCategory, (category) => category.tickets, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "category_id" })
], SupportTicket.prototype, "category", void 0);
SupportTicket = __decorate([
    Entity("support_tickets")
], SupportTicket);
export { SupportTicket };
//# sourceMappingURL=helpdesk.js.map