import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { ProductService } from '../product-management/product/product.service';
import { Product } from '../product-management/product/product.entity';

@Injectable()
export class DiscountService {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepo: Repository<Discount>,
        private readonly productService: ProductService,
    ) { }

    // CREATE
    async create(dto: CreateDiscountDto): Promise<Discount> {
        // Check for duplicate discount code
        const existing = await this.discountRepo.findOne({
            where: { discount_code: dto.discount_code },
        });
        if (existing) {
            throw new ConflictException(
                `Discount code '${dto.discount_code}' already exists`,
            );
        }

        // Validate related product (if provided)
        const targetProduct = dto.target_id
            ? await this.productService.findOne(dto.target_id)
            : null;

        const { target_id, ...discountData } = dto;
        const discount = this.discountRepo.create(discountData);

        if (targetProduct) {
            discount.target_product = targetProduct as Product;
        }

        return this.discountRepo.save(discount);
    }

    // FIND ALL
    async findAll(): Promise<Discount[]> {
        return this.discountRepo.find({
            relations: ['target_product'],
            order: { created_at: 'DESC' },
        });
    }

    // FIND ONE
    async findOne(id: number): Promise<Discount> {
        const discount = await this.discountRepo.findOne({
            where: { discount_id: id },
            relations: ['target_product'],
        });

        if (!discount) {
            throw new NotFoundException(`Discount with ID ${id} not found`);
        }

        return discount;
    }

    // UPDATE
    async update(id: number, dto: UpdateDiscountDto): Promise<Discount> {
        const discount = await this.findOne(id);

        // Handle unique discount code check
        if (dto.discount_code && dto.discount_code !== discount.discount_code) {
            const exists = await this.discountRepo.findOne({
                where: { discount_code: dto.discount_code },
            });
            if (exists) {
                throw new ConflictException(
                    `Discount code '${dto.discount_code}' already exists`,
                );
            }
        }

        // Validate target product if provided
        const targetProduct = dto.target_id
            ? await this.productService.findOne(dto.target_id)
            : discount.target_product;

        Object.assign(discount, {
            ...dto,
            target_product: targetProduct ? targetProduct : null,
        });

        return this.discountRepo.save(discount);
    }

    // REMOVE
    async remove(id: number): Promise<void> {
        const discount = await this.findOne(id);
        await this.discountRepo.remove(discount);
    }
}
