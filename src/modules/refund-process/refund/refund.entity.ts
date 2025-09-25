import { Counter } from 'src/modules/counter/counter.entity';
import { Customer } from 'src/modules/loyalty-management/customer/customer.entity';
import { Transaction } from 'src/modules/pos-transactions/transactions/transaction.entity';
import { Shop } from 'src/modules/shop/shop.entity';
import { User } from 'src/modules/users/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { RefundItem } from '../refund-items/refund-item.entity';
import { RefundApproval } from '../refund-approvals/refund-approval.entity';

export enum RefundReason {
    DEFECTIVE = 'DEFECTIVE',
    WRONG_ITEM = 'WRONG_ITEM',
    CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
    POLICY_RETURN = 'POLICY_RETURN',
}

export enum RefundType {
    FULL = 'FULL',
    PARTIAL = 'PARTIAL',
    EXCHANGE = 'EXCHANGE',
}

export enum RefundMethod {
    CASH = 'CASH',
    CARD = 'CARD',
    STORE_CREDIT = 'STORE_CREDIT',
    EXCHANGE = 'EXCHANGE',
}

export enum RefundStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    PROCESSED = 'PROCESSED',
}

@Entity('refunds')
export class Refund {
    @PrimaryGeneratedColumn()
    refund_id: number;

    @Column({ unique: true })
    refund_number: string;

    @ManyToOne(() => Transaction, (trx) => trx.refunds, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'original_transaction_id' })
    original_transaction: Transaction;

    @ManyToOne(() => Shop, (shop) => shop.refunds, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'shop_id' })
    shop: Shop;

    @ManyToOne(() => Counter, (counter) => counter.refunds, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'counter_id' })
    counter: Counter

    @ManyToOne(() => Customer, (customer) => customer.refunds, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ type: 'timestamp' })
    refund_date: Date;

    @Column('decimal', { precision: 10, scale: 2 })
    refund_amount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    gst_refund_amount: number;

    @Column({ type: 'enum', enum: RefundReason })
    refund_reason: RefundReason;

    @Column({ type: 'enum', enum: RefundType })
    refund_type: RefundType;

    @Column({ type: 'enum', enum: RefundMethod })
    refund_method: RefundMethod;

    @ManyToOne(() => User, (user) => user.processed_refunds, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'processed_by_user' })
    processed_by: User

    @ManyToOne(() => User, (user) => user.authorized_refunds, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'authorized_by_user' })
    authorized_by: User;

    @Column({ type: 'enum', enum: RefundStatus, default: RefundStatus.PENDING })
    status: RefundStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ default: false })
    affects_loyalty_points: boolean;

    @Column({ type: 'int', nullable: true })
    loyalty_points_deducted: number;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: 'timestamp', nullable: true })
    approved_at: Date;

    @Column({ default: false })
    requires_gst_adjustment: boolean;

    @OneToMany(() => RefundItem, (item) => item.refund)
    items: RefundItem[];

    @OneToMany(() => RefundApproval, (approval) => approval.refund)
    approvals: RefundApproval[];
}