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
import { User } from '../users/user.entity';
import { Shift } from '../shift/shift.entity';
import { LoyaltyPoints } from '../loyalty-management/loyalty-points/loyalty-points.entity';
import { CustomerRewards } from '../loyalty-management/customer-rewards/customer-rewards.entity';
import { Promotion } from '../promotion/promotion.entity';
import { Transaction } from '../pos-transactions/transactions/transaction.entity';
import { Refund } from '../refund-process/refund/refund.entity';
import { Customer } from '../loyalty-management/customer/customer.entity'; 
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
  current_user: User | null;

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

  @OneToMany(() => Shift, (shift) => shift.counter)
  shifts: Shift[];

  @OneToMany(() => LoyaltyPoints, (loyaltyPoints) => loyaltyPoints.counter)
  loyaltyPoints: LoyaltyPoints[];

  @OneToMany(() => CustomerRewards, (customerRewards) => customerRewards.counter)
  customerRewards: CustomerRewards[];

  @OneToMany(() => Promotion, (promotion) => promotion.counter)
  promotions: Promotion[];

  @OneToMany(() => Transaction, (transaction) => transaction.shop)
  transactions: Transaction[];

  @OneToMany(() => Refund, (refund) => refund.counter)
  refunds: Refund[];

  @OneToMany(() => Customer, (customer) => customer.preferred_counter)
  customers: Customer[];

}