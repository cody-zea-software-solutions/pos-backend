import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Batch } from '../batches/batches.entity';
import { Shop } from '../../shop/shop.entity';
import { User } from '../../users/user.entity';

@Entity('batch_movements')
export class BatchMovement {
  @PrimaryGeneratedColumn()
  movement_id: number;

  @ManyToOne(() => Batch, (batch) => batch.batch_id, { eager: true })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @ManyToOne(() => Shop, (shop) => shop.batch_movements_from, { eager: true, nullable: true })
  @JoinColumn({ name: 'from_shop_id' })
  from_shop?: Shop;

  @ManyToOne(() => Shop, (shop) => shop.batch_movements_to, { eager: true, nullable: true })
  @JoinColumn({ name: 'to_shop_id' })
  to_shop?: Shop;

  @Column({ type: 'int' })
  quantity_moved: number;

  @Column({ nullable: true })
  movement_type: string; // e.g. "TRANSFER", "RETURN", "ADJUSTMENT"

  @Column({ nullable: true })
  reference_number: string;

  @CreateDateColumn({ name: 'movement_date' })
  movement_date: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'authorized_by_user' })
  authorized_by_user: User;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ nullable: true })
  status: string; // e.g. "PENDING", "APPROVED", "REJECTED"
}