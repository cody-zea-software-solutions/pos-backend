import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopInventory } from './shop-inventory.entity';
import { IsNull, Repository } from 'typeorm';
import { ShopService } from '../../shop/shop.service';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { BatchesService } from '../batches/batches.service';
import { UsersService } from '../../users/users.service';
import { ConsignorService } from '../consignor/consignor.service';
import { CreateShopInventoryDto } from './dto/create-shop-inventory.dto';
import { UpdateShopInventoryDto } from './dto/update-shop-inventory.dto';

@Injectable()
export class ShopInventoryService {
    constructor(
        @InjectRepository(ShopInventory)
        private readonly inventoryRepo: Repository<ShopInventory>,
        private readonly shopService: ShopService,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
        private readonly batchService: BatchesService,
        private readonly userService: UsersService,
        private readonly consignorService: ConsignorService,
    ) { }

    async create(dto: CreateShopInventoryDto): Promise<ShopInventory> {
        const shop = await this.shopService.findOne(dto.shop_id);
        const product = await this.productService.findOne(dto.product_id);
        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;
        const batch = dto.batch_id
            ? await this.batchService.findOne(dto.batch_id)
            : null;
        const user = dto.last_updated_by
            ? await this.userService.findOne(dto.last_updated_by)
            : null;

        const consignor = dto.consignor_id
            ? await this.consignorService.findOne(dto.consignor_id)
            : null;

        const existing = await this.inventoryRepo.findOne({
            where: {
                shop: { shop_id: dto.shop_id },
                product: { product_id: dto.product_id },
                variation: dto.variation_id ? { variation_id: dto.variation_id } : undefined,
                batch: dto.batch_id ? { batch_id: dto.batch_id } : undefined,
            },
        });

        if (existing) {
            throw new ConflictException('Inventory record already exists for this product/variation/batch.');
        }

        const { shop_id, product_id, variation_id, batch_id, last_updated_by, consignor_id, ...data } = dto;

        const inventory = this.inventoryRepo.create(data);

        inventory.shop = shop;
        inventory.product = product;
        if (variation) inventory.variation = variation;
        if (batch) inventory.batch = batch;
        if (user) inventory.last_updated_by = user;
        if (consignor) inventory.consignor = consignor;

        return this.inventoryRepo.save(inventory);
    }

    async findAll(): Promise<ShopInventory[]> {
        return this.inventoryRepo.find();
    }

    async findOne(id: number): Promise<ShopInventory> {
        const inventory = await this.inventoryRepo.findOne({
            where: { inventory_id: id },
        });
        if (!inventory) {
            throw new NotFoundException('Shop inventory not found');
        }
        return inventory;
    }

    async update(id: number, dto: UpdateShopInventoryDto): Promise<ShopInventory> {
        const inventory = await this.findOne(id);

        if (dto.shop_id) inventory.shop = await this.shopService.findOne(dto.shop_id);
        if (dto.product_id)
            inventory.product = await this.productService.findOne(dto.product_id);
        if (dto.variation_id)
            inventory.variation = await this.variationService.findOne(dto.variation_id);
        if (dto.batch_id)
            inventory.batch = await this.batchService.findOne(dto.batch_id);
        if (dto.last_updated_by)
            inventory.last_updated_by = await this.userService.findOne(dto.last_updated_by);
        if (dto.consignor_id)
            inventory.consignor = await this.consignorService.findOne(dto.consignor_id);

        Object.assign(inventory, dto);
        return this.inventoryRepo.save(inventory);
    }

    async remove(id: number): Promise<void> {
        const inventory = await this.findOne(id);
        await this.inventoryRepo.remove(inventory);
    }

    async findByProductAndVariation(
        shopId: number,
        productId: number,
        variationId?: number | null,
    ): Promise<ShopInventory | null> {
        // Build a base query
        const query = this.inventoryRepo
            .createQueryBuilder('inventory')
            .leftJoinAndSelect('inventory.shop', 'shop')
            .leftJoinAndSelect('inventory.product', 'product')
            .leftJoinAndSelect('inventory.variation', 'variation')
            .where('shop.shop_id = :shopId', { shopId })
            .andWhere('product.product_id = :productId', { productId });

        // If variation exists, include it in condition
        if (variationId) {
            query.andWhere('variation.variation_id = :variationId', { variationId });
        } else {
            // If no variation, ensure null variation match
            query.andWhere('inventory.variation IS NULL');
        }

        return query.getOne();
    }

    async deductStock(
        shopId: number,
        productId: number,
        variationId: number | null,
        quantityToDeduct: number,
    ): Promise<void> {
        if (quantityToDeduct <= 0) return;

        // Fetch all inventory records for the product (ordered by batch FIFO)
        const whereClause: any = {
            shop: { shop_id: shopId },
            product: { product_id: productId },
        };

        if (variationId) {
            whereClause.variation = { variation_id: variationId };
        } else {
            whereClause.variation = IsNull();
        }

        const inventories = await this.inventoryRepo.find({
            where: whereClause,
            relations: ['batch'],
            order: {
                batch: {
                    received_date: 'ASC',
                },
            },
        });

        if (!inventories.length) {
            throw new NotFoundException(
                `No inventory records found for shop ${shopId}, product ${productId}${variationId ? ` (variation ${variationId})` : ''
                }`,
            );
        }

        let remainingQty = quantityToDeduct;

        for (const inv of inventories) {
            if (remainingQty <= 0) break;

            const available = inv.available_quantity;
            if (available <= 0) continue;

            const deductQty = Math.min(available, remainingQty);
            inv.available_quantity -= deductQty;
            remainingQty -= deductQty;

            // Save updated shop inventory
            await this.inventoryRepo.save(inv);

            // Deduct from corresponding batch
            if (inv.batch) {
                await this.batchService.deductQuantity(inv.batch.batch_id, deductQty);
            }
        }

        // If still remaining after going through all batches → not enough stock
        if (remainingQty > 0) {
            throw new ConflictException(
                `Insufficient stock for product ${productId} in shop ${shopId}. Missing ${remainingQty} units.`,
            );
        }
    }
}
