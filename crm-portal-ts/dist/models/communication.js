var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MessageStatus } from "./common.js";
import { Customer } from "./customer.js";
import { CustomerDevice } from "./network.js";
let MessageTemplate = class MessageTemplate {
    id;
    name;
    subject;
    body;
};
__decorate([
    PrimaryGeneratedColumn()
], MessageTemplate.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128, unique: true })
], MessageTemplate.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], MessageTemplate.prototype, "subject", void 0);
__decorate([
    Column({ type: "text" })
], MessageTemplate.prototype, "body", void 0);
MessageTemplate = __decorate([
    Entity("message_templates")
], MessageTemplate);
export { MessageTemplate };
let OutboundMessage = class OutboundMessage {
    id;
    customerId;
    templateId;
    subject;
    body;
    status;
    sentAt;
    createdAt;
    customer;
    template;
};
__decorate([
    PrimaryGeneratedColumn()
], OutboundMessage.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id", nullable: true })
], OutboundMessage.prototype, "customerId", void 0);
__decorate([
    Column({ type: "integer", name: "template_id", nullable: true })
], OutboundMessage.prototype, "templateId", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], OutboundMessage.prototype, "subject", void 0);
__decorate([
    Column({ type: "text" })
], OutboundMessage.prototype, "body", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: MessageStatus,
        default: MessageStatus.draft,
    })
], OutboundMessage.prototype, "status", void 0);
__decorate([
    Column({ type: "datetime", name: "sent_at", nullable: true })
], OutboundMessage.prototype, "sentAt", void 0);
__decorate([
    CreateDateColumn({ name: "created_at", type: "datetime" })
], OutboundMessage.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "customer_id" })
], OutboundMessage.prototype, "customer", void 0);
__decorate([
    ManyToOne(() => MessageTemplate, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "template_id" })
], OutboundMessage.prototype, "template", void 0);
OutboundMessage = __decorate([
    Entity("outbound_messages")
], OutboundMessage);
export { OutboundMessage };
let CalendarEvent = class CalendarEvent {
    id;
    title;
    description;
    startsAt;
    endsAt;
    customerId;
    done;
    createdAt;
    customer;
};
__decorate([
    PrimaryGeneratedColumn()
], CalendarEvent.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], CalendarEvent.prototype, "title", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], CalendarEvent.prototype, "description", void 0);
__decorate([
    Column({ type: "datetime", name: "starts_at" })
], CalendarEvent.prototype, "startsAt", void 0);
__decorate([
    Column({ type: "datetime", name: "ends_at" })
], CalendarEvent.prototype, "endsAt", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id", nullable: true })
], CalendarEvent.prototype, "customerId", void 0);
__decorate([
    Column({ type: "boolean", default: false })
], CalendarEvent.prototype, "done", void 0);
__decorate([
    CreateDateColumn({ name: "created_at", type: "datetime" })
], CalendarEvent.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "customer_id" })
], CalendarEvent.prototype, "customer", void 0);
CalendarEvent = __decorate([
    Entity("calendar_events")
], CalendarEvent);
export { CalendarEvent };
let TrafficStat = class TrafficStat {
    id;
    deviceId;
    periodStart;
    periodEnd;
    bytesIn;
    bytesOut;
    note;
    createdAt;
    device;
};
__decorate([
    PrimaryGeneratedColumn()
], TrafficStat.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "device_id", nullable: true })
], TrafficStat.prototype, "deviceId", void 0);
__decorate([
    Column({ type: "date", name: "period_start" })
], TrafficStat.prototype, "periodStart", void 0);
__decorate([
    Column({ type: "date", name: "period_end" })
], TrafficStat.prototype, "periodEnd", void 0);
__decorate([
    Column({ type: "integer", name: "bytes_in", default: 0 })
], TrafficStat.prototype, "bytesIn", void 0);
__decorate([
    Column({ type: "integer", name: "bytes_out", default: 0 })
], TrafficStat.prototype, "bytesOut", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], TrafficStat.prototype, "note", void 0);
__decorate([
    CreateDateColumn({ name: "created_at", type: "datetime" })
], TrafficStat.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => CustomerDevice, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "device_id" })
], TrafficStat.prototype, "device", void 0);
TrafficStat = __decorate([
    Entity("traffic_stats")
], TrafficStat);
export { TrafficStat };
//# sourceMappingURL=communication.js.map