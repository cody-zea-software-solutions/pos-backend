import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'cash_drawer_rollbacks' })
export class CashDrawerRollback {
  @PrimaryGeneratedColumn()
  rollback_id: number;

  @Column({ type: 'int', unique: true })
  counter_id: number;

  @Column({ type: 'int', unique: true })
  shift_id: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  rollback_amount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balance_before_rollback: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  balance_after_rollback: number;

  @Column({ type: 'varchar', length: 255 })
  rollback_reason: string;

  @Column({ type: 'timestamp' })
  rollback_time: Date;

  @Column({ type: 'int', unique: true })
  performed_by_user: number;

  @Column({ type: 'int', unique: true })
  authorized_by_user: number;

  @Column({ type: 'varchar', length: 255 })
  reference_transaction: string;

  @Column({ type: 'boolean', default: false })
  is_approved: boolean;

  @Column({ type: 'text', nullable: true })
  approval_notes: string;
}
