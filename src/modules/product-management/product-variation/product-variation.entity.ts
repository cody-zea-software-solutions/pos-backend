import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { TransactionItem } from '../../pos-transactions/transaction-items/transaction-item.entity';
import { RefundItem } from '../../refund-process/refund-items/refund-item.entity';
import { Batch } from 'src/modules/inventory/batches/batches.entity';
import { ShopInventory } from 'src/modules/inventory/shop-inventory/shop-inventory.entity';

@Entity('product_variations')
export class ProductVariation {
  @PrimaryGeneratedColumn()
  variation_id: number;

  @ManyToOne(() => Product, (product) => product.variations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  variation_name: string;

  @Column({ unique: true })
  variation_code: string;

  @Column({ nullable: true })
  variation_type: string; // COLOR / SIZE / FLAVOR / MODEL

  @Column({ nullable: true })
  variation_value: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price_adjustment: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  cost_adjustment: number;

  @Column({ nullable: true })
  barcode: string;

  @Column({ default: false })
  auto_generate_barcode: boolean;

  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  hsn_code: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  gst_rate: number;

  @Column({ default: true })
  inherit_parent_gst: boolean;

  @OneToMany(() => TransactionItem, (item) => item.variation)
  transactionItems: TransactionItem[];

  @OneToMany(() => RefundItem, (item) => item.variation)
  refund_items: RefundItem[];

  @OneToMany(() => Batch, (batch) => batch.variation)
  batches: Batch[];

  @OneToMany(() => ShopInventory, (shopInventory) => shopInventory.variation)
  shop_inventory: ShopInventory[];

}