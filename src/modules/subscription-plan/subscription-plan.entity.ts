import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  plan_id: number;

  @Column()
  plan_name: string;

  @Column({ unique: true })
  plan_code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column('int', { default: 0 })
  max_products: number;

  @Column('int', { default: 0 })
  max_branches: number;

  @Column('int', { default: 0 })
  max_users: number;

  @Column({ default: false })
  has_loyalty_features: boolean;

  @Column({ default: false })
  has_inventory_management: boolean;

  @Column({ default: false })
  has_reporting_analytics: boolean;

  @Column({ default: false })
  has_multi_branch_pricing: boolean;

  @Column({ default: false })
  has_gst_management: boolean;

  @Column({ default: false })
  has_batch_tracking: boolean;

  @Column({ type: 'text', nullable: true })
  feature_list: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}