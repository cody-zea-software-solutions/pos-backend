import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Business } from '../business/business.entity';
import { User } from '../users/user.entity';
import { Counter } from '../counter/counter.entity';
import { Shift } from '../shift/shift.entity';
import { LoyaltyPoints } from '../loyalty-management/loyalty-points/loyalty-points.entity';
import { CustomerRewards } from '../loyalty-management/customer-rewards/customer-rewards.entity';
import { Promotion } from '../promotion/promotion.entity';
@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn()
  shop_id: number;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  business: Business;

  @Column()
  shop_name: string;

  @Column({ unique: true })
  shop_code: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({ nullable: true })
  gst_number: string;

  @Column({ type: 'time', nullable: true })
  opening_time: string;

  @Column({ type: 'time', nullable: true })
  closing_time: string;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  tax_rate: number;

  @Column({ nullable: true })
  currency_code: string;

  @Column('text', { nullable: true })
  branding_config: string;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  enable_gst_billing: boolean;

  @Column({
    type: 'enum',
    enum: ['TAXABLE', 'EXEMPT', 'ZERO_RATED'],
    default: 'TAXABLE',
  })
  default_gst_treatment: string;

  @OneToMany(() => User, (user) => user.assigned_shop, { cascade: true })
  users: User[];

  @OneToMany(() => Counter, (counter) => counter.shop, { cascade: true })
  counters: Counter[];

  @OneToMany(() => Shift, (shift) => shift.shop)
  shifts: Shift[];

  @OneToMany(() => LoyaltyPoints, (loyaltyPoints) => loyaltyPoints.shop)
  loyaltyPoints: LoyaltyPoints[];

  @OneToMany(() => CustomerRewards, (customerRewards) => customerRewards.shop)
  customerRewards: CustomerRewards[];

  @OneToMany(() => Promotion, (promotion) => promotion.shop)
  promotions: Promotion[];
}