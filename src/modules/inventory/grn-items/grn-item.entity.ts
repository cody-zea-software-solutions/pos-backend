import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GoodsReceivedNote } from '../goods-received-notes/goods-received-note.entity';
import { Product } from '../../product-management/product/product.entity';
import { ProductVariation } from '../../product-management/product-variation/product-variation.entity';

export enum QualityStatus {
  GOOD = 'GOOD',
  DAMAGED = 'DAMAGED',
  EXPIRED = 'EXPIRED',
}

@Entity('grn_items')
export class GRNItem {
  @PrimaryGeneratedColumn()
  grn_item_id: number;

  @ManyToOne(() => GoodsReceivedNote, (grn) => grn.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'grn_id' })
  grn: GoodsReceivedNote;

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

  @Column({ type: 'int', default: 0 })
  quantity_accepted: number;

  @Column({ type: 'int', default: 0 })
  quantity_rejected: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  unit_cost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  total_cost: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  gst_amount: number;

  @Column({ type: 'date', nullable: true })
  manufacture_date?: Date;

  @Column({ type: 'date', nullable: true })
  expiry_date?: Date;

  @Column({
    type: 'enum',
    enum: QualityStatus,
    default: QualityStatus.GOOD,
  })
  quality_status: QualityStatus;

  @Column({ type: 'text', nullable: true })
  rejection_reason?: string;

  @Column({ type: 'text', nullable: true })
  remarks?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  hsn_code?: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  gst_rate?: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}