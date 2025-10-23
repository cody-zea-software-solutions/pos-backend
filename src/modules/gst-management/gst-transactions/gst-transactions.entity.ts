import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum TransactionType {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  RETURN = 'RETURN',
}

export enum GstTreatment {
  TAXABLE = 'TAXABLE',
  EXEMPT = 'EXEMPT',
  ZERO_RATED = 'ZERO_RATED',
  NON_GST = 'NON_GST',
}

export enum InvoiceType {
  B2B = 'B2B',
  B2C = 'B2C',
  B2B_EXPORT = 'B2B_EXPORT',
  B2C_EXPORT = 'B2C_EXPORT',
}

@Entity('gst_transactions')
export class GstTransaction {
  @PrimaryGeneratedColumn()
  gst_transaction_id: number;

  @Column({ unique: true })
  transaction_id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transaction_type: TransactionType;

  @Column({
    type: 'enum',
    enum: GstTreatment,
  })
  gst_treatment: GstTreatment;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  taxable_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cgst_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sgst_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  igst_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cess_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_gst_amount: number;

  @Column({ nullable: true })
  customer_gst_number: string;

  @Column({ nullable: true })
  customer_state: string;

  @Column({ nullable: true })
  supplier_gst_number: string;

  @Column({ nullable: true })
  supplier_state: string;

  @Column({ default: false })
  is_interstate: boolean;

  @Column({ default: false })
  is_reverse_charge: boolean;

  @Column({ type: 'timestamp' })
  transaction_date: Date;

  @Column({
    type: 'enum',
    enum: InvoiceType,
  })
  invoice_type: InvoiceType;
}
