import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Shop } from '../shop/shop.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn()
  business_id: number;

  @Column({ unique: true })
  business_name: string;

  @Column()
  business_type: string;

  @Column({ nullable: true })
  tax_number: string;

  @Column({ nullable: true })
  gst_number: string;

  @Column({ nullable: true })
  registration_number: string;

  @Column('text', { nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({
    type: 'enum',
    enum: ['REGULAR', 'COMPOSITION', 'UNREGISTERED'],
    default: 'REGULAR',
  })
  gst_registration_type: string;

  @OneToMany(() => Shop, (shop) => shop.business, { cascade: true})
  shops: Shop[];
}