import { Entity,ManyToOne, JoinColumn,PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/user.entity';
import { Shift } from '../../shift/shift.entity';
import { Counter } from '../../counter/counter.entity';

@Entity('cash_drawer_logs')
export class CashDrawerLogs {
  @PrimaryGeneratedColumn()
  log_id: number;

  @ManyToOne(() => Counter)
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;
    
  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column()
  action: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  action_time: Date;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ nullable: true })
  reference_id: string;

  @Column({ default: false })
  requires_approval: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performed_by_user' })
  performed_by_user: User;
   
  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by_user' })
  approved_by_user: User;
}
