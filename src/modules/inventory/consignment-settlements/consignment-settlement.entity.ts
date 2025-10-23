import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Consignor } from '../consignor/consignor.entity';
import { Shop } from '../../shop/shop.entity';
import { User } from '../../users/user.entity';

@Entity('consignment_settlements')
export class ConsignmentSettlement {
  @PrimaryGeneratedColumn()
  settlement_id: number;

  @ManyToOne(() => Consignor)
  @JoinColumn({ name: 'consignor_id' })
  consignor: Consignor;

  @ManyToOne(() => Shop)
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Column({ type: 'date' })
  settlement_period_start: Date;

  @Column({ type: 'date' })
  settlement_period_end: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_sales_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_commission: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_payable: number;

  @Column({ type: 'date', nullable: true })
  settlement_date: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'PENDING',
  })
  payment_status: string; // PENDING / PAID / PARTIAL / CANCELLED

  @Column({ nullable: true })
  payment_reference: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'processed_by_user' })
  processed_by_user: User;

  @Column({ type: 'text', nullable: true })
  notes: string;
}