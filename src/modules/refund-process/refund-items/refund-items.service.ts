import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefundItem } from './refund-item.entity';
import { Repository } from 'typeorm';
import { RefundService } from '../refund/refund.service';
import { TransactionsService } from '../../pos-transactions/transactions/transactions.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { CreateRefundItemDto } from './dto/create-refund-item.dto';
import { TransactionItemsService } from '../../pos-transactions/transaction-items/transaction-items.service';

@Injectable()
export class RefundItemsService {
    constructor(
        @InjectRepository(RefundItem)
        private readonly itemRepo: Repository<RefundItem>,
        private readonly refundService: RefundService,
        private readonly trxItemService: TransactionItemsService,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
        private readonly consignorService: ConsignorService,
    ) { }

    async create(dto: CreateRefundItemDto): Promise<RefundItem> {
        const refund = await this.refundService.findOne(dto.refund_id);
        if (!refund) throw new NotFoundException(`Refund ${dto.refund_id} not found`);

        const original_item = dto.original_item_id ? await this.trxItemService.findOne(dto.original_item_id) : null;
        const product = dto.product_id ? await this.productService.findOne(dto.product_id) : null;
        const variation = dto.variation_id ? await this.variationService.findOne(dto.variation_id) : null;
        const consignor = dto.consignor_id ? await this.consignorService.findOne(dto.consignor_id) : null;

        const { refund_id, original_item_id, product_id, variation_id, consignor_id, ...data } = dto;

        const item = this.itemRepo.create(data);
        item.refund = refund;
        if (original_item) item.original_item = original_item;
        if (product) item.product = product;
        if (variation) item.variation = variation;
        if (consignor) item.consignor = consignor;

        return this.itemRepo.save(item);
    }

    async findAll(): Promise<RefundItem[]> {
        return this.itemRepo.find({ relations: ['refund', 'original_item', 'product', 'variation', 'consignor'] });
    }

    async findOne(id: number): Promise<RefundItem> {
        const item = await this.itemRepo.findOne({ where: { refund_item_id: id }, relations: ['refund', 'original_item', 'product', 'variation', 'consignor'] });
        if (!item) throw new NotFoundException(`Refund Item ${id} not found`);
        return item;
    }
}
