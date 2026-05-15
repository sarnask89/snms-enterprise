import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./common.js";

@Entity("app_settings")
export class AppSetting {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128, unique: true })
    key!: string;

    @Column({ type: "text" })
    value!: string;
}

@Entity("portal_users")
export class PortalUser {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 64, unique: true })
    username!: string;

    @Column({ type: "varchar", name: "password_hash", length: 255 })
    passwordHash!: string;

    @Column({
        type: "simple-enum",
        enum: UserRole,
        default: UserRole.view,
    })
    role!: UserRole;

    @Column({ type: "boolean", default: true })
    active!: boolean;
}

@Entity("audit_logs")
export class AuditLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: "timestamp", type: "datetime" })
    timestamp!: Date;

    @Column({ type: "integer", name: "actor_id", nullable: true })
    actorId?: number;

    @Column({ type: "varchar", length: 128 })
    action!: string;

    @Column({ type: "varchar", name: "resource_type", length: 128, nullable: true })
    resourceType?: string;

    @Column({ type: "integer", name: "resource_id", nullable: true })
    resourceId?: number;

    @Column({ type: "text", nullable: true })
    details?: string;

    @Column({ type: "varchar", name: "ip_address", length: 45, nullable: true })
    ipAddress?: string;

    @ManyToOne(() => PortalUser, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "actor_id" })
    actor?: PortalUser | null;
}

@Entity("backup_exports")
export class BackupExport {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 128 })
    label!: string;

    @Column({ type: "text" })
    notes!: string;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @Column({ type: "integer", name: "created_by_id", nullable: true })
    createdById?: number;
}

@Entity("config_reload_logs")
export class ConfigReloadLog {
    @PrimaryGeneratedColumn()
    id!: number;

    @CreateDateColumn({ name: "created_at", type: "datetime" })
    createdAt!: Date;

    @Column({ type: "integer", name: "actor_id", nullable: true })
    actorId?: number;

    @Column({ type: "text", nullable: true })
    note?: string;

    @ManyToOne(() => PortalUser, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "actor_id" })
    actor?: PortalUser | null;
}
