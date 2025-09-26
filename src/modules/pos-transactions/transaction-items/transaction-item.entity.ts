import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Product } from '../../product-management/product/product.entity';
import { ProductVariation } from '../../product-management/product-variation/product-variation.entity';
import { Consignor } from '../../inventory/consignor/consignor.entity';
import { RefundItem } from '../../refund-process/refund-items/refund-item.entity';

@Entity('transaction_items')
export class TransactionItem {
    @PrimaryGeneratedColumn()
    item_id: number;

    @ManyToOne(() => Transaction, (trx) => trx.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;

    @ManyToOne(() => Product, (product) => product.transactionItems, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => ProductVariation, (variation) => variation.transactionItems, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'variation_id' })
    variation: ProductVariation;

    // should reference inventory batch when applicable
    @Column({ nullable: true })
    batch_id: number;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unit_price: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount_amount: number;

    @Column('decimal', { precision: 5, scale: 2, default: 0 })
    tax_rate: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax_amount: number;

    @Column('decimal', { precision: 10, scale: 2 })
    line_total: number;

    @Column({ nullable: true })
    item_type: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ default: false })
    is_consignment: boolean;

    @ManyToOne(() => Consignor, (consignor) => consignor.transactionItems, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'consignor_id' })
    consignor: Consignor;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    consignment_commission: number;

    @Column({ nullable: true })
    hsn_code: string;

    @Column('decimal', { precision: 5, scale: 2, nullable: true })
    gst_rate: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    cgst_amount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    sgst_amount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    igst_amount: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    cess_amount: number;

    // should reference pricing group when applicable
    @Column({ nullable: true })
    pricing_group_id: number;

    @Column({ nullable: true })
    price_source: string; // BASE / SHOP_SPECIFIC / GROUP_BASED / DYNAMIC

    @OneToMany(() => RefundItem, (item) => item.original_item)
    refund_items: RefundItem[];
}