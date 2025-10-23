import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('gst_returns')
export class GstReturn {
  @PrimaryGeneratedColumn()
  return_id: number;

  @Column()
  shop_id: number;

  @Column({ type: 'varchar', length: 20 })
  return_type: string; // "GSTR1", "GSTR3B", "GSTR9"

  @Column({ type: 'varchar', length: 10 })
  period_month: string;

  @Column({ type: 'varchar', length: 10 })
  period_year: string;

  @Column({ type: 'timestamp', nullable: true })
  filing_date: Date;

  @Column({ type: 'varchar', length: 20, default: 'DRAFT' })
  status: string; // DRAFT, FILED, ACCEPTED, REJECTED

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_taxable_sales: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_cgst_collected: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_sgst_collected: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_igst_collected: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_cess_collected: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_taxable_purchases: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_cgst_paid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_sgst_paid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_igst_paid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  total_cess_paid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  net_tax_liability: number;

  @Column({ type: 'text', nullable: true })
  filing_response: string;

  @Column()
  filed_by_user: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
