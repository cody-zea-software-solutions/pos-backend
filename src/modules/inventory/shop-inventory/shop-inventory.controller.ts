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
import { ShopInventoryService } from './shop-inventory.service';
import { CreateShopInventoryDto } from './dto/create-shop-inventory.dto';
import { UpdateShopInventoryDto } from './dto/update-shop-inventory.dto';

@Controller('shop-inventory')
export class ShopInventoryController {
    constructor(private readonly inventoryService: ShopInventoryService) { }

    @Post()
    create(@Body() dto: CreateShopInventoryDto) {
        return this.inventoryService.create(dto);
    }

    @Get()
    findAll() {
        return this.inventoryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.inventoryService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateShopInventoryDto,
    ) {
        return this.inventoryService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.inventoryService.remove(id);
    }
}
