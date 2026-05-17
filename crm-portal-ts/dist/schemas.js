var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
let Customer = class Customer {
    id;
    customer_code;
    first_name;
    last_name;
    email;
    phone;
    status;
    location_state_id;
    location_district_id;
    location_city_id;
    location_street_id;
    street_number;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "customer_code", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Customer.prototype, "first_name", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Customer.prototype, "last_name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    Column({ enum: CustomerStatus, default: 'active' }),
    __metadata("design:type", typeof (_a = typeof CustomerStatus !== "undefined" && CustomerStatus) === "function" ? _a : Object)
], Customer.prototype, "status", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "location_state_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "location_district_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "location_city_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "location_street_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "street_number", void 0);
Customer = __decorate([
    Entity()
], Customer);
export { Customer };
let SupportTicket = class SupportTicket {
    id;
    title;
    body;
    status;
    queue;
    queue_id;
    category_id;
    customer_id;
    assignee_id;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], SupportTicket.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "title", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "body", void 0);
__decorate([
    Column({ enum: TicketStatus, default: 'open' }),
    __metadata("design:type", typeof (_b = typeof TicketStatus !== "undefined" && TicketStatus) === "function" ? _b : Object)
], SupportTicket.prototype, "status", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], SupportTicket.prototype, "queue", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "queue_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "category_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "customer_id", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "assignee_id", void 0);
SupportTicket = __decorate([
    Entity()
], SupportTicket);
export { SupportTicket };
//# sourceMappingURL=schemas.js.map