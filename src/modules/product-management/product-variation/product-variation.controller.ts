import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

@Controller('product-variation')
export class ProductVariationController {
    constructor(private readonly variationService: ProductVariationService) { }

    @Post()
    create(@Body() dto: CreateProductVariationDto) {
        return this.variationService.create(dto);
    }

    @Get()
    findAll() {
        return this.variationService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.variationService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateProductVariationDto) {
        return this.variationService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.variationService.remove(+id);
    }

    // Search by name
    @Get('search/name/:name')
    findByName(@Param('name') name: string) {
        return this.variationService.findByName(name);
    }

    // Search by barcode
    @Get('search/barcode/:barcode')
    findByBarcode(@Param('barcode') barcode: string) {
        return this.variationService.findByBarcode(barcode);
    }
}
