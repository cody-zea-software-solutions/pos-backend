import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseOrder } from '../purchase-orders/purchase-order.entity';
import { Product } from 'src/modules/product-management/product/product.entity';
import { ProductVariation } from 'src/modules/product-management/product-variation/product-variation.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  po_item_id: number;

  @ManyToOne(() => PurchaseOrder, (po) => po.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'po_id' })
  purchase_order: PurchaseOrder;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'product_id' })
  product?: Product;

  @ManyToOne(() => ProductVariation, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'variation_id' })
  variation?: ProductVariation;

  @Column({ type: 'int' })
  quantity_ordered: number;

  @Column({ type: 'int', default: 0 })
  quantity_received: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  total_price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  gst_amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  gst_rate: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hsn_code: string;

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}