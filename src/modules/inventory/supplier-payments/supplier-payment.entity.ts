import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { Shop } from '../../shop/shop.entity';
import { Supplier } from '../supplier/supplier.entity';
import { User } from '../../users/user.entity';
import { GoodsReceivedNote } from '../goods-received-notes/goods-received-note.entity';

export enum SupplierPaymentMethod {
  CASH = 'CASH',
  CHEQUE = 'CHEQUE',
  BANK_TRANSFER = 'BANK_TRANSFER',
  UPI = 'UPI',
}

export enum SupplierPaymentStatus {
  DRAFT = 'DRAFT',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('supplier_payments')
export class SupplierPayment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column({ unique: true })
  payment_number: string;

  @ManyToOne(() => Shop, (shop) => shop.supplier_payments, { eager: false })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplier_payments, {
    eager: false,
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => GoodsReceivedNote, (grn) => grn.supplierPayments, { eager: true, nullable: true })
  @JoinColumn({ name: 'grn_id' })
  grn: GoodsReceivedNote;

  @Column({ type: 'date' })
  payment_date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  payment_amount: number;

  @Column({
    type: 'enum',
    enum: SupplierPaymentMethod,
  })
  payment_method: SupplierPaymentMethod;

  @Column({ nullable: true })
  reference_number?: string;

  @Column({
    type: 'enum',
    enum: SupplierPaymentStatus,
    default: SupplierPaymentStatus.DRAFT,
  })
  status: SupplierPaymentStatus;

  @Column({ type: 'text', nullable: true })
  payment_notes?: string;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'created_by_user' })
  created_by_user?: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'paid_by_user' })
  paid_by_user?: User;

  @Column({ type: 'datetime', nullable: true })
  paid_at?: Date;

  @Column({ nullable: true })
  bank_account_number?: string;

  @Column({ nullable: true })
  transaction_id?: string;

  @BeforeInsert()
  generatePaymentNumber() {
    if (!this.payment_number) {
      const random = Math.floor(100000 + Math.random() * 900000);
      this.payment_number = `PAY-${random}`;
    }
  }
}