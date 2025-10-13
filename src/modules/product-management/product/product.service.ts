import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductGroupService } from '../product-group/product-group.service';
import { ProductCategoryService } from '../product-category/product-category.service';
import { ProductSubcategoryService } from '../product-subcategory/product-subcategory.service';
import { ProductUnitsService } from '../product-units/product-units.service';
import { ConsignorService } from '../../inventory/consignor/consignor.service';
import { SubscriptionPlanService } from '../../subscription-plan/subscription-plan.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        private readonly groupService: ProductGroupService,
        private readonly categoryService: ProductCategoryService,
        private readonly subcategoryService: ProductSubcategoryService,
        private readonly unitService: ProductUnitsService,
        private readonly consignorService: ConsignorService,
        private readonly subscriptionPlanService: SubscriptionPlanService,
    ) { }

    async create(dto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {

        // Validate subscription plan limits
        await this.subscriptionPlanService.validateLimit('product');

        const exists = await this.productRepo.findOne({
            where: { product_code: dto.product_code },
        });
        if (exists) {
            throw new ConflictException(
                `Product code '${dto.product_code}' already exists`,
            );
        }

        // Relations
        const group = dto.group_id
            ? await this.groupService.findOne(dto.group_id)
            : null;

        const category = dto.category_id
            ? await this.categoryService.findOne(dto.category_id)
            : null;

        const subcategory = dto.subcategory_id
            ? await this.subcategoryService.findOne(dto.subcategory_id)
            : null;

        const unit = dto.unit_id
            ? await this.unitService.findOne(dto.unit_id)
            : null;

        const consignor = dto.consignor_id
            ? await this.consignorService.findOne(dto.consignor_id)
            : null;

        const {
            group_id,
            category_id,
            subcategory_id,
            unit_id,
            consignor_id,
            ...data
        } = dto;

        const product = this.productRepo.create(data);

        if (group) product.group = group;
        if (category) product.category = category;
        if (subcategory) product.subcategory = subcategory;
        if (unit) product.unit = unit;
        if (consignor) product.consignor = consignor;

        if (file) {
            product.image_url = `/uploads/products/${file.filename}`;
        }

        return this.productRepo.save(product);
    }

    async findAll(): Promise<Product[]> {
        return this.productRepo.find({
            relations: ['group', 'category', 'subcategory', 'unit', 'consignor', 'variations'],
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepo.findOne({
            where: { product_id: id },
            relations: ['group', 'category', 'subcategory', 'unit', 'consignor', 'variations'],
        });
        if (!product) {
            throw new NotFoundException(`Product ${id} not found`);
        }
        return product;
    }

    async update(id: number, dto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
        const product = await this.findOne(id);

        if (dto.product_code && dto.product_code !== product.product_code) {
            const exists = await this.productRepo.findOne({
                where: { product_code: dto.product_code },
            });
            if (exists) {
                throw new ConflictException(
                    `Product code '${dto.product_code}' already exists`,
                );
            }
        }

        const group = dto.group_id
            ? await this.groupService.findOne(dto.group_id)
            : null;

        const category = dto.category_id
            ? await this.categoryService.findOne(dto.category_id)
            : null;

        const subcategory = dto.subcategory_id
            ? await this.subcategoryService.findOne(dto.subcategory_id)
            : null;

        const unit = dto.unit_id
            ? await this.unitService.findOne(dto.unit_id)
            : null;

        const consignor = dto.consignor_id
            ? await this.consignorService.findOne(dto.consignor_id)
            : null;

        const {
            group_id,
            category_id,
            subcategory_id,
            unit_id,
            consignor_id,
            ...data
        } = dto;

        Object.assign(product, data);

        if (group) product.group = group;
        if (category) product.category = category;
        if (subcategory) product.subcategory = subcategory;
        if (unit) product.unit = unit;
        if (consignor) product.consignor = consignor;

        // Save new image if uploaded
        if (file) {
            product.image_url = `/uploads/products/${file.filename}`;
        }

        return this.productRepo.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepo.remove(product);
    }

    async findByName(name: string): Promise<Product[]> {
        return this.productRepo.find({
            where: { product_name: ILike(`%${name}%`) },
            relations: ['group', 'category', 'subcategory', 'unit', 'consignor'],
        });
    }

    async findByBarcode(barcode: string): Promise<Product> {
        const product = await this.productRepo.findOne({
            where: { barcode },
            relations: ['group', 'category', 'subcategory', 'unit', 'consignor'],
        });
        if (!product)
            throw new NotFoundException(
                `Product with barcode '${barcode}' not found`,
            );
        return product;
    }
}
