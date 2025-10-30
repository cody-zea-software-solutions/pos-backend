import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shop } from '../shop/shop.entity';
import { Counter } from '../counter/counter.entity';
import { User } from '../users/user.entity';
import { LoyaltyLevel } from '../loyalty-management/loyalty-levels/loyalty-levels.entity';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  promotion_id: number;

  @Column()
  promotion_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  promotion_type: string;

  @Column({ type: 'datetime', nullable: true })
  start_date: Date;

  @Column({ type: 'datetime', nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  target_audience: string;

  @ManyToOne(() => Shop, (shop) => shop.promotions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_shop_id' })
  shop: Shop;

  @ManyToOne(() => Counter, (counter) => counter.promotions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_counter_id' })
  counter: Counter;

  @ManyToOne(() => LoyaltyLevel, (level) => level.promotions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'target_level_id' })
  loyalty_level: LoyaltyLevel;

  @Column({ type: 'text', nullable: true })
  promotion_rules: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => User, (user) => user.promotions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by_user' })
  created_by: User;

  @Column({ default: false })
  applies_to_variations: boolean;

  @Column({ default: false })
  applies_to_consignment: boolean;

  @Column({ default: false })
  is_gst_inclusive: boolean;

  @CreateDateColumn()
  created_at: Date;
}