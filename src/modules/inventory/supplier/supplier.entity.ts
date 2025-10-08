import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';

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

  @OneToMany(() => PurchaseOrder, (po) => po.shop)
  purchase_orders: PurchaseOrder[];
}