import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionItem } from './transaction-item.entity';
import { Repository } from 'typeorm';
import { CreateTransactionItemDto } from './dto/create-transaction-item.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';

@Injectable()
export class TransactionItemsService {
    constructor(
        @InjectRepository(TransactionItem)
        private readonly itemRepo: Repository<TransactionItem>,
        private readonly transactionService: TransactionsService,
                private readonly productService: ProductService,
                private readonly variationService: ProductVariationService,
                private readonly consignorService: ConsignorService,
    ) { }

    async create(dto: CreateTransactionItemDto): Promise<TransactionItem> {
        // validate parent transaction
        const transaction = dto.transaction_id
            ? await this.transactionService.findOne(dto.transaction_id)
            : null;
        if (!transaction) {
            throw new NotFoundException(`Transaction ${dto.transaction_id} not found`);
        }

        // validate product
        const product = dto.product_id
            ? await this.productService.findOne(dto.product_id)
            : null;

        // validate variation
        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;

        // validate consignor
        const consignor = dto.consignor_id
            ? await this.consignorService.findOne(dto.consignor_id)
            : null;

        // destructure to avoid passing raw IDs to entity
        const {
            transaction_id,
            product_id,
            variation_id,
            consignor_id,
            ...data
        } = dto;

        // create entity
        const item = this.itemRepo.create(data);

        // assign relations
        item.transaction = transaction;
        if (product) item.product = product;
        if (variation) item.variation = variation;
        if (consignor) item.consignor = consignor;

        return this.itemRepo.save(item);
    }

    async findAll(): Promise<TransactionItem[]> {
        return this.itemRepo.find({
            relations: ['transaction', 'product', 'variation', 'consignor'],
        });
    }

    async findOne(id: number): Promise<TransactionItem> {
        const item = await this.itemRepo.findOne({
            where: { item_id: id },
            relations: ['transaction', 'product', 'variation', 'consignor'],
        });
        if (!item) {
            throw new NotFoundException(`TransactionItem ${id} not found`);
        }
        return item;
    }
}
