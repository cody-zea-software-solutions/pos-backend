import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from '../../service-management/services/service.entity';
import { BundleItem } from '../bundle-items/bundle-item.entity';
import { ProductBundle } from '../product-bundles/product-bundle.entity';
import { BundleTransaction } from '../bundle-transactions/bundle-transactions.entity';
@Entity('bundle_transaction_items')
export class BundleTransactionItems {
  @PrimaryGeneratedColumn()
  bundle_transaction_item_id: number;

  
  @ManyToOne(() => BundleTransaction) // unidirectional
  @JoinColumn({ name: 'bundle_transaction_id' })
  bundle_transactions: BundleTransaction;

  
  @ManyToOne(() => BundleItem) // unidirectional
  @JoinColumn({ name: 'bundle_item_id' })
  bundle_items: BundleItem;

  
  @ManyToOne(() => ProductBundle) // unidirectional
  @JoinColumn({ name: 'bundle_id' })
  product_bundles: ProductBundle;

  
  @ManyToOne(() => Service) // unidirectional
  @JoinColumn({ name: 'service_id' })
  service: Service;

  @Column()
  variation_id: number;

  @Column()
  appointment_id: number;
 
  @Column({ type: 'enum', enum: ['PRODUCT', 'SERVICE'], })
   item_type: string;
  
  @Column({ nullable: true })//
  quantity_included: number; 

  @Column({ nullable: true })//
  quantity_delivered: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  item_price: number;

  @Column({ type: 'enum', enum: ['PENDING', 'DELIVERED', 'SUBSTITUTED', 'CANCELLED'] })
  fulfillment_status: string;

  @Column({ type: 'text', nullable: true })
  substitution_details: string;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date;

}
