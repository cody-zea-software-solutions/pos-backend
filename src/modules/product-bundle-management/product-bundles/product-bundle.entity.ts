import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BundleStatus, BundleType, GstTreatment, PricingStrategy } from './bundle.enums';

@Entity('product_bundles')
export class ProductBundle {
  @PrimaryGeneratedColumn()
  bundle_id: number;

  @Column()
  bundle_name: string;

  @Column({ unique: true })
  bundle_code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: BundleType })
  bundle_type: BundleType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bundle_price: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bundle_cost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount_percentage: number;

  @Column({ type: 'enum', enum: PricingStrategy })
  pricing_strategy: PricingStrategy;

  @Column({ type: 'datetime', nullable: true })
  valid_from: Date;

  @Column({ type: 'datetime', nullable: true })
  valid_until: Date;

  @Column({ default: 0 })
  minimum_items_required: number;

  @Column({ default: 0 })
  maximum_items_allowed: number;

  @Column({ type: 'boolean', default: false })
  allow_item_substitution: boolean;

  @Column({ type: 'boolean', default: false })
  allow_quantity_modification: boolean;

  @Column({ length: 50, nullable: true })
  hsn_code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  gst_rate: number;

  @Column({ type: 'boolean', default: false })
  is_gst_applicable: boolean;

  @Column({ type: 'enum', enum: GstTreatment, nullable: true })
  gst_treatment: GstTreatment;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: false })
  enable_multi_branch_pricing: boolean;

  // raw number for now
  @Column({ nullable: true })
  default_pricing_group_id: number;

  @Column({ type: 'text', nullable: true })
  terms_conditions: string;

  @Column({ default: 0 })
  stock_quantity: number;

  @Column({ default: false })
  track_bundle_inventory: boolean;

  @Column({ default: 0 })
  reorder_level: number;

  @Column({ type: 'enum', enum: BundleStatus, default: BundleStatus.ACTIVE })
  bundle_status: BundleStatus;
}