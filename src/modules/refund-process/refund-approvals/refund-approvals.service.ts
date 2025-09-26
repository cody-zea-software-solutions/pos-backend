import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefundApproval } from './refund-approval.entity';
import { Repository } from 'typeorm';
import { RefundService } from '../refund/refund.service';
import { UsersService } from '../../users/users.service';
import { CreateRefundApprovalDto } from './dto/create-refund-approval.dto';

@Injectable()
export class RefundApprovalsService {
    constructor(
        @InjectRepository(RefundApproval)
        private readonly approvalRepo: Repository<RefundApproval>,
        private readonly refundService: RefundService,
        private readonly userService: UsersService,
    ) { }

    async create(dto: CreateRefundApprovalDto): Promise<RefundApproval> {
        const refund = await this.refundService.findOne(dto.refund_id);
        if (!refund) throw new NotFoundException(`Refund ${dto.refund_id} not found`);

        const approver = dto.approver_user_id
            ? await this.userService.findOne(dto.approver_user_id)
            : null;

        const { refund_id, approver_user_id, ...data } = dto;

        const approval = this.approvalRepo.create(data);
        approval.refund = refund;
        if (approver) approval.approver = approver;

        return this.approvalRepo.save(approval);
    }

    async findAll(): Promise<RefundApproval[]> {
        return this.approvalRepo.find({ relations: ['refund', 'approver'] });
    }

    async findOne(id: number): Promise<RefundApproval> {
        const approval = await this.approvalRepo.findOne({
            where: { approval_id: id },
            relations: ['refund', 'approver'],
        });
        if (!approval) throw new NotFoundException(`Refund Approval ${id} not found`);
        return approval;
    }
}
