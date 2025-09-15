import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './product-category.entity';
import { Repository } from 'typeorm';
import { ProductGroupService } from '../product-group/product-group.service';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';

@Injectable()
export class ProductCategoryService {
    constructor(
        @InjectRepository(ProductCategory)
        private readonly categoryRepo: Repository<ProductCategory>,
        private readonly groupService: ProductGroupService,
    ) { }

    async create(dto: CreateProductCategoryDto): Promise<ProductCategory> {

        // Enforce unique category_code
        const existing = await this.categoryRepo.findOne({
            where: { category_code: dto.category_code },
        });
        if (existing) {
            throw new ConflictException(
                `Category code '${dto.category_code}' already exists`,
            );
        }

        const group = await this.groupService.findOne(dto.group_id);
        if (!group) throw new NotFoundException(`Group ${dto.group_id} not found`);

        const parent = dto.parent_category_id
            ? await this.findOne(dto.parent_category_id)
            : null;

        const { group_id, parent_category_id, ...data } = dto;
        const category = this.categoryRepo.create(data);

        category.group = group;
        if (parent) {
            category.parent = parent;
        }

        return this.categoryRepo.save(category);
    }

    async findAll(): Promise<ProductCategory[]> {
        return this.categoryRepo.find({
            relations: ['group', 'parent', 'children'],
        });
    }

    async findOne(id: number): Promise<ProductCategory> {
        const category = await this.categoryRepo.findOne({
            where: { category_id: id },
            relations: ['group', 'parent', 'children'],
        });
        if (!category)
            throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async update(
        id: number,
        dto: UpdateProductCategoryDto,
    ): Promise<ProductCategory> {
        const category = await this.findOne(id);

        // prevent duplicate category_code if updating
        if (dto.category_code && dto.category_code !== category.category_code) {
            const existing = await this.categoryRepo.findOne({
                where: { category_code: dto.category_code },
            });
            if (existing) {
                throw new ConflictException(
                    `Category code '${dto.category_code}' already exists`,
                );
            }
        }

        if (dto.group_id) {
            const group = await this.groupService.findOne(dto.group_id);
            if (!group) throw new NotFoundException(`Group ${dto.group_id} not found`);
            category.group = group;
        }

        if (dto.parent_category_id) {
            const parent = await this.findOne(dto.parent_category_id);
            category.parent = parent;
        }

        Object.assign(category, dto);
        return this.categoryRepo.save(category);
    }

    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);
        await this.categoryRepo.remove(category);
    }
}
