import { ProductVariation } from '../../product-management/product-variation/product-variation.entity';
import { Product } from '../../product-management/product/product.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { User } from '../../users/user.entity';
import { Consignor } from '../consignor/consignor.entity';

@Entity('batches')
export class Batch {
    @PrimaryGeneratedColumn()
    batch_id: number;

    @Column({ unique: true })
    batch_number: string;

    @ManyToOne(() => Product, (product) => product.batches, { eager: true })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariation, (variation) => variation.batches, { eager: true, nullable: true })
    @JoinColumn({ name: 'variation_id' })
    variation: ProductVariation;

    @ManyToOne(() => Supplier, (supplier) => supplier.batches, { eager: true, nullable: true })
    @JoinColumn({ name: 'supplier_id' })
    supplier: Supplier;

    @Column({ type: 'date', nullable: true })
    manufacture_date: Date;

    @Column({ type: 'date', nullable: true })
    expiry_date: Date;

    @Column({ type: 'date', nullable: true })
    received_date: Date;

    @Column({ type: 'int', default: 0 })
    initial_quantity: number;

    @Column({ type: 'int', default: 0 })
    current_quantity: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    cost_price_per_unit: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    selling_price_per_unit: number;

    @Column({ nullable: true })
    status: string;

    @Column({ nullable: true })
    quality_status: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'boolean', default: false })
    is_consignment: boolean;

    @ManyToOne(() => Consignor, (consignor) => consignor.batches, { eager: true, nullable: true })
    @JoinColumn({ name: 'consignor_id' })
    consignor: Consignor;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'created_by_user' })
    created_by_user: User;
}