import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cash_drawer_logs')
export class CashDrawerLogs {
  @PrimaryGeneratedColumn()
  log_id: number;

  @Column({ unique: true })
  shift_id: number;

  @Column({ unique: true })
  counter_id: number;

  @Column()
  action: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  action_time: Date;

  @Column({ unique: true })
  performed_by_user: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  reference_id: string;

  @Column({ default: false })
  requires_approval: boolean;

  @Column({ nullable: true })
  approved_by_user: number;
}
