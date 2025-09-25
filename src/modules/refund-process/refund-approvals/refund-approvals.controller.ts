import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RefundApprovalsService } from './refund-approvals.service';
import { CreateRefundApprovalDto } from './dto/create-refund-approval.dto';

@Controller('refund-approvals')
export class RefundApprovalsController {
    constructor(private readonly approvalService: RefundApprovalsService) { }

    @Post()
    create(@Body() dto: CreateRefundApprovalDto) {
        return this.approvalService.create(dto);
    }

    @Get()
    findAll() {
        return this.approvalService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.approvalService.findOne(+id);
    }
}
