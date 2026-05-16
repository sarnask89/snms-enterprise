import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
    OneToOne,
} from "typeorm";
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

    @OneToOne(() => NetworkDeviceAccessProfile, (profile) => profile.netDevice)
    accessProfile?: NetworkDeviceAccessProfile | null;

    @OneToMany(() => NetworkDiscoverySession, (session) => session.netDevice)
    discoverySessions!: NetworkDiscoverySession[];
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

    @Column({ type: "varchar", name: "remote_vendor", length: 64, nullable: true })
    remoteVendor?: string;

    @Column({ type: "varchar", name: "remote_serial_number", length: 128, nullable: true })
    remoteSerialNumber?: string;

    @Column({ type: "integer", name: "remote_olt", nullable: true })
    remoteOlt?: number;

    @Column({ type: "integer", name: "remote_onu", nullable: true })
    remoteOnu?: number;

    @Column({ type: "varchar", name: "remote_port", length: 64, nullable: true })
    remotePort?: string;

    @Column({ type: "varchar", name: "remote_profile_name", length: 128, nullable: true })
    remoteProfileName?: string;

    @Column({ type: "real", name: "remote_rx_power_dbm", nullable: true })
    remoteRxPowerDbm?: number;

    @Column({ type: "varchar", name: "installation_state", length: 128, nullable: true })
    installationState?: string;

    @Column({ type: "varchar", name: "installation_county", length: 128, nullable: true })
    installationCounty?: string;

    @Column({ type: "varchar", name: "installation_city", length: 128, nullable: true })
    installationCity?: string;

    @Column({ type: "varchar", name: "installation_street", length: 255, nullable: true })
    installationStreet?: string;

    @Column({ type: "varchar", name: "installation_street_number", length: 32, nullable: true })
    installationStreetNumber?: string;

    @Column({ type: "varchar", name: "installation_apartment_number", length: 32, nullable: true })
    installationApartmentNumber?: string;

    @Column({ type: "varchar", name: "installation_postal_code", length: 32, nullable: true })
    installationPostalCode?: string;

    @Column({ type: "varchar", name: "installation_country", length: 128, nullable: true })
    installationCountry?: string;

    @Column({ type: "varchar", name: "location_description", length: 255, nullable: true })
    locationDescription?: string;

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

@Entity("network_device_access_profiles")
export class NetworkDeviceAccessProfile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "net_device_id", unique: true })
    netDeviceId!: number;

    @Column({ type: "varchar", length: 64 })
    driver!: string;

    @Column({ type: "varchar", length: 255 })
    host!: string;

    @Column({ type: "integer", nullable: true })
    port?: number;

    @Column({ type: "varchar", length: 128 })
    username!: string;

    @Column({ type: "text", name: "password_ciphertext" })
    passwordCiphertext!: string;

    @Column({ type: "text", name: "enable_password_ciphertext", nullable: true })
    enablePasswordCiphertext?: string;

    @Column({ type: "text", name: "metadata_json", nullable: true })
    metadataJson?: string;

    @Column({ type: "datetime", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @Column({ type: "datetime", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
    updatedAt!: Date;

    @ManyToOne(() => NetDevice, (netDevice) => netDevice.accessProfile, { onDelete: "CASCADE" })
    @JoinColumn({ name: "net_device_id" })
    netDevice!: NetDevice;
}

@Entity("network_discovery_sessions")
export class NetworkDiscoverySession {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "net_device_id" })
    netDeviceId!: number;

    @Column({ type: "integer", name: "access_profile_id", nullable: true })
    accessProfileId?: number;

    @Column({ type: "varchar", length: 64 })
    driver!: string;

    @Column({ type: "varchar", length: 32, default: "running" })
    status!: string;

    @Column({ type: "text", nullable: true })
    summary?: string;

    @Column({ type: "text", name: "error_message", nullable: true })
    errorMessage?: string;

    @Column({ type: "datetime", name: "started_at", default: () => "CURRENT_TIMESTAMP" })
    startedAt!: Date;

    @Column({ type: "datetime", name: "finished_at", nullable: true })
    finishedAt?: Date;

    @ManyToOne(() => NetDevice, (netDevice) => netDevice.discoverySessions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "net_device_id" })
    netDevice!: NetDevice;

    @ManyToOne(() => NetworkDeviceAccessProfile, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "access_profile_id" })
    accessProfile?: NetworkDeviceAccessProfile | null;

    @OneToMany(() => NetworkDiscoveryRecord, (record) => record.session)
    records!: NetworkDiscoveryRecord[];
}

@Entity("network_discovery_records")
export class NetworkDiscoveryRecord {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "integer", name: "session_id" })
    sessionId!: number;

    @Column({ type: "integer", name: "net_device_id" })
    netDeviceId!: number;

    @Column({ type: "varchar", name: "record_kind", length: 64 })
    recordKind!: string;

    @Column({ type: "varchar", name: "external_key", length: 255, nullable: true })
    externalKey?: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    hostname?: string;

    @Column({ type: "varchar", name: "ip_address", length: 64, nullable: true })
    ipAddress?: string;

    @Column({ type: "varchar", name: "mac_address", length: 32, nullable: true })
    macAddress?: string;

    @Column({ type: "varchar", name: "serial_number", length: 128, nullable: true })
    serialNumber?: string;

    @Column({ type: "varchar", name: "record_status", length: 64, nullable: true })
    recordStatus?: string;

    @Column({ type: "varchar", name: "profile_name", length: 128, nullable: true })
    profileName?: string;

    @Column({ type: "text", name: "fail_reason", nullable: true })
    failReason?: string;

    @Column({ type: "varchar", name: "remote_port", length: 64, nullable: true })
    remotePort?: string;

    @Column({ type: "integer", name: "remote_vlan_id", nullable: true })
    remoteVlanId?: number;

    @Column({ type: "integer", name: "remote_olt", nullable: true })
    remoteOlt?: number;

    @Column({ type: "integer", name: "remote_onu", nullable: true })
    remoteOnu?: number;

    @Column({ type: "integer", name: "distance_meters", nullable: true })
    distanceMeters?: number;

    @Column({ type: "real", name: "rx_power_dbm", nullable: true })
    rxPowerDbm?: number;

    @Column({ type: "text", name: "payload_json", nullable: true })
    payloadJson?: string;

    @Column({ type: "datetime", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
    createdAt!: Date;

    @ManyToOne(() => NetworkDiscoverySession, (session) => session.records, { onDelete: "CASCADE" })
    @JoinColumn({ name: "session_id" })
    session!: NetworkDiscoverySession;

    @ManyToOne(() => NetDevice, { onDelete: "CASCADE" })
    @JoinColumn({ name: "net_device_id" })
    netDevice!: NetDevice;
}
