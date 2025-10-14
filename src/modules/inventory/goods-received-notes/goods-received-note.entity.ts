import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Shop } from '../../shop/shop.entity';
import { Supplier } from '../supplier/supplier.entity';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { User } from '../../users/user.entity';
import { SupplierOutstanding } from '../supplier-outstandings/supplier-outstanding.entity';
import { SupplierPayment } from '../supplier-payments/supplier-payment.entity';

// -----------------------------
// ENUMS
// -----------------------------

export enum GrnStatus {
  DRAFT = 'DRAFT',
  RECEIVED = 'RECEIVED',
  VERIFIED = 'VERIFIED',
  POSTED = 'POSTED',
}

export enum GrnPaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
}

// -----------------------------
// ENTITY
// -----------------------------

@Entity('goods_received_notes')
export class GoodsReceivedNote {
  @PrimaryGeneratedColumn()
  grn_id: number;

  @Column({ unique: true })
  grn_number: string;

  // -----------------------------
  // Foreign Keys
  // -----------------------------
  @ManyToOne(() => Shop, (shop) => shop.goods_received_notes, { eager: true })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Supplier, (supplier) => supplier.goods_received_notes, { eager: true })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => PurchaseOrder, (po) => po.goods_received_notes, { eager: true })
  @JoinColumn({ name: 'purchase_order_id' })
  purchase_order: PurchaseOrder;

  // User relations (received, verified, posted)
  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'received_by_user' })
  received_by_user: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'verified_by_user' })
  verified_by_user: User;

  @ManyToOne(() => User, { nullable: true, eager: true })
  @JoinColumn({ name: 'posted_by_user' })
  posted_by_user: User;

  // -----------------------------
  // Core Fields
  // -----------------------------
  @Column({ type: 'date', nullable: true })
  grn_date: Date;

  @Column({ type: 'datetime', nullable: true })
  received_time: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_gst_amount: number;

  @Column({
    type: 'enum',
    enum: GrnStatus,
    default: GrnStatus.DRAFT,
  })
  status: GrnStatus;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ nullable: true })
  delivery_note_reference: string;

  @Column({ nullable: true })
  vehicle_number: string;

  @Column({ nullable: true })
  driver_name: string;

  @Column({ default: false })
  is_gst_applicable: boolean;

  @Column({
    type: 'enum',
    enum: GrnPaymentStatus,
    default: GrnPaymentStatus.PENDING,
  })
  payment_status: GrnPaymentStatus;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_outstanding_amount: number;

  // -----------------------------
  // Audit Fields
  // -----------------------------
  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  verified_at: Date;

  @Column({ type: 'datetime', nullable: true })
  posted_at: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updated_at: Date;

  // -----------------------------
  // Relations
  // -----------------------------
  @OneToMany(() => SupplierOutstanding, (out) => out.grn)
  supplier_outstandings: SupplierOutstanding[];

  @OneToMany(() => SupplierPayment, (payment) => payment.grn)
  supplierPayments: SupplierPayment[];

}