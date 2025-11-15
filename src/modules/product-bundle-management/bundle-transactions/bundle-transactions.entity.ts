import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductBundle } from '../product-bundles/product-bundle.entity';


@Entity('bundle_transactions')
export class BundleTransaction {

@PrimaryGeneratedColumn()
bundle_transaction_id: number;


@Column({ unique: true })
transaction_id: number;


@ManyToOne(() => ProductBundle)
@JoinColumn({ name: 'bundle_id' })
bundle: ProductBundle;


@Column()
quantity: number;


@Column('decimal', { precision: 10, scale: 2 })
bundle_price: number;


@Column('decimal', { precision: 10, scale: 2 })
total_individual_price: number;


@Column('decimal', { precision: 10, scale: 2 })
savings_amount: number;


@Column({ type: 'text', nullable: true })
customization_notes: string;


@Column({ default: false })
all_items_delivered: boolean;


@Column({ type: 'timestamp', nullable: true })
delivery_completion_date: Date;


@Column({ type: 'text', nullable: true })
fulfillment_notes: string;
}