import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Refund } from '../refund/refund.entity';
import { Product } from 'src/modules/product-management/product/product.entity';
import { ProductVariation } from 'src/modules/product-management/product-variation/product-variation.entity';
import { Consignor } from 'src/modules/inventory/consignor/consignor.entity';
import { TransactionItem } from 'src/modules/pos-transactions/transaction-items/transaction-item.entity';

export enum ItemCondition {
  NEW = 'NEW',
  USED = 'USED',
  DAMAGED = 'DAMAGED',
}

export enum RestockAction {
  RESTOCK = 'RESTOCK',
  DISCARD = 'DISCARD',
  RETURN_TO_SUPPLIER = 'RETURN_TO_SUPPLIER',
}

@Entity('refund_items')
export class RefundItem {
  @PrimaryGeneratedColumn()
  refund_item_id: number;

  @ManyToOne(() => Refund, (refund) => refund.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'refund_id' })
  refund: Refund;

  @ManyToOne(() => TransactionItem, (item) => item.refund_items, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'original_item_id' })
  original_item: TransactionItem;

  @ManyToOne(() => Product, (product) => product.refund_items, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariation, (variation) => variation.refund_items, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'variation_id' })
  variation: ProductVariation;

  @Column({ nullable: true })
  batch_id: number;

  @Column('int')
  quantity_refunded: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unit_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  refund_amount: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  gst_refund_amount: number;

  @Column({ type: 'enum', enum: ItemCondition })
  condition: ItemCondition;

  @Column({ type: 'enum', enum: RestockAction })
  restock_action: RestockAction;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  is_consignment: boolean;

  @ManyToOne(() => Consignor, (consignor) => consignor.refund_items, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'consignor_id' })
  consignor: Consignor;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  consignment_adjustment: number;
}