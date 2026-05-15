import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Customer } from "./customer.js";
import { CustomerDeviceStatus, NetDeviceStatus, NetNodeLocationType } from "./common.js";

@Entity("net_nodes")
export class NetNode {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255 })
    name!: string;

    @Column({ type: "varchar", name: "location_detail", length: 255, nullable: true })
    locationDetail?: string;

    @Column({
        type: "simple-enum",
        name: "location_type",
        enum: NetNodeLocationType,
        default: NetNodeLocationType.other,
    })
    locationType!: NetNodeLocationType;

    @Column({ type: "varchar", name: "node_type", length: 64, nullable: true })
    nodeType?: string;

    @Column({ type: "varchar", name: "owner_type", length: 64, nullable: true })
    ownerType?: string;

    @Column({ type: "real", nullable: true })
    latitude?: number;

    @Column({ type: "real", nullable: true })
    longitude?: number;

    @Column({ type: "real", name: "x_1992", nullable: true })
    x1992?: number;

    @Column({ type: "real", name: "y_1992", nullable: true })
    y1992?: number;

    @Column({ type: "boolean", name: "has_power", default: false })
    hasPower!: boolean;

    @Column({ type: "boolean", name: "has_env_control", default: false })
    hasEnvControl!: boolean;

    @Column({ type: "text", nullable: true })
    info?: string;

    @OneToMany(() => NetDevice, (device) => device.netNode)
    devices!: NetDevice[];
}

@Entity("ip_networks")
export class IpNetwork {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", length: 64 })
    cidr!: string;

    @Column({ type: "varchar", length: 64, nullable: true })
    gateway?: string;

    @Column({ type: "integer", name: "vlan_id", nullable: true })
    vlanId?: number;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "boolean", default: true })
    active!: boolean;

    @OneToMany(() => NetDevice, (device) => device.ipNetwork)
    netDevices!: NetDevice[];

    @OneToMany(() => CustomerDevice, (device) => device.ipNetwork)
    customerDevices!: CustomerDevice[];
}

@Entity("net_devices")
export class NetDevice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    name!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    hostname?: string;

    @Column({ type: "varchar", name: "serial_number", length: 128, nullable: true })
    serialNumber?: string;

    @Column({ type: "varchar", name: "mac_address", length: 32, nullable: true })
    macAddress?: string;

    @Column({ type: "varchar", name: "management_ip", length: 64, nullable: true })
    managementIp?: string;

    @Column({ type: "varchar", name: "device_type", length: 64, default: "other" })
    deviceType!: string;

    @Column({
        type: "simple-enum",
        enum: NetDeviceStatus,
        default: NetDeviceStatus.active,
    })
    status!: NetDeviceStatus;

    @Column({ type: "integer", name: "ip_network_id", nullable: true })
    ipNetworkId?: number;

    @Column({ type: "integer", name: "net_node_id", nullable: true })
    netNodeId?: number;

    @Column({ type: "integer", name: "customer_id", nullable: true })
    customerId?: number;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @ManyToOne(() => IpNetwork, (network) => network.netDevices, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "ip_network_id" })
    ipNetwork?: IpNetwork | null;

    @ManyToOne(() => NetNode, (node) => node.devices, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "net_node_id" })
    netNode?: NetNode | null;

    @ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "customer_id" })
    customer?: Customer | null;
}

@Entity("customer_devices")
export class CustomerDevice {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "customer_id" })
    customerId!: number;

    @Column({ type: "varchar", length: 128, nullable: true })
    name?: string;

    @Column({ type: "varchar", length: 255 })
    hostname!: string;

    @Column({ type: "varchar", length: 64, nullable: true })
    login?: string;

    @Column({ type: "varchar", length: 64, nullable: true })
    passwd?: string;

    @Column({ type: "varchar", name: "ip_address", length: 64, nullable: true })
    ipAddress?: string;

    @Column({ type: "varchar", name: "mac_address", length: 32, nullable: true })
    macAddress?: string;

    @Column({
        type: "simple-enum",
        enum: CustomerDeviceStatus,
        default: CustomerDeviceStatus.active
    })
    status!: CustomerDeviceStatus;

    @Column({ type: "text", nullable: true })
    notes?: string;

    @Column({ type: "integer", name: "net_device_id", nullable: true })
    netDeviceId?: number;

    @Column({ type: "integer", name: "ip_network_id", nullable: true })
    ipNetworkId?: number;

    @ManyToOne(() => Customer, (customer) => customer.devices)
    @JoinColumn({ name: "customer_id" })
    customer!: Customer;

    @ManyToOne(() => NetDevice, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "net_device_id" })
    netDevice?: NetDevice | null;

    @ManyToOne(() => IpNetwork, (network) => network.customerDevices, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "ip_network_id" })
    ipNetwork?: IpNetwork | null;
}
