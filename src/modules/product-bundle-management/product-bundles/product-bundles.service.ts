import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductBundle } from './product-bundle.entity';
import { ILike, Repository } from 'typeorm';
import { CreateProductBundleDto } from './dto/create-product-bundle.dto';
import { UpdateProductBundleDto } from './dto/update-product-bundle.dto';

@Injectable()
export class ProductBundlesService {
    constructor(
        @InjectRepository(ProductBundle)
        private readonly bundleRepo: Repository<ProductBundle>,
    ) { }

    async create(dto: CreateProductBundleDto, file?: Express.Multer.File): Promise<ProductBundle> {
        const exists = await this.bundleRepo.findOne({
            where: { bundle_code: dto.bundle_code },
        });
        if (exists) {
            throw new ConflictException(`Bundle code '${dto.bundle_code}' already exists`);
        }

        const bundle = this.bundleRepo.create(dto);

        if (file) {
            bundle.image_url = `/uploads/product-bundles/${file.filename}`;
        }

        return this.bundleRepo.save(bundle);
    }

    async findAll(): Promise<ProductBundle[]> {
        return this.bundleRepo.find();
    }

    async findOne(id: number): Promise<ProductBundle> {
        const bundle = await this.bundleRepo.findOne({
            where: { bundle_id: id },
        });
        if (!bundle) {
            throw new NotFoundException(`Bundle ${id} not found`);
        }
        return bundle;
    }

    async update(id: number, dto: UpdateProductBundleDto, file?: Express.Multer.File): Promise<ProductBundle> {
        const bundle = await this.findOne(id);

        if (dto.bundle_code && dto.bundle_code !== bundle.bundle_code) {
            const exists = await this.bundleRepo.findOne({
                where: { bundle_code: dto.bundle_code },
            });
            if (exists) {
                throw new ConflictException(`Bundle code '${dto.bundle_code}' already exists`);
            }
        }

        Object.assign(bundle, dto);

        if (file) {
            bundle.image_url = `/uploads/product-bundles/${file.filename}`;
        }

        return this.bundleRepo.save(bundle);
    }

    async remove(id: number): Promise<void> {
        const bundle = await this.findOne(id);
        await this.bundleRepo.remove(bundle);
    }

    async findByName(name: string): Promise<ProductBundle[]> {
        return this.bundleRepo.find({
            where: { bundle_name: ILike(`%${name}%`) },
        });
    }

    async findByCode(code: string): Promise<ProductBundle> {
        const bundle = await this.bundleRepo.findOne({
            where: { bundle_code: code },
        });
        if (!bundle) {
            throw new NotFoundException(`Bundle with code '${code}' not found`);
        }
        return bundle;
    }
}
