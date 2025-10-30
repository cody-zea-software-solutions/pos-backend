import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../product-management/product/product.entity';

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn()
  discount_id: number;

  @Column()
  discount_name: string;

  @Column({ unique: true })
  discount_code: string;

  @Column()
  discount_type: string; // PERCENTAGE / FIXED

  @Column('decimal', { precision: 10, scale: 2 })
  discount_value: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  minimum_purchase: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  maximum_discount: number;

  @Column({ type: 'datetime', nullable: true })
  valid_from: Date;

  @Column({ type: 'datetime', nullable: true })
  valid_until: Date;

  @Column({ nullable: true })
  applicable_to: string; // PRODUCT / BUNDLE / SERVICE etc.

  @ManyToOne(() => Product, (product) => product.discounts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'target_id' })
  target_product: Product; 

  @Column({ type: 'int', default: 0 })
  usage_limit_per_customer: number;

  @Column({ type: 'int', default: 0 })
  total_usage_limit: number;

  @Column({ type: 'int', default: 0 })
  current_usage_count: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  terms_conditions: string;

  @Column({ default: false })
  applies_to_variations: boolean;

  @Column({ default: false })
  applies_to_consignment: boolean;

  @Column({ default: false })
  is_gst_inclusive: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}