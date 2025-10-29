import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { TransactionType } from './cash-drawer-transaction-type.enum';

@Entity('cash-drawer')
export class CashDrawerTransaction {
  @PrimaryGeneratedColumn()
  drawer_transaction_id: number;

  @Column()
  counter_id: number;

  @Column()
  shift_id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transaction_type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('decimal', { precision: 10, scale: 2 })
  balance_before: number;

  @Column('decimal', { precision: 10, scale: 2 })
  balance_after: number;

  @Column({ nullable: true })
  reference_number: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transaction_time: Date;

  @Column()
  performed_by_user: number;

  @Column()
  authorized_by_user: number;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
