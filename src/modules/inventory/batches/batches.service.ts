import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Batch } from './batches.entity';
import { Repository } from 'typeorm';
import { ProductService } from 'src/modules/product-management/product/product.service';
import { ProductVariationService } from 'src/modules/product-management/product-variation/product-variation.service';
import { SupplierService } from '../supplier/supplier.service';
import { UsersService } from 'src/modules/users/users.service';
import { ConsignorService } from '../consignor/consignor.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';

@Injectable()
export class BatchesService {
    constructor(
        @InjectRepository(Batch)
        private readonly batchRepo: Repository<Batch>,
        private readonly productService: ProductService,
        private readonly variationService: ProductVariationService,
        private readonly supplierService: SupplierService,
        private readonly userService: UsersService,
        private readonly consignorService: ConsignorService,
    ) { }

    async create(dto: CreateBatchDto): Promise<Batch> {
        const exists = await this.batchRepo.findOne({
            where: { batch_number: dto.batch_number },
        });
        if (exists) {
            throw new ConflictException(
                `Batch number '${dto.batch_number}' already exists.`,
            );
        }

        const product = await this.productService.findOne(dto.product_id);
        const createdBy = await this.userService.findOne(dto.created_by_user);

        const variation = dto.variation_id
            ? await this.variationService.findOne(dto.variation_id)
            : null;

        const supplier = dto.supplier_id
            ? await this.supplierService.findOne(dto.supplier_id)
            : null;

        const consignor = dto.consignor_id
            ? await this.consignorService.findOne(dto.consignor_id)
            : null;

        const { consignor_id, supplier_id, product_id, variation_id, created_by_user, ...data } = dto;

        const batch = this.batchRepo.create(data);

        batch.product = product;
        batch.created_by_user = createdBy;
        if (variation) batch.variation = variation;
        if (supplier) batch.supplier = supplier;
        if (consignor) batch.consignor = consignor;

        return this.batchRepo.save(batch);
    }

    async findAll(): Promise<Batch[]> {
        return this.batchRepo.find({
            order: { created_at: 'DESC' },
        });
    }

    async findOne(id: number): Promise<Batch> {
        const batch = await this.batchRepo.findOne({ where: { batch_id: id } });
        if (!batch) {
            throw new NotFoundException(`Batch ${id} not found`);
        }
        return batch;
    }

    async update(id: number, dto: UpdateBatchDto): Promise<Batch> {
        const batch = await this.findOne(id);

        if (dto.product_id)
            batch.product = await this.productService.findOne(dto.product_id);

        if (dto.variation_id)
            batch.variation = await this.variationService.findOne(dto.variation_id);

        if (dto.supplier_id)
            batch.supplier = await this.supplierService.findOne(dto.supplier_id);

        if (dto.consignor_id)
            batch.consignor = await this.consignorService.findOne(dto.consignor_id);

        Object.assign(batch, dto);
        return this.batchRepo.save(batch);
    }

    async remove(id: number): Promise<void> {
        const batch = await this.findOne(id);
        await this.batchRepo.remove(batch);
    }
}
