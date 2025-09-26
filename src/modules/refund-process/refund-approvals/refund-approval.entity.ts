import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Refund } from '../refund/refund.entity';
import { User } from '../../users/user.entity';

export enum ApprovalStatus {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum ApprovalLevel {
    SUPERVISOR = 'SUPERVISOR',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN',
}

@Entity('refund_approvals')
export class RefundApproval {
    @PrimaryGeneratedColumn()
    approval_id: number;

    @ManyToOne(() => Refund, (refund) => refund.approvals, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'refund_id' })
    refund: Refund;

    @ManyToOne(() => User, (user) => user.refund_approvals, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'approver_user_id' })
    approver: User;

    @CreateDateColumn()
    approval_date: Date;

    @Column({ type: 'enum', enum: ApprovalStatus })
    approval_status: ApprovalStatus;

    @Column({ type: 'text', nullable: true })
    approval_notes: string;

    @Column({ type: 'enum', enum: ApprovalLevel })
    approval_level: ApprovalLevel;
}