import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ConsignmentStockService } from './consignment-stock.service';
import { CreateConsignmentStockDto } from './dto/create-consignment-stock.dto';
import { UpdateConsignmentStockDto } from './dto/update-consignment-stock.dto';

@Controller('consignment-stock')
export class ConsignmentStockController {
  constructor(private readonly consignmentStockService: ConsignmentStockService) { }

  // Create new consignment record
  @Post()
  async create(@Body() dto: CreateConsignmentStockDto) {
    return this.consignmentStockService.create(dto);
  }

  // Get all consignments
  @Get()
  async findAll() {
    return this.consignmentStockService.findAll();
  }

  // Get single consignment by ID
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consignmentStockService.findOne(id);
  }

  // Update consignment
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsignmentStockDto,
  ) {
    return this.consignmentStockService.update(id, dto);
  }

  // Delete consignment
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.consignmentStockService.remove(id);
    return { message: `Consignment record ${id} deleted successfully` };
  }
}
