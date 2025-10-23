import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';

@Entity('gst_item_details')
@Unique(['gst_transaction_id', 'transaction_item_id', 'product_id'])
export class GstItemDetail {
  @PrimaryGeneratedColumn()
  gst_item_id: number;

  @Column()
  gst_transaction_id: number;

  @Column()
  transaction_item_id: number;

  @Column()
  product_id: number;

  @Column()
  hsn_code: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unit_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxable_value: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cgst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  sgst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  igst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  cess_rate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cgst_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sgst_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  igst_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cess_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_tax_amount: number;
}
