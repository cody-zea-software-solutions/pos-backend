import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductBundle } from '../product-bundles/product-bundle.entity';
import { Product } from '../../product-management/product/product.entity';
import { ProductVariation } from '../../product-management/product-variation/product-variation.entity';
import { Service } from '../../service-management/services/service.entity';

export enum BundleItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}

@Entity('bundle_items')
export class BundleItem {
  @PrimaryGeneratedColumn()
  bundle_item_id: number;

  @ManyToOne(() => ProductBundle, (bundle) => bundle.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bundle_id' })
  bundle: ProductBundle;

  @ManyToOne(() => Product, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @ManyToOne(() => ProductVariation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variation_id' })
  variation?: ProductVariation;

  @ManyToOne(() => Service, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'service_id' })
  service?: Service;

  @Column({
    type: 'enum',
    enum: BundleItemType,
  })
  item_type: BundleItemType;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'int', default: 1 })
  minimum_quantity: number;

  @Column({ type: 'int', nullable: true })
  maximum_quantity: number;

  @Column({ default: false })
  is_mandatory: boolean;

  @Column({ default: false })
  allow_substitution: boolean;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  individual_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  bundle_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'text', nullable: true })
  substitution_rules: string;

  @Column({ type: 'text', nullable: true })
  item_notes: string;

  @CreateDateColumn()
  created_at: Date;
}