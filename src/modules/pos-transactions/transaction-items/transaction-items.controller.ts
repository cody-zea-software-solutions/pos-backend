import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { TransactionItemsService } from './transaction-items.service';
import { CreateTransactionItemDto } from './dto/create-transaction-item.dto';

@Controller('transaction-items')
export class TransactionItemsController {
    constructor(private readonly itemService: TransactionItemsService) { }

    @Post()
    create(@Body() dto: CreateTransactionItemDto) {
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
