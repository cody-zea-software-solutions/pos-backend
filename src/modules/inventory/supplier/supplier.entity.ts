import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { GoodsReceivedNote } from '../goods-received-notes/goods-received-note.entity';
import { SupplierOutstanding } from '../supplier-outstandings/supplier-outstanding.entity';
import { SupplierPayment } from '../supplier-payments/supplier-payment.entity';
import { Batch } from '../batches/batches.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn()
  supplier_id: number;

  @Column()
  supplier_name: string;

  @Column()
  supplier_code: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  contact_person: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  credit_limit: number;

  @Column({ default: 0 })
  payment_terms_days: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  gst_number: string;

  @Column({ nullable: true })
  gst_registration_type: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  current_outstanding: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  credit_utilization_percentage: number;

  @Column({ type: 'datetime', nullable: true })
  last_payment_date: Date;

  @OneToMany(() => PurchaseOrder, (po) => po.supplier)
  purchase_orders: PurchaseOrder[];

  // Relationship with GRNs
  @OneToMany(() => GoodsReceivedNote, (grn) => grn.supplier)
  goods_received_notes: GoodsReceivedNote[];

  // Relationship with SupplierOutstandings
  @OneToMany(() => SupplierOutstanding, (out) => out.supplier)
  supplier_outstandings: SupplierOutstanding[];

  // Relationship with SupplierPayments
  @OneToMany(() => SupplierPayment, (pay) => pay.supplier)
  supplier_payments: SupplierPayment[];

  // Relationship with Batches
  @OneToMany(() => Batch, (batch) => batch.supplier)
  batches: Batch[];

  // Auto-calculate credit utilization after loading
  @AfterLoad()
  updateCreditUtilization() {
    if (this.credit_limit && this.credit_limit > 0) {
      const utilization =
        (Number(this.current_outstanding) / Number(this.credit_limit)) * 100;
      this.credit_utilization_percentage = parseFloat(utilization.toFixed(2));
    } else {
      this.credit_utilization_percentage = 0;
    }
  }

  // Auto-calculate credit utilization before insert or update
  @BeforeInsert()
  @BeforeUpdate()
  updateCreditUtilizationBeforeSave() {
    if (this.credit_limit && this.credit_limit > 0) {
      const utilization =
        (Number(this.current_outstanding) / Number(this.credit_limit)) * 100;
      this.credit_utilization_percentage = parseFloat(utilization.toFixed(2));
    } else {
      this.credit_utilization_percentage = 0;
    }
  }
}