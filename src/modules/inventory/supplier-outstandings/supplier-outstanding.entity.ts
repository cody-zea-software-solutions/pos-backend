import { Shop } from '../../shop/shop.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { GoodsReceivedNote } from '../goods-received-notes/goods-received-note.entity';

export enum SupplierOutstandingStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
}

@Entity('supplier_outstandings')
export class SupplierOutstanding {
  @PrimaryGeneratedColumn()
  outstanding_id: number;

  @ManyToOne(() => Shop, (shop) => shop.supplier_outstandings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Supplier, (supplier) => supplier.supplier_outstandings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => GoodsReceivedNote, (grn) => grn.supplier_outstandings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'grn_id' })
  grn?: GoodsReceivedNote;

  @Column('decimal', { precision: 12, scale: 2 })
  total_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  paid_amount: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balance_amount: number;

  @Column({ type: 'date', nullable: true })
  due_date: Date;

  @Column({
    type: 'enum',
    enum: SupplierOutstandingStatus,
    default: SupplierOutstandingStatus.PENDING,
  })
  status: SupplierOutstandingStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Automatically update balance when entity is loaded
  @AfterLoad()
  updateBalanceAfterLoad() {
    this.balance_amount =
      Number(this.total_amount || 0) - Number(this.paid_amount || 0);
  }

  // Automatically recalc before saving
  @BeforeInsert()
  @BeforeUpdate()
  updateBalanceBeforeSave() {
    this.balance_amount =
      Number(this.total_amount || 0) - Number(this.paid_amount || 0);
  }
}