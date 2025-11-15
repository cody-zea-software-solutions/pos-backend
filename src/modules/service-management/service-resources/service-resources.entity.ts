import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Shop } from '../../shop/shop.entity';

@Entity('service_resources')
export class ServiceResource {
    
  @PrimaryGeneratedColumn()
  resource_id: number;

  @Column({ unique: true })
  resource_code: string;

  @Column()
  resource_name: string;

  @Column({ type: 'enum', enum: ['EQUIPMENT', 'ROOM', 'TOOL', 'CONSUMABLE'] })
  resource_type: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Shop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shop_id' })
  shop: Shop;

  @Column({ default: false })
  is_shared_resource: boolean;

  @Column({ type: 'int', nullable: true })
  max_concurrent_usage: number;

  @Column({ nullable: true })
  maintenance_schedule: string;

  @Column({ type: 'timestamp', nullable: true })
  last_maintenance: Date;

  @Column({ type: 'timestamp', nullable: true })
  next_maintenance_due: Date;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourly_cost: number;

  @Column({ type: 'text', nullable: true })
  operating_instructions: string;
}
