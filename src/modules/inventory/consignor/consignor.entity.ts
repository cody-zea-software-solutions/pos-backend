import { TransactionItem } from '../../pos-transactions/transaction-items/transaction-item.entity';
import { Product } from '../../product-management/product/product.entity';
import { RefundItem } from '../../refund-process/refund-items/refund-item.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('consignors')
export class Consignor {
  @PrimaryGeneratedColumn()
  consignor_id: number;

  @Column()
  consignor_name: string;

  @Column({ unique: true })
  consignor_code: string;

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

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  commission_rate: number;

  @Column({ type: 'int', default: 0 })
  payment_terms_days: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  gst_number: string;

  @Column({ nullable: true })
  gst_registration_type: string;

  @OneToMany(() => Product, (product) => product.consignor)
  products: Product[];

  @OneToMany(() => TransactionItem, (item) => item.consignor)
  transactionItems: TransactionItem[];

  @OneToMany(() => RefundItem, (item) => item.consignor)
  refund_items: RefundItem[];

}