var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { CustomerStatus } from "./common.js";
let CustomerGroup = class CustomerGroup {
    id;
    name;
    description;
    customers;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], CustomerGroup.prototype, "id", void 0);
__decorate([
    Column({ length: 128, unique: true }),
    __metadata("design:type", String)
], CustomerGroup.prototype, "name", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], CustomerGroup.prototype, "description", void 0);
__decorate([
    ManyToMany(() => Customer, (customer) => customer.groups),
    __metadata("design:type", Array)
], CustomerGroup.prototype, "customers", void 0);
CustomerGroup = __decorate([
    Entity("customer_groups")
], CustomerGroup);
export { CustomerGroup };
let Customer = class Customer {
    id;
    customerCode;
    firstName;
    lastName;
    email;
    phone;
    status;
    creationDate;
    notes;
    portalLogin;
    portalPasswordHash;
    lastPortalLogin;
    locationCityId;
    locationStreetId;
    streetNumber;
    apartmentNumber;
    groups;
    documents;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    Column({ name: "customer_code", length: 64, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "customerCode", void 0);
__decorate([
    Column({ name: "first_name", length: 128 }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    Column({ name: "last_name", length: 128 }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    Column({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    Column({ length: 64, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: CustomerStatus,
        default: CustomerStatus.active
    }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    Column({ name: "creation_date", type: "date", default: () => "CURRENT_DATE" }),
    __metadata("design:type", String)
], Customer.prototype, "creationDate", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "notes", void 0);
__decorate([
    Column({ name: "portal_login", length: 64, unique: true, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "portalLogin", void 0);
__decorate([
    Column({ name: "portal_password_hash", length: 255, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "portalPasswordHash", void 0);
__decorate([
    Column({ name: "last_portal_login", type: "datetime", nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "lastPortalLogin", void 0);
__decorate([
    Column({ name: "location_city_id", nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "locationCityId", void 0);
__decorate([
    Column({ name: "location_street_id", nullable: true }),
    __metadata("design:type", Number)
], Customer.prototype, "locationStreetId", void 0);
__decorate([
    Column({ name: "street_number", length: 32, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "streetNumber", void 0);
__decorate([
    Column({ name: "apartment_number", length: 32, nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "apartmentNumber", void 0);
__decorate([
    ManyToMany(() => CustomerGroup, (group) => group.customers),
    JoinTable({
        name: "customer_group_members",
        joinColumn: { name: "customer_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "group_id", referencedColumnName: "id" }
    }),
    __metadata("design:type", Array)
], Customer.prototype, "groups", void 0);
__decorate([
    OneToMany(() => Document, (document) => document.customer),
    __metadata("design:type", Array)
], Customer.prototype, "documents", void 0);
Customer = __decorate([
    Entity("customers")
], Customer);
export { Customer };
let Document = class Document {
    id;
    customerId;
    title;
    filePath;
    fileSize;
    fileType;
    createdAt;
    customer;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Document.prototype, "id", void 0);
__decorate([
    Column({ name: "customer_id" }),
    __metadata("design:type", Number)
], Document.prototype, "customerId", void 0);
__decorate([
    Column({ length: 255 }),
    __metadata("design:type", String)
], Document.prototype, "title", void 0);
__decorate([
    Column({ name: "file_path", length: 512 }),
    __metadata("design:type", String)
], Document.prototype, "filePath", void 0);
__decorate([
    Column({ name: "file_size", nullable: true }),
    __metadata("design:type", Number)
], Document.prototype, "fileSize", void 0);
__decorate([
    Column({ name: "file_type", length: 128, nullable: true }),
    __metadata("design:type", String)
], Document.prototype, "fileType", void 0);
__decorate([
    Column({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" }),
    __metadata("design:type", Date)
], Document.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => Customer, (customer) => customer.documents, { onDelete: "CASCADE" }),
    JoinColumn({ name: "customer_id" }),
    __metadata("design:type", Customer)
], Document.prototype, "customer", void 0);
Document = __decorate([
    Entity("documents")
], Document);
export { Document };
//# sourceMappingURL=customer.js.map