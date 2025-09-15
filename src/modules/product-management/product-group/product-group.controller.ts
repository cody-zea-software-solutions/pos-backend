import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
} from '@nestjs/common';
import { ProductGroupService } from './product-group.service';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';

@Controller('product-group')
export class ProductGroupController {
    constructor(private readonly productGroupService: ProductGroupService) { }

    @Post()
    create(@Body() dto: CreateProductGroupDto) {
        return this.productGroupService.create(dto);
    }

    @Get()
    findAll() {
        return this.productGroupService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productGroupService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductGroupDto,
    ) {
        return this.productGroupService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productGroupService.remove(id);
    }
}
