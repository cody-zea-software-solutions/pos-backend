import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('product_units')
export class ProductUnit {
  @PrimaryGeneratedColumn()
  unit_id: number;

  @Column()
  unit_name: string; // e.g., ml, kg, g, pcs

  @Column({ nullable: true })
  unit_symbol: string;

  @Column({
    type: 'enum',
    enum: ['WEIGHT', 'VOLUME', 'COUNT'],
  })
  unit_type: 'WEIGHT' | 'VOLUME' | 'COUNT';

  @Column('decimal', { precision: 10, scale: 6, nullable: true })
  base_unit_conversion: number;

  @Column({ default: false })
  is_base_unit: boolean;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Product, (product) => product.unit)
  products: Product[];
}