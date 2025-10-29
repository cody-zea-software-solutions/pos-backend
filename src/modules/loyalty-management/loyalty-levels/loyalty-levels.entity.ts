import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,OneToMany } from 'typeorm';
import { Customer } from '../customer/customer.entity'; 

@Entity('loyalty_levels')
export class LoyaltyLevel {
  @PrimaryGeneratedColumn()
  level_id: number;

  @Column({ type: 'varchar', length: 100 })
  level_name: string;

  @Column({ type: 'int' })
  min_points_required: number;

  @Column({ type: 'int' })
  max_points_limit: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  points_rate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discount_percentage: number;

  @Column({ type: 'text', nullable: true })
  benefits_description: string;

  @Column({  nullable: true })
  level_color: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  level_icon: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Customer, (customer) => customer.current_level_id)
  customers: Customer[];
}
