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
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';

@Controller('purchase-order-items')
export class PurchaseOrderItemsController {
    constructor(
        private readonly purchaseOrderItemsService: PurchaseOrderItemsService,
    ) { }

    // Create new PO item
    @Post()
    async create(@Body() dto: CreatePurchaseOrderItemDto) {
        return await this.purchaseOrderItemsService.create(dto);
    }

    // Get all PO items (optionally filter by po_id)
    @Get()
    async findAll(@Query('po_id') poId?: number) {
        if (poId) {
            return await this.purchaseOrderItemsService.findByPurchaseOrder(poId);
        }
        return await this.purchaseOrderItemsService.findAll();
    }

    // Get single PO item by ID
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.purchaseOrderItemsService.findOne(id);
    }

    // Update PO item
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePurchaseOrderItemDto,
    ) {
        return await this.purchaseOrderItemsService.update(id, dto);
    }

    // Find PO items by Purchase Order number
    @Get('find/by-po-number/:poNumber')
    async findByPoNumber(@Param('poNumber') poNumber: string) {
        return await this.purchaseOrderItemsService.findByPoNumber(poNumber);
    }

    // Delete PO item
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.purchaseOrderItemsService.remove(id);
    }
}
