var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, } from "typeorm";
import { Customer } from "./customer.js";
import { CustomerDeviceStatus, NetDeviceStatus, NetNodeLocationType } from "./common.js";
let NetNode = class NetNode {
    id;
    name;
    locationDetail;
    locationType;
    nodeType;
    ownerType;
    latitude;
    longitude;
    x1992;
    y1992;
    hasPower;
    hasEnvControl;
    info;
    devices;
};
__decorate([
    PrimaryGeneratedColumn()
], NetNode.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], NetNode.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", name: "location_detail", length: 255, nullable: true })
], NetNode.prototype, "locationDetail", void 0);
__decorate([
    Column({
        type: "simple-enum",
        name: "location_type",
        enum: NetNodeLocationType,
        default: NetNodeLocationType.other,
    })
], NetNode.prototype, "locationType", void 0);
__decorate([
    Column({ type: "varchar", name: "node_type", length: 64, nullable: true })
], NetNode.prototype, "nodeType", void 0);
__decorate([
    Column({ type: "varchar", name: "owner_type", length: 64, nullable: true })
], NetNode.prototype, "ownerType", void 0);
__decorate([
    Column({ type: "real", nullable: true })
], NetNode.prototype, "latitude", void 0);
__decorate([
    Column({ type: "real", nullable: true })
], NetNode.prototype, "longitude", void 0);
__decorate([
    Column({ type: "real", name: "x_1992", nullable: true })
], NetNode.prototype, "x1992", void 0);
__decorate([
    Column({ type: "real", name: "y_1992", nullable: true })
], NetNode.prototype, "y1992", void 0);
__decorate([
    Column({ type: "boolean", name: "has_power", default: false })
], NetNode.prototype, "hasPower", void 0);
__decorate([
    Column({ type: "boolean", name: "has_env_control", default: false })
], NetNode.prototype, "hasEnvControl", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], NetNode.prototype, "info", void 0);
__decorate([
    OneToMany(() => NetDevice, (device) => device.netNode)
], NetNode.prototype, "devices", void 0);
NetNode = __decorate([
    Entity("net_nodes")
], NetNode);
export { NetNode };
let IpNetwork = class IpNetwork {
    id;
    name;
    cidr;
    gateway;
    vlanId;
    description;
    active;
    netDevices;
    customerDevices;
};
__decorate([
    PrimaryGeneratedColumn()
], IpNetwork.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], IpNetwork.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", length: 64 })
], IpNetwork.prototype, "cidr", void 0);
__decorate([
    Column({ type: "varchar", length: 64, nullable: true })
], IpNetwork.prototype, "gateway", void 0);
__decorate([
    Column({ type: "integer", name: "vlan_id", nullable: true })
], IpNetwork.prototype, "vlanId", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], IpNetwork.prototype, "description", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], IpNetwork.prototype, "active", void 0);
__decorate([
    OneToMany(() => NetDevice, (device) => device.ipNetwork)
], IpNetwork.prototype, "netDevices", void 0);
__decorate([
    OneToMany(() => CustomerDevice, (device) => device.ipNetwork)
], IpNetwork.prototype, "customerDevices", void 0);
IpNetwork = __decorate([
    Entity("ip_networks")
], IpNetwork);
export { IpNetwork };
let NetDevice = class NetDevice {
    id;
    name;
    hostname;
    serialNumber;
    macAddress;
    managementIp;
    snmpCommunity;
    loginUrl;
    driverType;
    mgmtUsername;
    deviceType;
    status;
    ipNetworkId;
    netNodeId;
    customerId;
    notes;
    ipNetwork;
    netNode;
    customer;
    accessProfile;
    discoverySessions;
};
__decorate([
    PrimaryGeneratedColumn()
], NetDevice.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], NetDevice.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", length: 255, nullable: true })
], NetDevice.prototype, "hostname", void 0);
__decorate([
    Column({ type: "varchar", name: "serial_number", length: 128, nullable: true })
], NetDevice.prototype, "serialNumber", void 0);
__decorate([
    Column({ type: "varchar", name: "mac_address", length: 32, nullable: true })
], NetDevice.prototype, "macAddress", void 0);
__decorate([
    Column({ type: "varchar", name: "management_ip", length: 64, nullable: true })
], NetDevice.prototype, "managementIp", void 0);
__decorate([
    Column({ type: "varchar", name: "snmp_community", length: 128, nullable: true })
], NetDevice.prototype, "snmpCommunity", void 0);
__decorate([
    Column({ type: "varchar", name: "login_url", length: 255, nullable: true })
], NetDevice.prototype, "loginUrl", void 0);
__decorate([
    Column({ type: "varchar", name: "driver_type", length: 64, nullable: true })
], NetDevice.prototype, "driverType", void 0);
__decorate([
    Column({ type: "varchar", name: "mgmt_username", length: 128, nullable: true })
], NetDevice.prototype, "mgmtUsername", void 0);
__decorate([
    Column({ type: "varchar", name: "device_type", length: 64, default: "other" })
], NetDevice.prototype, "deviceType", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: NetDeviceStatus,
        default: NetDeviceStatus.active,
    })
], NetDevice.prototype, "status", void 0);
__decorate([
    Column({ type: "integer", name: "ip_network_id", nullable: true })
], NetDevice.prototype, "ipNetworkId", void 0);
__decorate([
    Column({ type: "integer", name: "net_node_id", nullable: true })
], NetDevice.prototype, "netNodeId", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id", nullable: true })
], NetDevice.prototype, "customerId", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], NetDevice.prototype, "notes", void 0);
__decorate([
    ManyToOne(() => IpNetwork, (network) => network.netDevices, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "ip_network_id" })
], NetDevice.prototype, "ipNetwork", void 0);
__decorate([
    ManyToOne(() => NetNode, (node) => node.devices, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "net_node_id" })
], NetDevice.prototype, "netNode", void 0);
__decorate([
    ManyToOne(() => Customer, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "customer_id" })
], NetDevice.prototype, "customer", void 0);
__decorate([
    OneToOne(() => NetworkDeviceAccessProfile, (profile) => profile.netDevice)
], NetDevice.prototype, "accessProfile", void 0);
__decorate([
    OneToMany(() => NetworkDiscoverySession, (session) => session.netDevice)
], NetDevice.prototype, "discoverySessions", void 0);
NetDevice = __decorate([
    Entity("net_devices")
], NetDevice);
export { NetDevice };
let CustomerDevice = class CustomerDevice {
    id;
    customerId;
    name;
    hostname;
    deviceType;
    login;
    passwd;
    ipAddress;
    macAddress;
    status;
    notes;
    netDeviceId;
    ipNetworkId;
    remoteVendor;
    remoteSerialNumber;
    remoteOlt;
    remoteOnu;
    remotePort;
    remoteProfileName;
    remoteRxPowerDbm;
    installationStateId;
    installationDistrictId;
    installationCommuneId;
    installationCityId;
    installationStreetId;
    installationState;
    installationCounty;
    installationCity;
    installationStreet;
    installationStreetNumber;
    installationApartmentNumber;
    installationPostalCode;
    installationCountry;
    locationDescription;
    customer;
    netDevice;
    ipNetwork;
};
__decorate([
    PrimaryGeneratedColumn()
], CustomerDevice.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "customer_id" })
], CustomerDevice.prototype, "customerId", void 0);
__decorate([
    Column({ type: "varchar", length: 128, nullable: true })
], CustomerDevice.prototype, "name", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], CustomerDevice.prototype, "hostname", void 0);
__decorate([
    Column({ type: "varchar", name: "device_type", length: 64, nullable: true })
], CustomerDevice.prototype, "deviceType", void 0);
__decorate([
    Column({ type: "varchar", length: 64, nullable: true })
], CustomerDevice.prototype, "login", void 0);
__decorate([
    Column({ type: "varchar", length: 64, nullable: true })
], CustomerDevice.prototype, "passwd", void 0);
__decorate([
    Column({ type: "varchar", name: "ip_address", length: 64, nullable: true })
], CustomerDevice.prototype, "ipAddress", void 0);
__decorate([
    Column({ type: "varchar", name: "mac_address", length: 32, nullable: true })
], CustomerDevice.prototype, "macAddress", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: CustomerDeviceStatus,
        default: CustomerDeviceStatus.active
    })
], CustomerDevice.prototype, "status", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], CustomerDevice.prototype, "notes", void 0);
__decorate([
    Column({ type: "integer", name: "net_device_id", nullable: true })
], CustomerDevice.prototype, "netDeviceId", void 0);
__decorate([
    Column({ type: "integer", name: "ip_network_id", nullable: true })
], CustomerDevice.prototype, "ipNetworkId", void 0);
__decorate([
    Column({ type: "varchar", name: "remote_vendor", length: 64, nullable: true })
], CustomerDevice.prototype, "remoteVendor", void 0);
__decorate([
    Column({ type: "varchar", name: "remote_serial_number", length: 128, nullable: true })
], CustomerDevice.prototype, "remoteSerialNumber", void 0);
__decorate([
    Column({ type: "integer", name: "remote_olt", nullable: true })
], CustomerDevice.prototype, "remoteOlt", void 0);
__decorate([
    Column({ type: "integer", name: "remote_onu", nullable: true })
], CustomerDevice.prototype, "remoteOnu", void 0);
__decorate([
    Column({ type: "varchar", name: "remote_port", length: 64, nullable: true })
], CustomerDevice.prototype, "remotePort", void 0);
__decorate([
    Column({ type: "varchar", name: "remote_profile_name", length: 128, nullable: true })
], CustomerDevice.prototype, "remoteProfileName", void 0);
__decorate([
    Column({ type: "real", name: "remote_rx_power_dbm", nullable: true })
], CustomerDevice.prototype, "remoteRxPowerDbm", void 0);
__decorate([
    Column({ type: "integer", name: "installation_state_id", nullable: true })
], CustomerDevice.prototype, "installationStateId", void 0);
__decorate([
    Column({ type: "integer", name: "installation_district_id", nullable: true })
], CustomerDevice.prototype, "installationDistrictId", void 0);
__decorate([
    Column({ type: "integer", name: "installation_commune_id", nullable: true })
], CustomerDevice.prototype, "installationCommuneId", void 0);
__decorate([
    Column({ type: "integer", name: "installation_city_id", nullable: true })
], CustomerDevice.prototype, "installationCityId", void 0);
__decorate([
    Column({ type: "integer", name: "installation_street_id", nullable: true })
], CustomerDevice.prototype, "installationStreetId", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_state", length: 128, nullable: true })
], CustomerDevice.prototype, "installationState", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_county", length: 128, nullable: true })
], CustomerDevice.prototype, "installationCounty", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_city", length: 128, nullable: true })
], CustomerDevice.prototype, "installationCity", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_street", length: 255, nullable: true })
], CustomerDevice.prototype, "installationStreet", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_street_number", length: 32, nullable: true })
], CustomerDevice.prototype, "installationStreetNumber", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_apartment_number", length: 32, nullable: true })
], CustomerDevice.prototype, "installationApartmentNumber", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_postal_code", length: 32, nullable: true })
], CustomerDevice.prototype, "installationPostalCode", void 0);
__decorate([
    Column({ type: "varchar", name: "installation_country", length: 128, nullable: true })
], CustomerDevice.prototype, "installationCountry", void 0);
__decorate([
    Column({ type: "varchar", name: "location_description", length: 255, nullable: true })
], CustomerDevice.prototype, "locationDescription", void 0);
__decorate([
    ManyToOne(() => Customer, (customer) => customer.devices),
    JoinColumn({ name: "customer_id" })
], CustomerDevice.prototype, "customer", void 0);
__decorate([
    ManyToOne(() => NetDevice, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "net_device_id" })
], CustomerDevice.prototype, "netDevice", void 0);
__decorate([
    ManyToOne(() => IpNetwork, (network) => network.customerDevices, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "ip_network_id" })
], CustomerDevice.prototype, "ipNetwork", void 0);
CustomerDevice = __decorate([
    Entity("customer_devices")
], CustomerDevice);
export { CustomerDevice };
let NetworkDeviceAccessProfile = class NetworkDeviceAccessProfile {
    id;
    netDeviceId;
    driver;
    host;
    port;
    username;
    passwordCiphertext;
    enablePasswordCiphertext;
    metadataJson;
    createdAt;
    updatedAt;
    netDevice;
};
__decorate([
    PrimaryGeneratedColumn()
], NetworkDeviceAccessProfile.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "net_device_id", unique: true })
], NetworkDeviceAccessProfile.prototype, "netDeviceId", void 0);
__decorate([
    Column({ type: "varchar", length: 64 })
], NetworkDeviceAccessProfile.prototype, "driver", void 0);
__decorate([
    Column({ type: "varchar", length: 255 })
], NetworkDeviceAccessProfile.prototype, "host", void 0);
__decorate([
    Column({ type: "integer", nullable: true })
], NetworkDeviceAccessProfile.prototype, "port", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], NetworkDeviceAccessProfile.prototype, "username", void 0);
__decorate([
    Column({ type: "text", name: "password_ciphertext" })
], NetworkDeviceAccessProfile.prototype, "passwordCiphertext", void 0);
__decorate([
    Column({ type: "text", name: "enable_password_ciphertext", nullable: true })
], NetworkDeviceAccessProfile.prototype, "enablePasswordCiphertext", void 0);
__decorate([
    Column({ type: "text", name: "metadata_json", nullable: true })
], NetworkDeviceAccessProfile.prototype, "metadataJson", void 0);
__decorate([
    Column({ type: "datetime", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
], NetworkDeviceAccessProfile.prototype, "createdAt", void 0);
__decorate([
    Column({ type: "datetime", name: "updated_at", default: () => "CURRENT_TIMESTAMP" })
], NetworkDeviceAccessProfile.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => NetDevice, (netDevice) => netDevice.accessProfile, { onDelete: "CASCADE" }),
    JoinColumn({ name: "net_device_id" })
], NetworkDeviceAccessProfile.prototype, "netDevice", void 0);
NetworkDeviceAccessProfile = __decorate([
    Entity("network_device_access_profiles")
], NetworkDeviceAccessProfile);
export { NetworkDeviceAccessProfile };
let NetworkDiscoverySession = class NetworkDiscoverySession {
    id;
    netDeviceId;
    accessProfileId;
    driver;
    status;
    summary;
    errorMessage;
    startedAt;
    finishedAt;
    netDevice;
    accessProfile;
    records;
};
__decorate([
    PrimaryGeneratedColumn()
], NetworkDiscoverySession.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "net_device_id" })
], NetworkDiscoverySession.prototype, "netDeviceId", void 0);
__decorate([
    Column({ type: "integer", name: "access_profile_id", nullable: true })
], NetworkDiscoverySession.prototype, "accessProfileId", void 0);
__decorate([
    Column({ type: "varchar", length: 64 })
], NetworkDiscoverySession.prototype, "driver", void 0);
__decorate([
    Column({ type: "varchar", length: 32, default: "running" })
], NetworkDiscoverySession.prototype, "status", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], NetworkDiscoverySession.prototype, "summary", void 0);
__decorate([
    Column({ type: "text", name: "error_message", nullable: true })
], NetworkDiscoverySession.prototype, "errorMessage", void 0);
__decorate([
    Column({ type: "datetime", name: "started_at", default: () => "CURRENT_TIMESTAMP" })
], NetworkDiscoverySession.prototype, "startedAt", void 0);
__decorate([
    Column({ type: "datetime", name: "finished_at", nullable: true })
], NetworkDiscoverySession.prototype, "finishedAt", void 0);
__decorate([
    ManyToOne(() => NetDevice, (netDevice) => netDevice.discoverySessions, { onDelete: "CASCADE" }),
    JoinColumn({ name: "net_device_id" })
], NetworkDiscoverySession.prototype, "netDevice", void 0);
__decorate([
    ManyToOne(() => NetworkDeviceAccessProfile, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "access_profile_id" })
], NetworkDiscoverySession.prototype, "accessProfile", void 0);
__decorate([
    OneToMany(() => NetworkDiscoveryRecord, (record) => record.session)
], NetworkDiscoverySession.prototype, "records", void 0);
NetworkDiscoverySession = __decorate([
    Entity("network_discovery_sessions")
], NetworkDiscoverySession);
export { NetworkDiscoverySession };
let NetworkDiscoveryRecord = class NetworkDiscoveryRecord {
    id;
    sessionId;
    netDeviceId;
    recordKind;
    externalKey;
    hostname;
    ipAddress;
    macAddress;
    serialNumber;
    recordStatus;
    profileName;
    failReason;
    remotePort;
    remoteVlanId;
    remoteOlt;
    remoteOnu;
    distanceMeters;
    rxPowerDbm;
    payloadJson;
    createdAt;
    session;
    netDevice;
};
__decorate([
    PrimaryGeneratedColumn()
], NetworkDiscoveryRecord.prototype, "id", void 0);
__decorate([
    Column({ type: "integer", name: "session_id" })
], NetworkDiscoveryRecord.prototype, "sessionId", void 0);
__decorate([
    Column({ type: "integer", name: "net_device_id" })
], NetworkDiscoveryRecord.prototype, "netDeviceId", void 0);
__decorate([
    Column({ type: "varchar", name: "record_kind", length: 64 })
], NetworkDiscoveryRecord.prototype, "recordKind", void 0);
__decorate([
    Column({ type: "varchar", name: "external_key", length: 255, nullable: true })
], NetworkDiscoveryRecord.prototype, "externalKey", void 0);
__decorate([
    Column({ type: "varchar", length: 255, nullable: true })
], NetworkDiscoveryRecord.prototype, "hostname", void 0);
__decorate([
    Column({ type: "varchar", name: "ip_address", length: 64, nullable: true })
], NetworkDiscoveryRecord.prototype, "ipAddress", void 0);
__decorate([
    Column({ type: "varchar", name: "mac_address", length: 32, nullable: true })
], NetworkDiscoveryRecord.prototype, "macAddress", void 0);
__decorate([
    Column({ type: "varchar", name: "serial_number", length: 128, nullable: true })
], NetworkDiscoveryRecord.prototype, "serialNumber", void 0);
__decorate([
    Column({ type: "varchar", name: "record_status", length: 64, nullable: true })
], NetworkDiscoveryRecord.prototype, "recordStatus", void 0);
__decorate([
    Column({ type: "varchar", name: "profile_name", length: 128, nullable: true })
], NetworkDiscoveryRecord.prototype, "profileName", void 0);
__decorate([
    Column({ type: "text", name: "fail_reason", nullable: true })
], NetworkDiscoveryRecord.prototype, "failReason", void 0);
__decorate([
    Column({ type: "varchar", name: "remote_port", length: 64, nullable: true })
], NetworkDiscoveryRecord.prototype, "remotePort", void 0);
__decorate([
    Column({ type: "integer", name: "remote_vlan_id", nullable: true })
], NetworkDiscoveryRecord.prototype, "remoteVlanId", void 0);
__decorate([
    Column({ type: "integer", name: "remote_olt", nullable: true })
], NetworkDiscoveryRecord.prototype, "remoteOlt", void 0);
__decorate([
    Column({ type: "integer", name: "remote_onu", nullable: true })
], NetworkDiscoveryRecord.prototype, "remoteOnu", void 0);
__decorate([
    Column({ type: "integer", name: "distance_meters", nullable: true })
], NetworkDiscoveryRecord.prototype, "distanceMeters", void 0);
__decorate([
    Column({ type: "real", name: "rx_power_dbm", nullable: true })
], NetworkDiscoveryRecord.prototype, "rxPowerDbm", void 0);
__decorate([
    Column({ type: "text", name: "payload_json", nullable: true })
], NetworkDiscoveryRecord.prototype, "payloadJson", void 0);
__decorate([
    Column({ type: "datetime", name: "created_at", default: () => "CURRENT_TIMESTAMP" })
], NetworkDiscoveryRecord.prototype, "createdAt", void 0);
__decorate([
    ManyToOne(() => NetworkDiscoverySession, (session) => session.records, { onDelete: "CASCADE" }),
    JoinColumn({ name: "session_id" })
], NetworkDiscoveryRecord.prototype, "session", void 0);
__decorate([
    ManyToOne(() => NetDevice, { onDelete: "CASCADE" }),
    JoinColumn({ name: "net_device_id" })
], NetworkDiscoveryRecord.prototype, "netDevice", void 0);
NetworkDiscoveryRecord = __decorate([
    Entity("network_discovery_records")
], NetworkDiscoveryRecord);
export { NetworkDiscoveryRecord };
//# sourceMappingURL=network.js.map