import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../loyalty-management/customer/customer.entity';
import { User } from '../users/user.entity';

@Entity('gift_cards')
export class GiftCard {
  @PrimaryGeneratedColumn()
  gift_card_id: number;

  @Column({ unique: true })
  card_number: string;

  @Column('decimal', { precision: 10, scale: 2 })
  initial_value: number;

  @Column('decimal', { precision: 10, scale: 2 })
  current_balance: number;

  @Column({ type: 'datetime' })
  issue_date: Date;

  @Column({ type: 'datetime' })
  expiry_date: Date;

  @ManyToOne(() => Customer, (customer) => customer.gift_cards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'issued_to_customer' })
  issued_to: Customer;

  @ManyToOne(() => User, (user) => user.issued_gift_cards, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'issued_by_user' })
  issued_by: User;

  @Column({ default: 'ACTIVE' })
  status: string;

  @Column({ type: 'datetime', nullable: true })
  last_used: Date;
}