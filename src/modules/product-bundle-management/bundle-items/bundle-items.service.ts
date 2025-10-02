import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BundleItem } from './bundle-item.entity';
import { Repository } from 'typeorm';
import { ProductBundlesService } from '../product-bundles/product-bundles.service';
import { ProductService } from 'src/modules/product-management/product/product.service';
import { ProductVariationService } from 'src/modules/product-management/product-variation/product-variation.service';
import { ServicesService } from 'src/modules/service-management/services/services.service';
import { CreateBundleItemDto } from './dto/create-bundle-item.dto';
import { UpdateBundleItemDto } from './dto/update-bundle-item.dto';

@Injectable()
export class BundleItemsService {
    constructor(
        @InjectRepository(BundleItem)
        private readonly itemRepo: Repository<BundleItem>,
        private readonly bundleService: ProductBundlesService,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
        private readonly serviceService: ServicesService,
    ) { }

    async create(dto: CreateBundleItemDto): Promise<BundleItem> {
        const bundle = await this.bundleService.findOne(dto.bundle_id);
        if (!bundle) throw new NotFoundException(`Bundle ${dto.bundle_id} not found`);

        const product = dto.product_id
            ? await this.productService.findOne(dto.product_id)
            : null;

        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;

        const service = dto.service_id
            ? await this.serviceService.findOne(dto.service_id)
            : null;

        const { bundle_id, product_id, variation_id, service_id, ...data } = dto;

        const item = this.itemRepo.create(data);
        item.bundle = bundle;
        if (product) item.product = product;
        if (variation) item.variation = variation;
        if (service) item.service = service;

        return this.itemRepo.save(item);
    }

    async findAll(): Promise<BundleItem[]> {
        return this.itemRepo.find({
            relations: ['bundle', 'product', 'variation', 'service'],
        });
    }

    async findOne(id: number): Promise<BundleItem> {
        const item = await this.itemRepo.findOne({
            where: { bundle_item_id: id },
            relations: ['bundle', 'product', 'variation', 'service'],
        });
        if (!item) throw new NotFoundException(`Bundle Item ${id} not found`);
        return item;
    }

    async update(id: number, dto: UpdateBundleItemDto): Promise<BundleItem> {
        const item = await this.findOne(id);

        if (dto.bundle_id) {
            item.bundle = await this.bundleService.findOne(dto.bundle_id);
        }
        if (dto.product_id) {
            item.product = await this.productService.findOne(dto.product_id);
        }
        if (dto.variation_id) {
            item.variation = await this.variationService.findOne(dto.variation_id);
        }
        if (dto.service_id) {
            item.service = await this.serviceService.findOne(dto.service_id);
        }

        Object.assign(item, dto);
        return this.itemRepo.save(item);
    }

    async remove(id: number): Promise<void> {
        const item = await this.findOne(id);
        await this.itemRepo.remove(item);
    }
}
