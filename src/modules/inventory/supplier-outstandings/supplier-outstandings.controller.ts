import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { SupplierOutstandingsService } from './supplier-outstandings.service';
import { CreateSupplierOutstandingDto } from './dto/create-supplier-outstanding.dto';
import { UpdateSupplierOutstandingDto } from './dto/update-supplier-outstanding.dto';

@Controller('supplier-outstandings')
export class SupplierOutstandingsController {
    constructor(
        private readonly outstandingsService: SupplierOutstandingsService,
    ) { }

    @Post()
    create(@Body() dto: CreateSupplierOutstandingDto) {
        return this.outstandingsService.create(dto);
    }

    @Get()
    findAll() {
        return this.outstandingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.outstandingsService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateSupplierOutstandingDto,
    ) {
        return this.outstandingsService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.outstandingsService.remove(id);
    }

    @Get('supplier/:supplier_id')
    findBySupplier(@Param('supplier_id', ParseIntPipe) supplier_id: number) {
        return this.outstandingsService.findBySupplier(supplier_id);
    }
}
