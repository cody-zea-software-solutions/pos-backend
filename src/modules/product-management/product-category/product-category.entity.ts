import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ProductGroup } from '../product-group/product-group.entity';
import { ProductSubcategory } from '../product-subcategory/product-subcategory.entity';
import { Product } from '../product/product.entity';

@Entity('product_categories')
export class ProductCategory {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ unique: true })
  category_code: string;

  @Column()
  category_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => ProductGroup, (group) => group.categories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: ProductGroup;

  // Self-referencing parent-child relationship
  @ManyToOne(() => ProductCategory, (cat) => cat.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_category_id' })
  parent: ProductCategory;

  @OneToMany(() => ProductCategory, (cat) => cat.parent)
  children: ProductCategory[];

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

  @OneToMany(() => ProductSubcategory, (sub) => sub.category)
  subcategories: ProductSubcategory[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

}