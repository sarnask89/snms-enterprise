import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";

@Entity("location_states")
export class LocationState {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true, unique: true })
    terytCode?: string;

    @Column({ type: "boolean", name: "is_active", default: false })
    isActive!: boolean;

    @OneToMany(() => LocationDistrict, (district) => district.state)
    districts!: LocationDistrict[];
}

@Entity("location_districts")
export class LocationDistrict {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "state_id" })
    stateId!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
    terytCode?: string;

    @Column({ type: "boolean", name: "is_active", default: false })
    isActive!: boolean;

    @ManyToOne(() => LocationState, (state) => state.districts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "state_id" })
    state!: LocationState;

    @OneToMany(() => LocationCity, (city) => city.district)
    cities!: LocationCity[];

    @OneToMany(() => LocationCommune, (commune) => commune.district)
    communes!: LocationCommune[];
}

@Entity("location_communes")
export class LocationCommune {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "district_id" })
    districtId!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
    terytCode?: string;

    @Column({ type: "varchar", name: "commune_code", length: 8, nullable: true })
    communeCode?: string;

    @Column({ type: "varchar", name: "commune_type", length: 4, nullable: true })
    communeType?: string;

    @Column({ type: "boolean", name: "is_managed", default: false })
    isManaged!: boolean;

    @Column({ type: "boolean", name: "is_default", default: false })
    isDefault!: boolean;

    @Column({ type: "boolean", name: "is_active", default: false })
    isActive!: boolean;

    @ManyToOne(() => LocationDistrict, (district) => district.communes, { onDelete: "CASCADE" })
    @JoinColumn({ name: "district_id" })
    district!: LocationDistrict;

    @OneToMany(() => LocationCity, (city) => city.commune)
    cities!: LocationCity[];

    @OneToMany(() => LocationStreet, (street) => street.commune)
    streets!: LocationStreet[];
}

@Entity("location_cities")
export class LocationCity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "district_id" })
    districtId!: number;

    @Column({ type: "integer", name: "commune_id", nullable: true })
    communeId?: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
    terytCode?: string;

    @Column({ type: "varchar", name: "commune_code", length: 8, nullable: true })
    communeCode?: string;

    @Column({ type: "varchar", name: "commune_type", length: 4, nullable: true })
    communeType?: string;

    @Column({ type: "boolean", name: "is_managed", default: false })
    isManaged!: boolean;

    @Column({ type: "boolean", name: "is_default", default: false })
    isDefault!: boolean;

    @Column({ type: "boolean", name: "is_active", default: false })
    isActive!: boolean;

    @ManyToOne(() => LocationDistrict, (district) => district.cities, { onDelete: "CASCADE" })
    @JoinColumn({ name: "district_id" })
    district!: LocationDistrict;

    @ManyToOne(() => LocationCommune, (commune) => commune.cities, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "commune_id" })
    commune?: LocationCommune | null;

    @OneToMany(() => LocationStreet, (street) => street.city)
    streets!: LocationStreet[];
}

@Entity("location_streets")
export class LocationStreet {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "city_id" })
    cityId!: number;

    @Column({ type: "integer", name: "commune_id", nullable: true })
    communeId?: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", name: "teryt_code", length: 16, nullable: true })
    terytCode?: string;

    @ManyToOne(() => LocationCity, (city) => city.streets, { onDelete: "CASCADE" })
    @JoinColumn({ name: "city_id" })
    city!: LocationCity;

    @ManyToOne(() => LocationCommune, (commune) => commune.streets, { onDelete: "SET NULL", nullable: true })
    @JoinColumn({ name: "commune_id" })
    commune?: LocationCommune | null;
}
