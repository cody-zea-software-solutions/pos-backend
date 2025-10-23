import { ProductVariation } from 'src/modules/product-management/product-variation/product-variation.entity';
import { Product } from 'src/modules/product-management/product/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Consignor } from '../consignor/consignor.entity';
import { Shop } from 'src/modules/shop/shop.entity';

@Entity('consignment_stock')
export class ConsignmentStock {
  @PrimaryGeneratedColumn()
  consignment_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariation, { nullable: true })
  @JoinColumn({ name: 'variation_id' })
  variation: ProductVariation;

  @ManyToOne(() => Consignor)
  @JoinColumn({ name: 'consignor_id' })
  consignor: Consignor;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Column({ type: 'int', default: 0 })
  quantity_received: number;

  @Column({ type: 'int', default: 0 })
  quantity_available: number;

  @Column({ type: 'int', default: 0 })
  quantity_sold: number;

  @Column({ type: 'int', default: 0 })
  quantity_returned: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  consignor_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  selling_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  commission_amount: number;

  @CreateDateColumn({ name: 'received_date' })
  received_date: Date;

  @UpdateDateColumn({ name: 'last_updated' })
  last_updated: Date;

  @Column({ type: 'varchar', length: 30, default: 'RECEIVED' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}