import { Shop } from '../../shop/shop.entity';
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
import { Supplier } from '../supplier/supplier.entity';
import { User } from '../../users/user.entity';
import { PurchaseOrderItem } from '../purchase-order-items/purchase-order-item.entity';

export enum PurchaseOrderStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  PARTIAL_RECEIVED = 'PARTIAL_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn()
  po_id: number;

  @Column({ unique: true })
  po_number: string;

  @ManyToOne(() => Shop, (shop) => shop.purchase_orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchase_orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ type: 'date' })
  order_date: string;

  @Column({ type: 'date', nullable: true })
  expected_delivery_date: string;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  total_amount: number;

  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  total_gst_amount: number;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

  @Column({ type: 'text', nullable: true })
  terms_conditions: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user' })
  created_by_user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'approved_by_user' })
  approved_by_user: User;

  @Column({ type: 'timestamp', nullable: true })
  approved_at: Date;

  @Column({ default: false })
  is_gst_applicable: boolean;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchase_order, {
    cascade: true})
  items: PurchaseOrderItem[];
}