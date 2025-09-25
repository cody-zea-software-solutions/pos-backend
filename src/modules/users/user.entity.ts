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
import { LoyaltyPoints } from '../loyalty-management/loyalty-points/loyalty-points.entity';
import { CustomerRewards } from '../loyalty-management/customer-rewards/customer-rewards.entity';
import { Promotion } from '../promotion/promotion.entity';
import { Transaction } from '../pos-transactions/transactions/transaction.entity';
import { Refund } from '../refund-process/refund/refund.entity';
import { RefundApproval } from '../refund-process/refund-approvals/refund-approval.entity';
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

  @OneToMany(() => LoyaltyPoints, (loyaltyPoints) => loyaltyPoints.createdBy)
  createdLoyaltyPoints: LoyaltyPoints[];

  @OneToMany(() => CustomerRewards, (customerRewards) => customerRewards.processed_by_user)
  processedRewards: CustomerRewards[];

  @OneToMany(() => Promotion, (promotion) => promotion.created_by)
  promotions: Promotion[];

  @OneToMany(() => Transaction, (transaction) => transaction.shop)
  transactions: Transaction[];

  @OneToMany(() => Refund, (refund) => refund.processed_by)
  processed_refunds: Refund[];

  @OneToMany(() => Refund, (refund) => refund.authorized_by)
  authorized_refunds: Refund[];

  @OneToMany(() => RefundApproval, (approval) => approval.approver)
  refund_approvals: RefundApproval[];

}