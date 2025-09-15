import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../customer/customer.entity';
import { LoyaltyReward } from '../loyalty-rewards/loyalty-rewards.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';
import { User } from '../../users/user.entity';

@Entity('customer_rewards')
export class CustomerRewards {
  @PrimaryGeneratedColumn()
  customer_reward_id: number;

  @ManyToOne(() => Customer, (customer) => customer.customerRewards, { eager: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => LoyaltyReward, (reward) => reward.customerRewards, { eager: true })
  @JoinColumn({ name: 'reward_id' })
  reward: LoyaltyReward;

  @Column({ type: 'datetime', nullable: true })
  redeemed_date: Date;

  @Column({ type: 'datetime', nullable: true })
  used_date: Date;

  @ManyToOne(() => Shop, (shop) => shop.customerRewards, { eager: true })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @ManyToOne(() => Counter, (counter) => counter.customerRewards, { eager: true })
  @JoinColumn({ name: 'counter_id' })
  counter: Counter;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  transaction_ref: string;

  @ManyToOne(() => User, (user) => user.processedRewards, { eager: true })
  @JoinColumn({ name: 'processed_by_user' })
  processed_by_user: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
