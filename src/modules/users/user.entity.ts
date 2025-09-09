import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Shop } from '../shop/shop.entity';
import { Counter } from '../counter/counter.entity';
import { Shift } from '../shift/shift.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password_hash: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  role: string;

  @ManyToOne(() => Shop, (shop) => shop.users, { onDelete: 'SET NULL', nullable: true })
  assigned_shop: Shop;

  @Column('text', { nullable: true })
  permissions: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  last_login: Date;

  @Column({ default: 'OFFLINE' })
  status: string;

  @Column({ default: false })
  can_approve_refunds: boolean;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  refund_approval_limit: number;

  @Column({ default: false })
  can_rollback_cash: boolean;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  rollback_limit: number;

  @Column({ default: false })
  can_manage_pricing: boolean;

  @Column({ default: false })
  can_manage_gst: boolean;

  @Column({ default: false })
  can_create_batches: boolean;

  @OneToMany(() => Counter, (counter) => counter.current_user)
  current_counters: Counter[];

  @OneToMany(() => Counter, (counter) => counter.rollback_by_user)
  rollback_counters: Counter[];

  @OneToMany(() => Shift, (shift) => shift.user)
  shifts: Shift[];


}