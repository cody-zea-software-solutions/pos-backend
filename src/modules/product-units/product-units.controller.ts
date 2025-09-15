import { Controller, Post, Get, Patch, Delete, Param, Body, Put } from '@nestjs/common';
import { ProductUnitsService } from './product-units.service';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';

@Controller('product-units')
export class ProductUnitsController {
    constructor(private readonly unitService: ProductUnitsService) { }

    @Post()
    create(@Body() dto: CreateProductUnitDto) {
        return this.unitService.create(dto);
    }

    @Get()
    findAll() {
        return this.unitService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.unitService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateProductUnitDto) {
        return this.unitService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.unitService.remove(+id);
    }
}
