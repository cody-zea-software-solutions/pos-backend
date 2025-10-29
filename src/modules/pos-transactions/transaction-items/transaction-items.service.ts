import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionItem } from './transaction-item.entity';
import { Repository } from 'typeorm';
import { CreateTransactionItemDto } from './dto/create-transaction-item.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { ShopInventoryService } from '../../inventory/shop-inventory/shop-inventory.service';

@Injectable()
export class TransactionItemsService {
    constructor(
        @InjectRepository(TransactionItem)
        private readonly itemRepo: Repository<TransactionItem>,
        private readonly transactionService: TransactionsService,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
        private readonly consignorService: ConsignorService,
        private readonly shopInventoryService: ShopInventoryService,
    ) { }

    async create(dto: CreateTransactionItemDto): Promise<TransactionItem> {
        // Validate parent transaction
        const transaction = dto.transaction_id
            ? await this.transactionService.findOne(dto.transaction_id)
            : null;
        if (!transaction) {
            throw new NotFoundException(`Transaction ${dto.transaction_id} not found`);
        }

        // Validate product
        const product = dto.product_id
            ? await this.productService.findOne(dto.product_id)
            : null;

        // Validate variation
        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;

        // Validate consignor
        const consignor = dto.consignor_id
            ? await this.consignorService.findOne(dto.consignor_id)
            : null;

        // Ensure shop inventory exists for this product (and variation if applicable)
        const shopId = transaction.shop?.shop_id;
        if (!shopId) {
            throw new NotFoundException(`Transaction ${transaction.transaction_id} has no associated shop`);
        }

        // Find inventory record for this product/variation
        // const inventoryRecord = await this.shopInventoryService.findByProductAndVariation(
        //     shopId,
        //     product?.product_id,
        //     variation?.variation_id || null,
        // );

        // if (!inventoryRecord) {
        //     throw new NotFoundException(
        //         `No inventory record found in shop ${shopId} for product ${product?.product_name}${variation ? ` (variation: ${variation?.variation_name})` : ''
        //         }`
        //     );
        // }

        // Destructure DTO
        const { transaction_id, product_id, variation_id, consignor_id, ...data } = dto;

        // Create new entity
        const item = this.itemRepo.create(data);

        // Assign relations
        item.transaction = transaction;
        if (product) item.product = product;
        if (variation) item.variation = variation;
        if (consignor) item.consignor = consignor;

        // Save transaction item
        const savedItem = await this.itemRepo.save(item);

        if (!product?.product_id) {
            throw new BadRequestException('Product ID is missing');
        }

        // Deduct quantity from shop inventory
        await this.shopInventoryService.deductStock(
            shopId,
            product.product_id,
            variation?.variation_id || null,
            dto.quantity,
        );

        return savedItem;
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
