import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from '../services/service.entity';
@Entity('service_transactions')
export class ServiceTransaction {
  @PrimaryGeneratedColumn()
  service_transaction_id: number;

  @Column({ unique: true })
  transaction_id: number;

  @ManyToOne(() => Service) // unidirectional
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column()
  appointment_id: number;

  @Column()
  staff_user_id: number;

  @Column({ type: 'timestamp', nullable: true })
  service_start_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  service_end_time: Date;

  @Column({ nullable: true })
  actual_duration_minutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  quoted_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actual_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  staff_commission: number;

  @Column({ type: 'enum', enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'], default: 'SCHEDULED' })
  service_status: string;

  @Column({ type: 'text', nullable: true })
  service_notes: string;

  @Column({ type: 'text', nullable: true })
  customer_feedback: string;

  @Column({ nullable: true })
  customer_rating: number;

  @Column({ default: false })
  requires_follow_up: boolean;

  @Column({ type: 'timestamp', nullable: true })
  follow_up_date: Date;

  @Column({ type: 'text', nullable: true })
  follow_up_notes: string;

  @Column({ nullable: true })
  quantity: number; 
}
