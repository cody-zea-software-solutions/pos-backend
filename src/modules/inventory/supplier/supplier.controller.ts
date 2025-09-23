import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Controller('supplier')
export class SupplierController {
    constructor(private readonly suppliersService: SupplierService) { }

    @Post()
    create(@Body() createDto: CreateSupplierDto) {
        return this.suppliersService.create(createDto);
    }

    @Get()
    findAll() {
        return this.suppliersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.suppliersService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateDto: UpdateSupplierDto) {
        return this.suppliersService.update(+id, updateDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.suppliersService.remove(+id);
    }
}
