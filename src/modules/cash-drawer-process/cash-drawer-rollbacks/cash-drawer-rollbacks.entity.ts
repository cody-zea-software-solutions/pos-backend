import { Entity, PrimaryGeneratedColumn, Column,ManyToOne,JoinColumn } from 'typeorm';
import { User } from '../../users/user.entity';
import { Shift } from '../../shift/shift.entity';
import { Counter } from '../../counter/counter.entity';

@Entity({ name: 'cash_drawer_rollbacks' })
export class CashDrawerRollback {
  @PrimaryGeneratedColumn()
  rollback_id: number;

  @ManyToOne(() => Counter)
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;
  
  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

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

   @ManyToOne(() => User)
   @JoinColumn({ name: 'performed_by_user' })
   performed_by_user: User;
 
   @ManyToOne(() => User)
   @JoinColumn({ name: 'authorized_by_user' })
   authorized_by_user: User;
 

  @Column({ type: 'varchar', length: 255 })
  reference_transaction: string;

  @Column({ type: 'boolean', default: false })
  is_approved: boolean;

  @Column({ type: 'text', nullable: true })
  approval_notes: string;
}
