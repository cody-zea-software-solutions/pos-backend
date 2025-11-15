import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { BundleTransactionItemsService } from './bundle-transaction-items.service';
import { CreateBundleTransactionItemsDto } from './dto/create-bundle-transaction-items.dto';
import { UpdateBundleItemDto } from '../bundle-items/dto/update-bundle-item.dto';

@Controller('bundle-transaction-items')
export class BundleTransactionItemsController {
  constructor(private readonly bundleTransactionItemsService: BundleTransactionItemsService) {}

  @Post()
  create(@Body() createDto: CreateBundleTransactionItemsDto) {
    return this.bundleTransactionItemsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.bundleTransactionItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bundleTransactionItemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateBundleItemDto) {
    return this.bundleTransactionItemsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bundleTransactionItemsService.remove(id);
  }
}
