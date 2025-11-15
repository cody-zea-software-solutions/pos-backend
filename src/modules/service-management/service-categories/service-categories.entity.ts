import { Entity, PrimaryGeneratedColumn,  OneToMany,Column, ManyToOne, JoinColumn } from 'typeorm';
@Entity('service_categories')
export class ServiceCategory {

  @PrimaryGeneratedColumn()
  service_category_id: number;

  @Column({})
  group_id: number

  @Column({ length: 100 })
  category_name: string;

  @Column({ unique: true, length: 50 })
  category_code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

   // Self-referencing parent-child relationship
    @ManyToOne(() => ServiceCategory, (cat) => cat.children, {
      nullable: true,
      onDelete: 'SET NULL',
    })
    @JoinColumn({ name: 'parent_service_category_id' })
    parent: ServiceCategory;
  
    @OneToMany(() => ServiceCategory, (cat) => cat.parent)
    children: ServiceCategory[];

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true, length: 50 })
  default_hsn_code: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  default_gst_rate: number;

  @Column({ nullable: true, length: 20 })
  category_color: string;

  @Column({ nullable: true, length: 100 })
  category_icon: string;
}
