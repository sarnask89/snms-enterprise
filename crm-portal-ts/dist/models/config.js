var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { NumberPlanDocType } from "./common.js";
let Division = class Division {
    id;
    name;
    shortName;
    address;
    city;
    postalCode;
    nip;
    regon;
    active;
    isDefault;
};
__decorate([
    PrimaryGeneratedColumn()
], Division.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], Division.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", length: 32, name: "short_name", nullable: true })
], Division.prototype, "shortName", void 0);
__decorate([
    Column({ type: "varchar", length: 255, nullable: true })
], Division.prototype, "address", void 0);
__decorate([
    Column({ type: "varchar", length: 128, nullable: true })
], Division.prototype, "city", void 0);
__decorate([
    Column({ type: "varchar", length: 16, name: "postal_code", nullable: true })
], Division.prototype, "postalCode", void 0);
__decorate([
    Column({ type: "varchar", length: 20, nullable: true })
], Division.prototype, "nip", void 0);
__decorate([
    Column({ type: "varchar", length: 20, nullable: true })
], Division.prototype, "regon", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], Division.prototype, "active", void 0);
__decorate([
    Column({ type: "boolean", name: "is_default", default: false })
], Division.prototype, "isDefault", void 0);
Division = __decorate([
    Entity("divisions")
], Division);
export { Division };
let VatRate = class VatRate {
    id;
    label;
    ratePercent;
    sortOrder;
    isDefault;
};
__decorate([
    PrimaryGeneratedColumn()
], VatRate.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], VatRate.prototype, "label", void 0);
__decorate([
    Column({ type: "real", name: "rate_percent" })
], VatRate.prototype, "ratePercent", void 0);
__decorate([
    Column({ type: "integer", name: "sort_order", default: 0 })
], VatRate.prototype, "sortOrder", void 0);
__decorate([
    Column({ type: "boolean", name: "is_default", default: false })
], VatRate.prototype, "isDefault", void 0);
VatRate = __decorate([
    Entity("vat_rates")
], VatRate);
export { VatRate };
let NumberPlan = class NumberPlan {
    id;
    name;
    docType;
    patternTemplate;
    nextNumber;
    divisionId;
    active;
    isDefault;
    division;
};
__decorate([
    PrimaryGeneratedColumn()
], NumberPlan.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], NumberPlan.prototype, "name", void 0);
__decorate([
    Column({
        type: "simple-enum",
        name: "doc_type",
        enum: NumberPlanDocType,
        default: NumberPlanDocType.invoice,
    })
], NumberPlan.prototype, "docType", void 0);
__decorate([
    Column({ type: "varchar", length: 128, name: "pattern_template" })
], NumberPlan.prototype, "patternTemplate", void 0);
__decorate([
    Column({ type: "integer", name: "next_number", default: 1 })
], NumberPlan.prototype, "nextNumber", void 0);
__decorate([
    Column({ type: "integer", name: "division_id", nullable: true })
], NumberPlan.prototype, "divisionId", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], NumberPlan.prototype, "active", void 0);
__decorate([
    Column({ type: "boolean", name: "is_default", default: false })
], NumberPlan.prototype, "isDefault", void 0);
__decorate([
    ManyToOne(() => Division, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "division_id" })
], NumberPlan.prototype, "division", void 0);
NumberPlan = __decorate([
    Entity("number_plans")
], NumberPlan);
export { NumberPlan };
//# sourceMappingURL=config.js.map