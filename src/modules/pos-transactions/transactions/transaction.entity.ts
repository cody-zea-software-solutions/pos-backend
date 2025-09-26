import { Counter } from '../../counter/counter.entity';
import { Customer } from '../../loyalty-management/customer/customer.entity';
import { Shop } from '../../shop/shop.entity';
import { User } from '../../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { TransactionItem } from '../transaction-items/transaction-item.entity';
import { Payment } from '../payments/payment.entity';
import { Refund } from '../../refund-process/refund/refund.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Column({ unique: true })
  transaction_number: string;

  @ManyToOne(() => Shop, (shop) => shop.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Counter, (counter) => counter.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;

  @ManyToOne(() => Customer, (customer) => customer.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'timestamp' })
  transaction_date: Date;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  tax_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  discount_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paid_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  change_amount: number;

  @Column()
  payment_status: string; // PAID / PARTIAL / UNPAID

  @Column()
  transaction_type: string; // SALE / RETURN / EXCHANGE

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'processed_by_user' })
  processed_by: User;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  is_loyalty_applied: boolean;

  @Column({ type: 'int', default: 0 })
  loyalty_points_earned: number;

  @Column({ type: 'int', default: 0 })
  loyalty_points_redeemed: number;

  @Column({ nullable: true })
  receipt_number: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: false })
  has_consignment_items: boolean;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  consignment_commission: number;

  @Column({ default: false })
  is_gst_applicable: boolean;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_cgst: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_sgst: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_igst: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  total_cess: number;

  @Column({ nullable: true })
  invoice_type: string; // B2B / B2C

  @Column({ default: false })
  is_b2b_transaction: boolean;

  @OneToMany(() => TransactionItem, (item) => item.transaction, { cascade: true })
  items: TransactionItem[];

  @OneToMany(() => Payment, (payment) => payment.transaction, { cascade: true })
  payments: Payment[];

  @OneToMany(() => Refund, (refund) => refund.original_transaction)
  refunds: Refund[];

}