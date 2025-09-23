import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariation } from './product-variation.entity';
import { ILike, Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { CreateProductVariationDto } from './dto/create-product-variation.dto';
import { UpdateProductVariationDto } from './dto/update-product-variation.dto';

@Injectable()
export class ProductVariationService {
    constructor(
        @InjectRepository(ProductVariation)
        private readonly variationRepo: Repository<ProductVariation>,
        private readonly productService: ProductService,
    ) { }

    async create(dto: CreateProductVariationDto): Promise<ProductVariation> {
        const exists = await this.variationRepo.findOne({
            where: { variation_code: dto.variation_code },
        });
        if (exists) {
            throw new ConflictException(
                `Variation code '${dto.variation_code}' already exists`,
            );
        }

        const product = await this.productService.findOne(dto.product_id);

        const { product_id, ...data } = dto;
        const variation = this.variationRepo.create({
            ...data,
            product,
        });

        return this.variationRepo.save(variation);
    }

    async findAll(): Promise<ProductVariation[]> {
        return this.variationRepo.find({ relations: ['product'] });
    }

    async findOne(id: number): Promise<ProductVariation> {
        const variation = await this.variationRepo.findOne({
            where: { variation_id: id },
            relations: ['product'],
        });
        if (!variation) {
            throw new NotFoundException(`Variation ${id} not found`);
        }
        return variation;
    }

    async update(id: number, dto: UpdateProductVariationDto): Promise<ProductVariation> {
        const variation = await this.findOne(id);

        if (dto.variation_code && dto.variation_code !== variation.variation_code) {
            const exists = await this.variationRepo.findOne({
                where: { variation_code: dto.variation_code },
            });
            if (exists) {
                throw new ConflictException(
                    `Variation code '${dto.variation_code}' already exists`,
                );
            }
        }

        let product = variation.product;
        if (dto.product_id) {
            product = await this.productService.findOne(dto.product_id);
        }

        Object.assign(variation, { ...dto, product });
        return this.variationRepo.save(variation);
    }

    async remove(id: number): Promise<void> {
        const variation = await this.findOne(id);
        await this.variationRepo.remove(variation);
    }

    // Search by name (case-insensitive, partial match)
    async findByName(name: string): Promise<ProductVariation[]> {
        return this.variationRepo.find({
            where: { variation_name: ILike(`%${name}%`) },
            relations: ['product'],
        });
    }

    // Search by barcode (exact match)
    async findByBarcode(barcode: string): Promise<ProductVariation> {
        const variation = await this.variationRepo.findOne({
            where: { barcode },
            relations: ['product'],
        });
        if (!variation)
            throw new NotFoundException(
                `Variation with barcode '${barcode}' not found`,
            );
        return variation;
    }
}
