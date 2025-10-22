import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopInventory } from './shop-inventory.entity';
import { Repository } from 'typeorm';
import { ShopService } from 'src/modules/shop/shop.service';
import { ProductService } from 'src/modules/product-management/product/product.service';
import { ProductVariationService } from 'src/modules/product-management/product-variation/product-variation.service';
import { BatchesService } from '../batches/batches.service';
import { UsersService } from 'src/modules/users/users.service';
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
}
