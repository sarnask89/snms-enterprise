import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { CustomerStatus, TicketStatus } from './models';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  customer_code: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'text', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  phone: string | null;

  @Column({ enum: CustomerStatus, default: CustomerStatus.active })
  status: CustomerStatus;

  @Column({ type: 'int', nullable: true })
  location_state_id: number | null;

  @Column({ type: 'int', nullable: true })
  location_district_id: number | null;

  @Column({ type: 'int', nullable: true })
  location_city_id: number | null;

  @Column({ type: 'int', nullable: true })
  location_street_id: number | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  street_number: string | null;

  constructor() {
    super();
  }
}

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ enum: TicketStatus, default: TicketStatus.open })
  status: TicketStatus;

  @Column({ type: 'varchar', length: 32, nullable: true })
  queue: string;

  @Column({ type: 'int', nullable: true })
  queue_id: number | null;

  @Column({ type: 'int', nullable: true })
  category_id: number | null;

  @Column({ type: 'int', nullable: true })
  customer_id: number | null;

  @Column({ type: 'int', nullable: true })
  assignee_id: number | null;

  constructor() {
    super();
  }
}
