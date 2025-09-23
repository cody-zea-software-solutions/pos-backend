import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';

@Injectable()
export class SupplierService {
    constructor(
        @InjectRepository(Supplier)
        private readonly supplierRepo: Repository<Supplier>,
    ) { }

    async create(createDto: CreateSupplierDto): Promise<Supplier> {

        // Check if supplier_code already exists
        const exists = await this.supplierRepo.findOne({
            where: { supplier_code: createDto.supplier_code },
        });
        if (exists) {
            throw new ConflictException(
                `Supplier code '${createDto.supplier_code}' already exists`,
            );
        }

        const supplier = this.supplierRepo.create(createDto);
        return this.supplierRepo.save(supplier);
    }

    findAll(): Promise<Supplier[]> {
        return this.supplierRepo.find();
    }

    async findOne(id: number): Promise<Supplier> {
        const supplier = await this.supplierRepo.findOne({
            where: { supplier_id: id },
        });
        if (!supplier) throw new NotFoundException(`Supplier ${id} not found`);
        return supplier;
    }

    async update(id: number, updateDto: UpdateSupplierDto): Promise<Supplier> {
        const supplier = await this.findOne(id);

        // If updating supplier_code, check uniqueness
        if (
            updateDto.supplier_code &&
            updateDto.supplier_code !== supplier.supplier_code
        ) {
            const exists = await this.supplierRepo.findOne({
                where: { supplier_code: updateDto.supplier_code },
            });
            if (exists) {
                throw new ConflictException(
                    `Supplier code '${updateDto.supplier_code}' already exists`,
                );
            }
        }

        Object.assign(supplier, updateDto);
        return this.supplierRepo.save(supplier);
    }

    async remove(id: number): Promise<void> {
        const supplier = await this.findOne(id);
        await this.supplierRepo.remove(supplier);
    }
}
