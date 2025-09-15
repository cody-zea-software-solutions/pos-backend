import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductCategory } from '../product-category/product-category.entity';

@Entity('product_subcategories')
export class ProductSubcategory {
  @PrimaryGeneratedColumn()
  subcategory_id: number;

  @ManyToOne(() => ProductCategory, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory;

  @Column()
  subcategory_name: string;

  @Column({ unique: true })
  subcategory_code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: 0 })
  sort_order: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  default_hsn_code: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  default_gst_rate: number;
}