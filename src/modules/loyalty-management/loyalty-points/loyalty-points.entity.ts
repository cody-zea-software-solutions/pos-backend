import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Shop } from '../../shop/shop.entity';
import { Customer } from '../customer/customer.entity';
import { Counter } from '../../counter/counter.entity';
import { User } from '../../users/user.entity';

@Entity({ name: 'loyalty_points' })
export class LoyaltyPoints {
  @PrimaryGeneratedColumn()
  point_id: number;

  @ManyToOne(() => Customer, (customer) => customer.loyaltyPoints, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Shop, (shop) => shop.loyaltyPoints, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop | null;

  @ManyToOne(() => Counter, (counter) => counter.loyaltyPoints, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'counter_id' })
  counter: Counter | null;

  @ManyToOne(() => User, (user) => user.createdLoyaltyPoints, {
    eager: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'created_by_user' })
  createdBy: User;

  @Column({ type: 'int', default: 0 })
  points_earned: number;

  @Column({ type: 'int', default: 0 })
  points_redeemed: number;

  @Column({ type: 'varchar', length: 50 , nullable: true})
  transaction_type: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_ref: string;

  @CreateDateColumn({ type: 'timestamp' })
  transaction_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'date', nullable: true })
  expiry_date: Date | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
