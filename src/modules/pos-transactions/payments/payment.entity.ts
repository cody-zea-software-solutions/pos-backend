import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { User } from '../../users/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @ManyToOne(() => Transaction, (trx) => trx.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction;

  @Column()
  payment_method: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  reference_number: string;

  @Column({ type: 'timestamp', nullable: true })
  payment_date: Date;

  @Column({ nullable: true })
  status: string;

  @Column({ type: 'text', nullable: true })
  gateway_response: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'processed_by_user' })
  processed_by: User;

  @CreateDateColumn()
  created_at: Date;
}