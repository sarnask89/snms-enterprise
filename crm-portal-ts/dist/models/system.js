var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./common.js";
let AppSetting = class AppSetting {
    id;
    key;
    value;
};
__decorate([
    PrimaryGeneratedColumn()
], AppSetting.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128, unique: true })
], AppSetting.prototype, "key", void 0);
__decorate([
    Column({ type: "text" })
], AppSetting.prototype, "value", void 0);
AppSetting = __decorate([
    Entity("app_settings")
], AppSetting);
export { AppSetting };
let PortalUser = class PortalUser {
    id;
    username;
    passwordHash;
    role;
    active;
};
__decorate([
    PrimaryGeneratedColumn()
], PortalUser.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 64, unique: true })
], PortalUser.prototype, "username", void 0);
__decorate([
    Column({ type: "varchar", name: "password_hash", length: 255 })
], PortalUser.prototype, "passwordHash", void 0);
__decorate([
    Column({
        type: "simple-enum",
        enum: UserRole,
        default: UserRole.view,
    })
], PortalUser.prototype, "role", void 0);
__decorate([
    Column({ type: "boolean", default: true })
], PortalUser.prototype, "active", void 0);
PortalUser = __decorate([
    Entity("portal_users")
], PortalUser);
export { PortalUser };
let AuditLog = class AuditLog {
    id;
    timestamp;
    actorId;
    action;
    resourceType;
    resourceId;
    details;
    ipAddress;
    actor;
};
__decorate([
    PrimaryGeneratedColumn()
], AuditLog.prototype, "id", void 0);
__decorate([
    CreateDateColumn({ name: "timestamp", type: "datetime" })
], AuditLog.prototype, "timestamp", void 0);
__decorate([
    Column({ type: "integer", name: "actor_id", nullable: true })
], AuditLog.prototype, "actorId", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], AuditLog.prototype, "action", void 0);
__decorate([
    Column({ type: "varchar", name: "resource_type", length: 128, nullable: true })
], AuditLog.prototype, "resourceType", void 0);
__decorate([
    Column({ type: "integer", name: "resource_id", nullable: true })
], AuditLog.prototype, "resourceId", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], AuditLog.prototype, "details", void 0);
__decorate([
    Column({ type: "varchar", name: "ip_address", length: 45, nullable: true })
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    ManyToOne(() => PortalUser, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "actor_id" })
], AuditLog.prototype, "actor", void 0);
AuditLog = __decorate([
    Entity("audit_logs")
], AuditLog);
export { AuditLog };
let BackupExport = class BackupExport {
    id;
    label;
    notes;
    createdAt;
    createdById;
};
__decorate([
    PrimaryGeneratedColumn()
], BackupExport.prototype, "id", void 0);
__decorate([
    Column({ type: "varchar", length: 128 })
], BackupExport.prototype, "label", void 0);
__decorate([
    Column({ type: "text" })
], BackupExport.prototype, "notes", void 0);
__decorate([
    CreateDateColumn({ name: "created_at", type: "datetime" })
], BackupExport.prototype, "createdAt", void 0);
__decorate([
    Column({ type: "integer", name: "created_by_id", nullable: true })
], BackupExport.prototype, "createdById", void 0);
BackupExport = __decorate([
    Entity("backup_exports")
], BackupExport);
export { BackupExport };
let ConfigReloadLog = class ConfigReloadLog {
    id;
    createdAt;
    actorId;
    note;
    actor;
};
__decorate([
    PrimaryGeneratedColumn()
], ConfigReloadLog.prototype, "id", void 0);
__decorate([
    CreateDateColumn({ name: "created_at", type: "datetime" })
], ConfigReloadLog.prototype, "createdAt", void 0);
__decorate([
    Column({ type: "integer", name: "actor_id", nullable: true })
], ConfigReloadLog.prototype, "actorId", void 0);
__decorate([
    Column({ type: "text", nullable: true })
], ConfigReloadLog.prototype, "note", void 0);
__decorate([
    ManyToOne(() => PortalUser, { nullable: true, onDelete: "SET NULL" }),
    JoinColumn({ name: "actor_id" })
], ConfigReloadLog.prototype, "actor", void 0);
ConfigReloadLog = __decorate([
    Entity("config_reload_logs")
], ConfigReloadLog);
export { ConfigReloadLog };
//# sourceMappingURL=system.js.map