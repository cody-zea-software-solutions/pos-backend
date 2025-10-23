import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConsignmentStock } from './consignment-stock.entity';
import { Repository } from 'typeorm';
import { ProductService } from '../../product-management/product/product.service';
import { ProductVariationService } from '../../product-management/product-variation/product-variation.service';
import { ConsignorService } from '../consignor/consignor.service';
import { ShopService } from '../../shop/shop.service';
import { CreateConsignmentStockDto } from './dto/create-consignment-stock.dto';
import { UpdateConsignmentStockDto } from './dto/update-consignment-stock.dto';

@Injectable()
export class ConsignmentStockService {
    constructor(
        @InjectRepository(ConsignmentStock)
        private readonly consignmentRepo: Repository<ConsignmentStock>,
        private readonly productsService: ProductService,
        private readonly variationsService: ProductVariationService,
        private readonly consignorsService: ConsignorService,
        private readonly shopsService: ShopService,
    ) { }

    async create(dto: CreateConsignmentStockDto): Promise<ConsignmentStock> {

        // Validate required relations
        const product = await this.productsService.findOne(dto.product_id);
        if (!product) throw new BadRequestException('Invalid product');

        const consignor = await this.consignorsService.findOne(dto.consignor_id);
        if (!consignor) throw new BadRequestException('Invalid consignor');

        const shop = await this.shopsService.findOne(dto.shop_id);
        if (!shop) throw new BadRequestException('Invalid shop');

        const variation = dto.variation_id
            ? await this.variationsService.findOne(dto.variation_id)
            : null;

        const { product_id, variation_id, consignor_id, shop_id, ...data } = dto;

        // Create new entity
        const consignment = this.consignmentRepo.create(data);

        // Set relations
        consignment.product = product;
        consignment.consignor = consignor;
        consignment.shop = shop;
        if (variation) consignment.variation = variation;

        //  Initialize calculated fields
        consignment.quantity_available = dto.quantity_received;
        consignment.quantity_sold = 0;
        consignment.quantity_returned = 0;
        consignment.status = 'RECEIVED';

        // Save record
        return await this.consignmentRepo.save(consignment);
    }

    async findAll(): Promise<ConsignmentStock[]> {
        return await this.consignmentRepo.find({
            relations: ['product', 'variation', 'consignor', 'shop'],
        });
    }

    async findOne(id: number): Promise<ConsignmentStock> {
        const stock = await this.consignmentRepo.findOne({
            where: { consignment_id: id },
            relations: ['product', 'variation', 'consignor', 'shop'],
        });
        if (!stock) throw new NotFoundException('Consignment record not found');
        return stock;
    }

    async update(id: number, dto: UpdateConsignmentStockDto): Promise<ConsignmentStock> {
        // Find existing consignment record
        const consignment = await this.consignmentRepo.findOne({
            where: { consignment_id: id },
            relations: ['product', 'variation', 'consignor', 'shop'],
        });
        if (!consignment) throw new NotFoundException(`Consignment record with ID ${id} not found`);

        // Validate relations only if changed
        if (dto.product_id && dto.product_id !== consignment.product?.product_id) {
            const product = await this.productsService.findOne(dto.product_id);
            if (!product) throw new BadRequestException('Invalid product');
            consignment.product = product;
        }

        if (dto.variation_id && dto.variation_id !== consignment.variation?.variation_id) {
            const variation = await this.variationsService.findOne(dto.variation_id);
            if (!variation) throw new BadRequestException('Invalid variation');
            consignment.variation = variation;
        }

        if (dto.consignor_id && dto.consignor_id !== consignment.consignor?.consignor_id) {
            const consignor = await this.consignorsService.findOne(dto.consignor_id);
            if (!consignor) throw new BadRequestException('Invalid consignor');
            consignment.consignor = consignor;
        }

        if (dto.shop_id && dto.shop_id !== consignment.shop?.shop_id) {
            const shop = await this.shopsService.findOne(dto.shop_id);
            if (!shop) throw new BadRequestException('Invalid shop');
            consignment.shop = shop;
        }

        // Remove foreign key IDs to avoid direct column assignment
        const { product_id, variation_id, consignor_id, shop_id, ...data } = dto;

        // Merge new data
        Object.assign(consignment, data);

        // Update last_updated timestamp
        consignment.last_updated = new Date();

        // Auto-calculate status based on stock quantities
        if (consignment.quantity_sold >= consignment.quantity_received) {
            consignment.status = 'SOLD_OUT';
        } else if (consignment.quantity_returned > 0) {
            consignment.status = 'RETURNED';
        } else if (consignment.quantity_sold > 0 && consignment.quantity_available > 0) {
            consignment.status = 'PARTIAL_SOLD';
        } else {
            consignment.status = 'RECEIVED';
        }

        // Save and return updated entity
        return await this.consignmentRepo.save(consignment);
    }


    async remove(id: number): Promise<void> {
        const stock = await this.consignmentRepo.findOne({ where: { consignment_id: id } });
        if (!stock) throw new NotFoundException('Record not found');
        await this.consignmentRepo.remove(stock);
    }
}
