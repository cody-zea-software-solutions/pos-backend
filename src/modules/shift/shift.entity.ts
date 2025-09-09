import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Shop } from '../shop/shop.entity';
import { Counter } from '../counter/counter.entity';

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  shift_id: number;

  @ManyToOne(() => User, (user) => user.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Shop, (shop) => shop.shifts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Counter, (counter) => counter.shifts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;

  @Column({ type: 'datetime' })
  shift_start: Date;

  @Column({ type: 'datetime', nullable: true })
  shift_end: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  opening_cash: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  closing_cash: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  expected_cash: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cash_difference: number;

  @Column({ default: 0 })
  total_transactions: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_sales: number;

  @Column({ default: 'OPEN' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_rollbacks: number;

  @Column({ default: 0 })
  rollback_count: number;
}