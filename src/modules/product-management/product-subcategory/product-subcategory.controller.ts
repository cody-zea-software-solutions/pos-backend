import { Controller, Put,  Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ProductSubcategoryService } from './product-subcategory.service';
import { CreateProductSubcategoryDto } from './dto/create-product-subcategory.dto';
import { UpdateProductSubcategoryDto } from './dto/update-product-subcategory.dto';

@Controller('product-subcategory')
export class ProductSubcategoryController {
    constructor(private readonly subcategoryService: ProductSubcategoryService) { }

    @Post()
    create(@Body() dto: CreateProductSubcategoryDto) {
        return this.subcategoryService.create(dto);
    }

    @Get()
    findAll() {
        return this.subcategoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.subcategoryService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateProductSubcategoryDto) {
        return this.subcategoryService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.subcategoryService.remove(+id);
    }
}
