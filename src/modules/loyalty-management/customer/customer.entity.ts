import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LoyaltyPoints } from '../loyalty-points/loyalty-points.entity';
import { CustomerRewards } from '../customer-rewards/customer-rewards.entity';
import { Transaction } from 'src/modules/pos-transactions/transactions/transaction.entity';
import { Refund } from 'src/modules/refund-process/refund/refund.entity';
export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHER = 'Other',
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  BUSINESS = 'BUSINESS',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  customer_id: number;

  @Column({ unique: true })
  qr_code: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date', nullable: true })
  birth_date: Date | null;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.OTHER,
  })
  gender: Gender;

  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  postal_code: string;

  @Column({ nullable: true })
  gst_number: string;

  @Column({
    type: 'enum',
    enum: CustomerType,
    default: CustomerType.INDIVIDUAL,
  })
  customer_type: CustomerType;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'int', default: 0 })
  total_points: number;

  @Column({ type: 'int', default: 0 })
  current_level: number;

  @Column({ type: 'timestamp', nullable: true })
  last_scan: Date | null;

  @Column({ nullable: true })
  preferred_shop: string;

  @Column({ nullable: true })
  preferred_counter: string;

  @Column({ type: 'int', default: 0 })
  total_visits: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total_spent: number;

  @OneToMany(() => LoyaltyPoints, (loyaltyPoints) => loyaltyPoints.customer)
  loyaltyPoints: LoyaltyPoints[];

  @OneToMany(() => CustomerRewards, (customerRewards) => customerRewards.customer)
  customerRewards: CustomerRewards[];

  @OneToMany(() => Transaction, (transaction) => transaction.shop)
  transactions: Transaction[];

  @OneToMany(() => Refund, (refund) => refund.customer)
  refunds: Refund[];

}
