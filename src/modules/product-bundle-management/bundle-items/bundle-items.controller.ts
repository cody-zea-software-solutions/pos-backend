import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    ParseIntPipe,
    Put,
} from '@nestjs/common';
import { BundleItemsService } from './bundle-items.service';
import { CreateBundleItemDto } from './dto/create-bundle-item.dto';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto';

@Controller('bundle-items')
export class BundleItemsController {
    constructor(private readonly bundleItemService: BundleItemsService) { }

    @Post()
    create(@Body() dto: CreateBundleItemDto) {
        return this.bundleItemService.create(dto);
    }

    @Get()
    findAll() {
        return this.bundleItemService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.bundleItemService.findOne(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBundleItemDto) {
        return this.bundleItemService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.bundleItemService.remove(id);
    }
}
