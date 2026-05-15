import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";  
import { CustomerStatus } from "./common.js";

@Entity("customer_groups")
export class CustomerGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128, unique: true })
    name!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @ManyToMany(() => Customer, (customer) => customer.groups)
    customers!: Customer[];
}

@Entity("customers")
export class Customer {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", name: "customer_code", length: 64, unique: true })
    customerCode!: string;

    @Column({ type: "varchar", name: "first_name", length: 128 })
    firstName!: string;

    @Column({ type: "varchar", name: "last_name", length: 128 })
    lastName!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    email?: string;

    @Column({ type: "varchar", length: 64, nullable: true })
    phone?: string;

    @Column({
        type: "simple-enum",
        enum: CustomerStatus,
        default: CustomerStatus.active
    })
    status!: CustomerStatus;

    @Column({ name: "creation_date", type: "date", default: () => "CURRENT_DATE" })
    creationDate!: string;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ type: "varchar", name: "portal_login", length: 64, unique: true, nullable: true })
    portalLogin?: string;

    @Column({ type: "varchar", name: "portal_password_hash", length: 255, nullable: true })
    portalPasswordHash?: string;

    @Column({ name: "last_portal_login", type: "datetime", nullable: true })
    lastPortalLogin?: Date;

    @Column({ type: "integer", name: "location_city_id", nullable: true })
    locationCityId?: number;

    @Column({ type: "integer", name: "location_street_id", nullable: true })
    locationStreetId?: number;

    @Column({ type: "varchar", name: "street_number", length: 32, nullable: true })
    streetNumber?: string;

    @Column({ type: "varchar", name: "apartment_number", length: 32, nullable: true })
    apartmentNumber?: string;

    @ManyToMany(() => CustomerGroup, (group) => group.customers)
    @JoinTable({
        name: "customer_group_members",
        joinColumn: { name: "customer_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "group_id", referencedColumnName: "id" }
    })
    groups!: CustomerGroup[];

    @OneToMany(() => CustomerDevice, (device) => device.customer)
    devices!: CustomerDevice[];

    @OneToMany(() => CustomerNotice, (notice) => notice.customer)
    notices!: CustomerNotice[];

    @OneToMany(() => Document, (document) => document.customer)
    documents!: Document[];
}

@Entity("customer_notices")
export class CustomerNotice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id" })
    customerId!: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "text", nullable: true })
    body?: string;

    @Column({ type: "varchar", length: 64, default: "info" })
    category!: string;

    @Column({ name: "valid_until", type: "date", nullable: true })
    validUntil?: string;

    @Column({ type: "boolean", name: "is_active", default: true })
    isActive!: boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @ManyToOne(() => Customer, (customer) => customer.notices)
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;
}

@Entity("documents")
export class Document {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id", nullable: true })
    customerId?: number;

    @Column({ type: "varchar", length: 255 })
    title!: string;

    @Column({ type: "varchar", name: "doc_type", length: 64, default: "other" })
    docType!: string;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ type: "varchar", name: "stored_path", length: 512, nullable: true })
    storedPath?: string;

    @Column({ type: "varchar", name: "original_filename", length: 255, nullable: true })
    originalFilename?: string;

    @Column({ type: "integer", name: "file_size", nullable: true })
    fileSize?: number;

    @Column({ type: "varchar", name: "mime_type", length: 128, nullable: true })
    mimeType?: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt!: Date;

    @ManyToOne(() => Customer, (customer) => customer.documents, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer | null;
}

import { CustomerDevice } from "./network.js";
