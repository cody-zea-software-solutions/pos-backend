import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RefundItemsService } from './refund-items.service';
import { CreateRefundItemDto } from './dto/create-refund-item.dto';

@Controller('refund-items')
export class RefundItemsController {
    constructor(private readonly itemService: RefundItemsService) { }

    @Post()
    create(@Body() dto: CreateRefundItemDto) {
        return this.itemService.create(dto);
    }

    @Get()
    findAll() {
        return this.itemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.itemService.findOne(+id);
    }
}
