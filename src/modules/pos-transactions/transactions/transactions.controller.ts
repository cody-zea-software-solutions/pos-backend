import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionService: TransactionsService) { }

    @Post()
    create(@Body() dto: CreateTransactionDto) {
        return this.transactionService.create(dto);
    }

    @Get()
    findAll() {
        return this.transactionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionService.findOne(+id);
    }

    @Get('receipt/:receiptNumber')
    findByReceiptNumber(@Param('receiptNumber') receiptNumber: string) {
        return this.transactionService.findByReceiptNumber(receiptNumber);
    }
}
