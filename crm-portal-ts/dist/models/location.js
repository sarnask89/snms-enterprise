var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
let LocationState = class LocationState {
    id;
    name;
    terytCode;
    isActive;
    districts;
};
__decorate([
    PrimaryGeneratedColumn()
], LocationState.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], LocationState.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true, unique: true })
], LocationState.prototype, "terytCode", void 0);
__decorate([
    Column({ type: "boolean", name: "is_active", default: false })
], LocationState.prototype, "isActive", void 0);
__decorate([
    OneToMany(() => LocationDistrict, (district) => district.state)
], LocationState.prototype, "districts", void 0);
LocationState = __decorate([
    Entity("location_states")
], LocationState);
export { LocationState };
let LocationDistrict = class LocationDistrict {
    id;
    stateId;
    name;
    terytCode;
    isActive;
    state;
    cities;
    communes;
};
__decorate([
    PrimaryGeneratedColumn()
], LocationDistrict.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "state_id" })
], LocationDistrict.prototype, "stateId", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], LocationDistrict.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
], LocationDistrict.prototype, "terytCode", void 0);
__decorate([
    Column({ type: "boolean", name: "is_active", default: false })
], LocationDistrict.prototype, "isActive", void 0);
__decorate([
    ManyToOne(() => LocationState, (state) => state.districts, { onDelete: "CASCADE" }),
    JoinColumn({ name: "state_id" })
], LocationDistrict.prototype, "state", void 0);
__decorate([
    OneToMany(() => LocationCity, (city) => city.district)
], LocationDistrict.prototype, "cities", void 0);
__decorate([
    OneToMany(() => LocationCommune, (commune) => commune.district)
], LocationDistrict.prototype, "communes", void 0);
LocationDistrict = __decorate([
    Entity("location_districts")
], LocationDistrict);
export { LocationDistrict };
let LocationCommune = class LocationCommune {
    id;
    districtId;
    name;
    terytCode;
    communeCode;
    communeType;
    isManaged;
    isDefault;
    isActive;
    district;
    cities;
    streets;
};
__decorate([
    PrimaryGeneratedColumn()
], LocationCommune.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "district_id" })
], LocationCommune.prototype, "districtId", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], LocationCommune.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
], LocationCommune.prototype, "terytCode", void 0);
__decorate([
    Column({ type: "varchar", name: "commune_code", length: 8, nullable: true })
], LocationCommune.prototype, "communeCode", void 0);
__decorate([
    Column({ type: "varchar", name: "commune_type", length: 4, nullable: true })
], LocationCommune.prototype, "communeType", void 0);
__decorate([
    Column({ type: "boolean", name: "is_managed", default: false })
], LocationCommune.prototype, "isManaged", void 0);
__decorate([
    Column({ type: "boolean", name: "is_default", default: false })
], LocationCommune.prototype, "isDefault", void 0);
__decorate([
    Column({ type: "boolean", name: "is_active", default: false })
], LocationCommune.prototype, "isActive", void 0);
__decorate([
    ManyToOne(() => LocationDistrict, (district) => district.communes, { onDelete: "CASCADE" }),
    JoinColumn({ name: "district_id" })
], LocationCommune.prototype, "district", void 0);
__decorate([
    OneToMany(() => LocationCity, (city) => city.commune)
], LocationCommune.prototype, "cities", void 0);
__decorate([
    OneToMany(() => LocationStreet, (street) => street.commune)
], LocationCommune.prototype, "streets", void 0);
LocationCommune = __decorate([
    Entity("location_communes")
], LocationCommune);
export { LocationCommune };
let LocationCity = class LocationCity {
    id;
    districtId;
    communeId;
    name;
    terytCode;
    communeCode;
    communeType;
    isManaged;
    isDefault;
    isActive;
    district;
    commune;
    streets;
};
__decorate([
    PrimaryGeneratedColumn()
], LocationCity.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "district_id" })
], LocationCity.prototype, "districtId", void 0);
__decorate([
    Column({ type: "integer", name: "commune_id", nullable: true })
], LocationCity.prototype, "communeId", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], LocationCity.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
], LocationCity.prototype, "terytCode", void 0);
__decorate([
    Column({ type: "varchar", name: "commune_code", length: 8, nullable: true })
], LocationCity.prototype, "communeCode", void 0);
__decorate([
    Column({ type: "varchar", name: "commune_type", length: 4, nullable: true })
], LocationCity.prototype, "communeType", void 0);
__decorate([
    Column({ type: "boolean", name: "is_managed", default: false })
], LocationCity.prototype, "isManaged", void 0);
__decorate([
    Column({ type: "boolean", name: "is_default", default: false })
], LocationCity.prototype, "isDefault", void 0);
__decorate([
    Column({ type: "boolean", name: "is_active", default: false })
], LocationCity.prototype, "isActive", void 0);
__decorate([
    ManyToOne(() => LocationDistrict, (district) => district.cities, { onDelete: "CASCADE" }),
    JoinColumn({ name: "district_id" })
], LocationCity.prototype, "district", void 0);
__decorate([
    ManyToOne(() => LocationCommune, (commune) => commune.cities, { onDelete: "SET NULL", nullable: true }),
    JoinColumn({ name: "commune_id" })
], LocationCity.prototype, "commune", void 0);
__decorate([
    OneToMany(() => LocationStreet, (street) => street.city)
], LocationCity.prototype, "streets", void 0);
LocationCity = __decorate([
    Entity("location_cities")
], LocationCity);
export { LocationCity };
let LocationStreet = class LocationStreet {
    id;
    cityId;
    communeId;
    name;
    terytCode;
    city;
    commune;
};
__decorate([
    PrimaryGeneratedColumn()
], LocationStreet.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "city_id" })
], LocationStreet.prototype, "cityId", void 0);
__decorate([
    Column({ type: "integer", name: "commune_id", nullable: true })
], LocationStreet.prototype, "communeId", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], LocationStreet.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
], LocationStreet.prototype, "terytCode", void 0);
__decorate([
    ManyToOne(() => LocationCity, (city) => city.streets, { onDelete: "CASCADE" }),
    JoinColumn({ name: "city_id" })
], LocationStreet.prototype, "city", void 0);
__decorate([
    ManyToOne(() => LocationCommune, (commune) => commune.streets, { onDelete: "SET NULL", nullable: true }),
    JoinColumn({ name: "commune_id" })
], LocationStreet.prototype, "commune", void 0);
LocationStreet = __decorate([
    Entity("location_streets")
], LocationStreet);
export { LocationStreet };
//# sourceMappingURL=location.js.map