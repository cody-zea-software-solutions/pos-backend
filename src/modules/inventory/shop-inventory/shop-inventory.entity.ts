import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Batch } from '../batches/batches.entity';
import { ProductVariation } from '../../product-management/product-variation/product-variation.entity';
import { Product } from '../../product-management/product/product.entity';
import { Shop } from '../../shop/shop.entity';
import { User } from '../../users/user.entity';
import { Consignor } from '../consignor/consignor.entity';

@Entity('shop_inventory')
export class ShopInventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @ManyToOne(() => Shop, (shop) => shop.inventory, { eager: true })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Product, (product) => product.shop_inventory, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariation, (variation) => variation.shop_inventory, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'variation_id' })
  variation?: ProductVariation;

  @ManyToOne(() => Batch, (batch) => batch.shop_inventory, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'batch_id' })
  batch?: Batch;

  @Column({ type: 'int', default: 0 })
  available_quantity: number;

  @Column({ type: 'int', default: 0 })
  reserved_quantity: number;

  @Column({ type: 'int', default: 0 })
  minimum_stock_level: number;

  @UpdateDateColumn({ name: 'last_updated', nullable: true })
  last_updated: Date;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'last_updated_by' })
  last_updated_by: User;

  @Column({ type: 'boolean', default: false })
  is_consignment: boolean;

  @ManyToOne(() => Consignor, { eager: true, nullable: true })
  @JoinColumn({ name: 'consignor_id' })
  consignor?: Consignor;
}