import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('loyalty_rewards')
export class LoyaltyReward {
  @PrimaryGeneratedColumn()
  reward_id: number;

  @Column()
  reward_name: string;

  @Column()
  reward_type: string;  // e.g., "voucher", "discount", "gift"

  @Column({ type: 'int' })
  points_required: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value_amount: number;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  valid_from: Date;

  @Column({ type: 'timestamp', nullable: true })
  valid_until: Date;

  @Column({nullable: true })
  usage_limit_per_customer: number;

  @Column({nullable: true })
  total_usage_limit: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({length: 100, nullable: true })
  reward_code: string;

  @Column({nullable: true })
  terms_conditions: string;

  @CreateDateColumn()
  created_at: Date;
}
