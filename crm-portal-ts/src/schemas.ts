import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  customer_code: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ enum: CustomerStatus, default: 'active' })
  status: CustomerStatus;

  @Column({ nullable: true })
  location_state_id?: number;

  @Column({ nullable: true })
  location_district_id?: number;

  @Column({ nullable: true })
  location_city_id?: number;

  @Column({ nullable: true })
  location_street_id?: number;

  @Column({ nullable: true })
  street_number?: string;
}

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  body?: string;

  @Column({ enum: TicketStatus, default: 'open' })
  status: TicketStatus;

  @Column({ nullable: true })
  queue?: string;

  @Column({ nullable: true })
  queue_id?: number;

  @Column({ nullable: true })
  category_id?: number;

  @Column({ nullable: true })
  customer_id?: number;

  @Column({ nullable: true })
  assignee_id?: number;
}
