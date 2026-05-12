import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { CustomerStatus } from "./common.js";

@Entity("customer_groups")
export class CustomerGroup {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 128, unique: true })
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

    @Column({ name: "customer_code", length: 64, unique: true })
    customerCode!: string;

    @Column({ name: "first_name", length: 128 })
    firstName!: string;

    @Column({ name: "last_name", length: 128 })
    lastName!: string;

    @Column({ length: 255, nullable: true })
    email?: string;

    @Column({ length: 64, nullable: true })
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

    @Column({ name: "portal_login", length: 64, unique: true, nullable: true })
    portalLogin?: string;

    @Column({ name: "portal_password_hash", length: 255, nullable: true })
    portalPasswordHash?: string;

    @Column({ name: "last_portal_login", type: "datetime", nullable: true })
    lastPortalLogin?: Date;

    @Column({ name: "location_city_id", nullable: true })
    locationCityId?: number;

    @Column({ name: "location_street_id", nullable: true })
    locationStreetId?: number;

    @Column({ name: "street_number", length: 32, nullable: true })
    streetNumber?: string;

    @Column({ name: "apartment_number", length: 32, nullable: true })
    apartmentNumber?: string;

    @ManyToMany(() => CustomerGroup, (group) => group.customers)
    @JoinTable({
        name: "customer_group_members",
        joinColumn: { name: "customer_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "group_id", referencedColumnName: "id" }
    })
    groups!: CustomerGroup[];

    @OneToMany(() => Document, (document) => document.customer)
    documents!: Document[];
}

@Entity("documents")
export class Document {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: "customer_id" })
    customerId!: number;

    @Column({ length: 255 })
    title!: string;

    @Column({ name: "file_path", length: 512 })
    filePath!: string;

    @Column({ name: "file_size", nullable: true })
    fileSize?: number;

    @Column({ name: "file_type", length: 128, nullable: true })
    fileType?: string;

    @Column({ name: "created_at", type: "datetime", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @ManyToOne(() => Customer, (customer) => customer.documents, { onDelete: "CASCADE" })
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;
}
