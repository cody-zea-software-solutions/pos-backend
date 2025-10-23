import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { GstTransactionsService } from './gst-transactions.service';
import { CreateGstTransactionDto } from './dto/create-gst-transaction.dto';
import { UpdateGstTransactionDto } from './dto/update-gst-transaction.dto';

@Controller('gst-transactions')
export class GstTransactionsController {
  constructor(private readonly gstTransactionsService: GstTransactionsService) {}

  @Post()
  create(@Body() dto: CreateGstTransactionDto) {
    return this.gstTransactionsService.create(dto);
  }

  @Get()
  findAll() {
    return this.gstTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.gstTransactionsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateGstTransactionDto) {
    return this.gstTransactionsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.gstTransactionsService.remove(id);
  }
}
