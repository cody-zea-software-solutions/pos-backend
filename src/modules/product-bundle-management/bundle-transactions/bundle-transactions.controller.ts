import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BundleTransactionService } from './bundle-transactions.service';
import { CreateBundleTransactionDto } from './dto/create-bundle-transaction.dto';
import { UpdateBundleTransactionDto } from './dto/update-budle-transaction.dto';

@Controller('bundle-transactions')
export class BundleTransactionController {
  constructor(
    private readonly bundleTransactionService: BundleTransactionService,
  ) {}

  @Post()
  create(@Body() dto: CreateBundleTransactionDto) {
    return this.bundleTransactionService.create(dto);
  }

  @Get()
  findAll() {
    return this.bundleTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bundleTransactionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBundleTransactionDto,
  ) {
    return this.bundleTransactionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bundleTransactionService.remove(id);
  }
}
