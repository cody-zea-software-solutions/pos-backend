import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RefundService } from './refund.service';
import { CreateRefundDto } from './dto/create-refund.dto';

@Controller('refund')
export class RefundController {
    constructor(private readonly refundService: RefundService) { }

    @Post()
    create(@Body() dto: CreateRefundDto) {
        return this.refundService.create(dto);
    }

    @Get()
    findAll() {
        return this.refundService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.refundService.findOne(+id);
    }
}
