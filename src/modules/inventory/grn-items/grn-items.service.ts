import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GRNItem } from './grn-item.entity';
import { Repository } from 'typeorm';
import { GoodsReceivedNotesService } from '../goods-received-notes/goods-received-notes.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { CreateGrnItemDto } from './dto/create-grn-item.dto';
import { UpdateGrnItemDto } from './dto/update-grn-item.dto';

@Injectable()
export class GrnItemsService {
    constructor(
        @InjectRepository(GRNItem)
        private readonly grnItemRepo: Repository<GRNItem>,
        private readonly grnService: GoodsReceivedNotesService,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
    ) { }

    // -----------------------
    // Create GRN Item
    // -----------------------
    async create(dto: CreateGrnItemDto): Promise<GRNItem> {
        const grn = await this.grnService.findOne(dto.grn_id);
        if (!grn) throw new NotFoundException(`GRN ${dto.grn_id} not found`);

        const product = dto.product_id
            ? await this.productService.findOne(dto.product_id)
            : null;

        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;

        const expectedTotal = Number(dto.unit_cost) * Number(dto.quantity_accepted);
        if (dto.total_cost !== expectedTotal) {
            throw new BadRequestException(
                `Invalid total cost. Expected ${expectedTotal.toFixed(2)} (unit_cost × quantity_accepted).`,
            );
        }

        const { grn_id, product_id, variation_id, ...data } = dto;
        const grnItem = this.grnItemRepo.create(data);

        grnItem.grn = grn;
        if (product) grnItem.product = product;
        if (variation) grnItem.variation = variation;

        return this.grnItemRepo.save(grnItem);
    }

    // -----------------------
    // Find all
    // -----------------------
    async findAll(): Promise<GRNItem[]> {
        return this.grnItemRepo.find({
            relations: ['grn', 'product', 'variation'],
        });
    }

    // -----------------------
    // Find one
    // -----------------------
    async findOne(id: number): Promise<GRNItem> {
        const item = await this.grnItemRepo.findOne({
            where: { grn_item_id: id },
            relations: ['grn', 'product', 'variation'],
        });
        if (!item) throw new NotFoundException(`GRN Item ${id} not found`);
        return item;
    }

    // -----------------------
    // Update
    // -----------------------
    async update(id: number, dto: UpdateGrnItemDto): Promise<GRNItem> {
        const item = await this.findOne(id);

        if (dto.product_id) {
            const product = await this.productService.findOne(dto.product_id);
            item.product = product;
        }

        if (dto.variation_id) {
            const variation = await this.variationService.findOne(dto.variation_id);
            item.variation = variation;
        }

        const qty = dto.quantity_accepted ?? item.quantity_accepted;
        const unitCost = dto.unit_cost ?? item.unit_cost;

        const expectedTotal = Number(unitCost) * Number(qty);
        if (dto.total_cost !== undefined && dto.total_cost !== expectedTotal) {
            throw new BadRequestException(
                `Invalid total cost. Expected ${expectedTotal.toFixed(2)} (unit_cost × quantity_accepted).`,
            );
        }

        Object.assign(item, dto);
        return this.grnItemRepo.save(item);
    }

    // -----------------------
    // Delete
    // -----------------------
    async remove(id: number): Promise<void> {
        const item = await this.findOne(id);
        await this.grnItemRepo.remove(item);
    }

    // -----------------------
    // Find by GRN
    // -----------------------
    async findByGrn(grn_id: number): Promise<GRNItem[]> {
        return this.grnItemRepo.find({
            where: { grn: { grn_id } },
            relations: ['product', 'variation'],
        });
    }

    // -----------------------
    // Find by GRN Number
    // -----------------------
    async findByGrnNumber(grnNumber: string): Promise<GRNItem[]> {
        // Find the GRN first
        const grn = await this.grnService.findByGrnNumber(grnNumber);
        if (!grn) {
            throw new NotFoundException(`GRN with number '${grnNumber}' not found`);
        }

        // Fetch all items for that GRN
        return this.grnItemRepo.find({
            where: { grn: { grn_id: grn.grn_id } },
            relations: ['grn', 'product', 'variation'],
        });
    }

}
