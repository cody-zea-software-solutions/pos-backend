import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Repository } from 'typeorm';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import { ProductService } from 'src/modules/product-management/product/product.service';
import { ProductVariationService } from 'src/modules/product-management/product-variation/product-variation.service';
import { CreatePurchaseOrderItemDto } from './dto/create-purchase-order-item.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';

@Injectable()
export class PurchaseOrderItemsService {
    constructor(
        @InjectRepository(PurchaseOrderItem)
        private readonly poItemRepo: Repository<PurchaseOrderItem>,
        private readonly poService: PurchaseOrdersService,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
    ) { }

    // Create a Purchase Order Item
    async create(dto: CreatePurchaseOrderItemDto): Promise<PurchaseOrderItem> {
        const po = await this.poService.findOne(dto.po_id);
        if (!po) throw new NotFoundException(`Purchase Order ${dto.po_id} not found`);

        const product = dto.product_id
            ? await this.productService.findOne(dto.product_id)
            : null;

        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;

        // Validate total_price only if unit_price is provided
        if (dto.unit_price !== undefined && dto.unit_price !== null) {
            const expectedTotal = Number(dto.unit_price) * Number(dto.quantity_ordered);
            if (dto.total_price !== expectedTotal) {
                throw new BadRequestException(
                    `Invalid total price. Expected ${expectedTotal.toFixed(
                        2,
                    )} (unit_price × quantity_ordered)`,
                );
            }
        }

        const {
            po_id,
            product_id,
            variation_id,
            ...data
        } = dto;

        const poItem = this.poItemRepo.create(data);
        poItem.purchase_order = po;
        if (product) poItem.product = product;
        if (variation) poItem.variation = variation;

        return this.poItemRepo.save(poItem);
    }

    // Get all Purchase Order Items
    async findAll(): Promise<PurchaseOrderItem[]> {
        return this.poItemRepo.find({
            relations: ['purchase_order', 'product', 'variation'],
        });
    }

    // Get one Purchase Order Item by ID
    async findOne(id: number): Promise<PurchaseOrderItem> {
        const item = await this.poItemRepo.findOne({
            where: { po_item_id: id },
            relations: ['purchase_order', 'product', 'variation'],
        });
        if (!item) throw new NotFoundException(`Purchase Order Item ${id} not found`);
        return item;
    }

    // Update Purchase Order Item
    async update(
        id: number,
        dto: UpdatePurchaseOrderItemDto,
    ): Promise<PurchaseOrderItem> {
        const item = await this.findOne(id);

        if (dto.product_id) {
            const product = await this.productService.findOne(dto.product_id);
            item.product = product;
        }

        if (dto.variation_id) {
            const variation = await this.variationService.findOne(dto.variation_id);
            item.variation = variation;
        }

        // Validate total_price only if a valid unit_price is available
        const qty = dto.quantity_ordered ?? item.quantity_ordered;
        const price = dto.unit_price ?? item.unit_price;

        if (price !== undefined && price !== null) {
            const expectedTotal = Number(qty) * Number(price);
            if (dto.total_price !== undefined && dto.total_price !== expectedTotal) {
                throw new BadRequestException(
                    `Invalid total price. Expected ${expectedTotal.toFixed(
                        2,
                    )} (unit_price × quantity_ordered)`,
                );
            }
        }

        Object.assign(item, dto);
        return this.poItemRepo.save(item);
    }

    // Delete Purchase Order Item
    async remove(id: number): Promise<void> {
        const item = await this.findOne(id);
        await this.poItemRepo.remove(item);
    }

    // Find all items for a specific Purchase Order
    async findByPurchaseOrder(po_id: number): Promise<PurchaseOrderItem[]> {
        return this.poItemRepo.find({
            where: { purchase_order: { po_id } },
            relations: ['product', 'variation'],
        });
    }

    async findByPoNumber(poNumber: string): Promise<PurchaseOrderItem[]> {
        // Find the Purchase Order first
        const po = await this.poService.findByPoNumber(poNumber);
        if (!po) {
            throw new NotFoundException(`Purchase Order with number '${poNumber}' not found`);
        }

        // Fetch all items for this PO
        return this.poItemRepo.find({
            where: { purchase_order: { po_id: po.po_id } },
            relations: ['purchase_order', 'product', 'variation'],
        });
    }

}
