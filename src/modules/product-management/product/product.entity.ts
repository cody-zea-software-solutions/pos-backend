import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductGroup } from '../product-group/product-group.entity';
import { ProductUnit } from '../product-units/product-unit.entity';
import { ProductCategory } from '../product-category/product-category.entity';
import { ProductSubcategory } from '../product-subcategory/product-subcategory.entity';
import { Consignor } from '../../inventory/consignor/consignor.entity';
import { ProductVariation } from '../product-variation/product-variation.entity';
import { TransactionItem } from '../../pos-transactions/transaction-items/transaction-item.entity';
import { RefundItem } from '../../refund-process/refund-items/refund-item.entity';
import { Batch } from '../../inventory/batches/batches.entity';
import { ShopInventory } from '../../inventory/shop-inventory/shop-inventory.entity';
import { Discount } from '../../discount/discount.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  product_name: string;

  @Column({ unique: true })
  product_code: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ default: false })
  auto_generate_barcode: boolean;

  @Column({ nullable: true })
  generated_barcode_prefix: string;

  @ManyToOne(() => ProductGroup, (group) => group.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'group_id' })
  group: ProductGroup;

  @ManyToOne(() => ProductCategory, (cat) => cat.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @ManyToOne(() => ProductSubcategory, (subcat) => subcat.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: ProductSubcategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  product_type: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  base_price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cost_price: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  wholesale_price: number;

  @ManyToOne(() => ProductUnit, (unit) => unit.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'unit_id' })
  unit: ProductUnit;

  @Column({ nullable: true })
  unit_of_measure: string;

  @Column({ default: false })
  is_batch_tracked: boolean;

  @Column({ default: false })
  has_expiry: boolean;

  @Column({ type: 'int', nullable: true })
  shelf_life_days: number;

  @Column({ nullable: true })
  hsn_code: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  gst_rate: number;

  @Column({ default: false })
  is_gst_applicable: boolean;

  @Column({ nullable: true })
  gst_treatment: string; // TAXABLE / EXEMPT / ZERO_RATED

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  image_url: string;

  @Column({ type: 'int', default: 0 })
  reorder_level: number;

  @Column({ type: 'int', default: 0 })
  max_stock_level: number;

  @Column({ default: false })
  has_variations: boolean;

  @Column({ default: false })
  is_consignment: boolean;

  @ManyToOne(() => Consignor, (consignor) => consignor.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'consignor_id' })
  consignor: Consignor;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  consignment_rate: number;

  @Column({ default: false })
  enable_multi_branch_pricing: boolean;

  @OneToMany(() => ProductVariation, (variation) => variation.product, {
    cascade: true, // optional: saves variations when saving product
  })
  variations: ProductVariation[];

  @OneToMany(() => TransactionItem, (item) => item.product)
  transactionItems: TransactionItem[];

  @OneToMany(() => RefundItem, (item) => item.product)
  refund_items: RefundItem[];

  @OneToMany(() => Batch, (batch) => batch.product)
  batches: Batch[];

  @OneToMany(() => ShopInventory, (shopInventory) => shopInventory.product)
  shop_inventory: ShopInventory[];

  @OneToMany(() => Discount, (discount) => discount.target_product)
  discounts: Discount[];

  // Default pricing group relation → will implement later
  @Column({ nullable: true })
  default_pricing_group_id: number;
}