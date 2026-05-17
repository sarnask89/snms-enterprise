import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NumberPlanDocType } from "./common.js";

@Entity("divisions")
export class Division {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", length: 32, name: "short_name", nullable: true })
    shortName?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    address?: string;

    @Column({ type: "varchar", length: 128, nullable: true })
    city?: string;

    @Column({ type: "varchar", length: 16, name: "postal_code", nullable: true })
    postalCode?: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    nip?: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    regon?: string;

    @Column({ type: "boolean", default: true })
    active!: boolean;

    @Column({ type: "boolean", name: "is_default", default: false })
    isDefault!: boolean;
}

@Entity("vat_rates")
export class VatRate {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    label!: string;

    @Column({ type: "real", name: "rate_percent" })
    ratePercent!: number;

    @Column({ type: "integer", name: "sort_order", default: 0 })
    sortOrder!: number;

    @Column({ type: "boolean", name: "is_default", default: false })
    isDefault!: boolean;
}

@Entity("number_plans")
export class NumberPlan {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({
        type: "simple-enum",
        name: "doc_type",
        enum: NumberPlanDocType,
        default: NumberPlanDocType.invoice,
    })
    docType!: NumberPlanDocType;

    @Column({ type: "varchar", length: 128, name: "pattern_template" })
    patternTemplate!: string;

    @Column({ type: "integer", name: "next_number", default: 1 })
    nextNumber!: number;

    @Column({ type: "integer", name: "division_id", nullable: true })
    divisionId?: number;

    @Column({ type: "boolean", default: true })
    active!: boolean;

    @Column({ type: "boolean", name: "is_default", default: false })
    isDefault!: boolean;

    @ManyToOne(() => Division, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "division_id" })
    division?: Division | null;
}
