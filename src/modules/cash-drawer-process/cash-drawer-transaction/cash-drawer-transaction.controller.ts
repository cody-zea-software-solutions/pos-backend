import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CashDrawerTransactionService } from './cash-drawer-transaction.service';
import { CreateCashDrawerTransactionDto } from './dto/create-cash-drawer-transaction.dto';

@Controller('cash-drawer-transactions')
export class CashDrawerTransactionController {
  constructor(private readonly service: CashDrawerTransactionService) {}

  @Post()
  create(@Body() dto: CreateCashDrawerTransactionDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }
}
