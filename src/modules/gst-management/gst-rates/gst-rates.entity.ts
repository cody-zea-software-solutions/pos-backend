import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum GstCategory {
  GOODS = 'GOODS',
  SERVICES = 'SERVICES',
}

@Entity('gst_rates')
export class GstRate {
  @PrimaryGeneratedColumn()
  gst_rate_id: number;

  @Column({ unique: true })
  hsn_code: string;

  @Column({
    type: 'enum',
    enum: GstCategory,
    default: GstCategory.GOODS,
  })
  gst_category: GstCategory;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cgst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  sgst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  igst_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  cess_rate: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  effective_from: Date;

  @Column({ type: 'timestamp', nullable: true })
  effective_to: Date;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;
}
