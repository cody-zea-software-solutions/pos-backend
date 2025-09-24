import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Controller('discount')
export class DiscountController {
    constructor(private readonly discountService: DiscountService) { }

    @Post()
    create(@Body() dto: CreateDiscountDto) {
        return this.discountService.create(dto);
    }

    @Get()
    findAll() {
        return this.discountService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.discountService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
        return this.discountService.update(+id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.discountService.remove(+id);
    }
}
