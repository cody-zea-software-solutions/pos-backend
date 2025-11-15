import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceTransactionService } from './service-transactions.service';
import { CreateServiceTransactionDto } from './dto/create-service-transactions.dto';
import { UpdateServiceTransactionDto } from './dto/update-service-transactions.dto';

@Controller('service-transactions')
export class ServiceTransactionController {
  constructor(private readonly serviceTransactionService: ServiceTransactionService) {}

  @Post()
  create(@Body() dto: CreateServiceTransactionDto) {
    return this.serviceTransactionService.create(dto);
  }

  @Get()
  findAll() {
    return this.serviceTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.serviceTransactionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateServiceTransactionDto) {
    return this.serviceTransactionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.serviceTransactionService.remove(id);
  }
}
