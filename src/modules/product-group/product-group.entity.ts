import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductCategory } from '../product-category/product-category.entity';

@Entity('product_groups')
export class ProductGroup {
  @PrimaryGeneratedColumn()
  group_id: number;

  @Column({ unique: true })
  group_code: string;

  @Column()
  group_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  group_color: string;

  @Column({ nullable: true })
  group_icon: string;

  @Column({ nullable: true })
  default_hsn_code: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  default_gst_rate: number;

  @OneToMany(() => ProductCategory, (cat) => cat.group)
  categories: ProductCategory[];

}