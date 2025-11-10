import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn } from 'typeorm';
import { TransactionType } from './cash-drawer-transaction-type.enum';
import { User } from '../../users/user.entity';
import { Shift } from '../../shift/shift.entity';
import { Counter } from '../../counter/counter.entity';
@Entity('cash_drawer_transactions')
export class CashDrawerTransaction {

  @PrimaryGeneratedColumn()
  drawer_transaction_id: number;

 @ManyToOne(() => Counter)
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;
  
  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

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
  reference_number?: string;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  transaction_time: Date;

   @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by_user' })
  performed_by_user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorized_by_user' })
  authorized_by_user: User;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;


}
//manyone-user
//manytoone - counter