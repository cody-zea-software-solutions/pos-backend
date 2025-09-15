import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSubcategory } from './product-subcategory.entity';
import { Repository } from 'typeorm';
import { ProductCategoryService } from '../product-category/product-category.service';
import { CreateProductSubcategoryDto } from './dto/create-product-subcategory.dto';
import { UpdateProductSubcategoryDto } from './dto/update-product-subcategory.dto';

@Injectable()
export class ProductSubcategoryService {
    constructor(
        @InjectRepository(ProductSubcategory)
        private readonly subcategoryRepo: Repository<ProductSubcategory>,
        private readonly categoryService: ProductCategoryService,
    ) { }

    async create(dto: CreateProductSubcategoryDto): Promise<ProductSubcategory> {
        const existing = await this.subcategoryRepo.findOne({
            where: { subcategory_code: dto.subcategory_code },
        });
        if (existing) {
            throw new ConflictException(
                `Subcategory code '${dto.subcategory_code}' already exists`,
            );
        }

        const category = await this.categoryService.findOne(dto.category_id);
        if (!category)
            throw new NotFoundException(`Category ${dto.category_id} not found`);

        const subcategory = this.subcategoryRepo.create({ ...dto, category });
        return this.subcategoryRepo.save(subcategory);
    }

    async findAll(): Promise<ProductSubcategory[]> {
        return this.subcategoryRepo.find({ relations: ['category'] });
    }

    async findOne(id: number): Promise<ProductSubcategory> {
        const subcategory = await this.subcategoryRepo.findOne({
            where: { subcategory_id: id },
            relations: ['category'],
        });
        if (!subcategory)
            throw new NotFoundException(`Subcategory ${id} not found`);
        return subcategory;
    }

    async update(
        id: number,
        dto: UpdateProductSubcategoryDto,
    ): Promise<ProductSubcategory> {
        const subcategory = await this.findOne(id);

        if (
            dto.subcategory_code &&
            dto.subcategory_code !== subcategory.subcategory_code
        ) {
            const existing = await this.subcategoryRepo.findOne({
                where: { subcategory_code: dto.subcategory_code },
            });
            if (existing) {
                throw new ConflictException(
                    `Subcategory code '${dto.subcategory_code}' already exists`,
                );
            }
        }

        Object.assign(subcategory, dto);

        if (dto.category_id) {
            const category = await this.categoryService.findOne(dto.category_id);
            if (!category)
                throw new NotFoundException(`Category ${dto.category_id} not found`);
            subcategory.category = category;
        }

        return this.subcategoryRepo.save(subcategory);
    }

    async remove(id: number): Promise<void> {
        const subcategory = await this.findOne(id);
        await this.subcategoryRepo.remove(subcategory);
    }
}
