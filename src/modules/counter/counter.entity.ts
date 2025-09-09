import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shop } from '../shop/shop.entity';
import { User } from '../users/user.entity';

@Entity('counters')
export class Counter {
  @PrimaryGeneratedColumn()
  counter_id: number;

  @ManyToOne(() => Shop, (shop) => shop.counters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Column()
  counter_name: string;

  @Column({ unique: true })
  counter_code: string;

  @Column()
  counter_type: string;

  @Column({ default: false })
  has_cash_drawer: boolean;

  @Column({ nullable: true })
  printer_config: string;

  @Column({ nullable: true })
  hardware_config: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'current_user_id' })
  current_user: User;

  @Column({ default: 'CLOSED' })
  status: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  opening_cash_balance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  current_cash_balance: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  rollback_balance: number;

  @Column({ type: 'datetime', nullable: true })
  last_rollback: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rollback_by_user' })
  rollback_by_user: User;

  @Column({ default: false })
  enable_gst_printing: boolean;
}