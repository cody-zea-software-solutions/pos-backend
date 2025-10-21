import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { GrnItemsService } from './grn-items.service';
import { CreateGrnItemDto } from './dto/create-grn-item.dto';
import { UpdateGrnItemDto } from './dto/update-grn-item.dto';

@Controller('grn-items')
export class GrnItemsController {
    constructor(private readonly grnItemsService: GrnItemsService) { }

    // ------------------------------
    // Create GRN Item
    // ------------------------------
    @Post()
    async create(@Body() dto: CreateGrnItemDto) {
        return await this.grnItemsService.create(dto);
    }

    // ------------------------------
    // Get All GRN Items (optionally filter by grn_id)
    // ------------------------------
    @Get()
    async findAll(@Query('grn_id') grnId?: number) {
        if (grnId) {
            return await this.grnItemsService.findByGrn(grnId);
        }
        return await this.grnItemsService.findAll();
    }

    // ------------------------------
    // Get Single GRN Item by ID
    // ------------------------------
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.grnItemsService.findOne(id);
    }

    // ------------------------------
    // Update GRN Item
    // ------------------------------
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateGrnItemDto,
    ) {
        return await this.grnItemsService.update(id, dto);
    }

    // ------------------------------
    // Find GRN Items by GRN Number
    // ------------------------------
    @Get('find/by-grn-number/:grnNumber')
    async findByGrnNumber(@Param('grnNumber') grnNumber: string) {
        return await this.grnItemsService.findByGrnNumber(grnNumber);
    }

    // ------------------------------
    // Delete GRN Item
    // ------------------------------
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.grnItemsService.remove(id);
    }
}
