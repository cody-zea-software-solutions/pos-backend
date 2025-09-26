import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceType {
  INDIVIDUAL = 'INDIVIDUAL',
  GROUP = 'GROUP',
  APPOINTMENT_BASED = 'APPOINTMENT_BASED',
  WALK_IN = 'WALK_IN',
}

export enum GstTreatment {
  TAXABLE = 'TAXABLE',
  EXEMPT = 'EXEMPT',
  ZERO_RATED = 'ZERO_RATED',
}

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  service_id: number;

  @Column()
  service_name: string;

  @Column({ unique: true })
  service_code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  //needed to reffer to category and subcategory tables when created
  @Column({ nullable: true })
  category_id: number;

  //needed to reffer to category and subcategory tables when created
  @Column({ nullable: true })
  subcategory_id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  base_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost_price: number;

  @Column('int', { nullable: true })
  duration_minutes: number;

  @Column({ type: 'enum', enum: ServiceType })
  service_type: ServiceType;

  @Column({ default: false })
  requires_appointment: boolean;

  @Column({ default: false })
  requires_staff_assignment: boolean;

  @Column({ type: 'int', default: 1 })
  max_concurrent_bookings: number;

  @Column({ nullable: true })
  hsn_code: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  gst_rate: number;

  @Column({ default: false })
  is_gst_applicable: boolean;

  @Column({ type: 'enum', enum: GstTreatment, default: GstTreatment.TAXABLE })
  gst_treatment: GstTreatment;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: false })
  enable_multi_branch_pricing: boolean;

  // This will refer to a pricing group table when created
  @Column({ nullable: true })
  default_pricing_group_id: number;

  @Column({ default: false })
  requires_pre_payment: boolean;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  advance_payment_percent: number;

  @Column({ type: 'text', nullable: true })
  service_instructions: string;

  @Column({ type: 'text', nullable: true })
  cancellation_policy: string;

  @Column({ nullable: true })
  cancellation_hours_before: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  cancellation_fee_percent: number;
}