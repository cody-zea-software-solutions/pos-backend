import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductUnit } from './product-unit.entity';
import { Repository } from 'typeorm';
import { CreateProductUnitDto } from './dto/create-product-unit.dto';
import { UpdateProductUnitDto } from './dto/update-product-unit.dto';

@Injectable()
export class ProductUnitsService {
    constructor(
        @InjectRepository(ProductUnit)
        private readonly unitRepo: Repository<ProductUnit>,
    ) { }

    async create(dto: CreateProductUnitDto): Promise<ProductUnit> {
        const exists = await this.unitRepo.findOne({ where: { unit_name: dto.unit_name } });
        if (exists) {
            throw new ConflictException(`Unit '${dto.unit_name}' already exists`);
        }

        const unit = this.unitRepo.create(dto as ProductUnit);
        return this.unitRepo.save(unit);
    }

    async findAll(): Promise<ProductUnit[]> {
        return this.unitRepo.find();
    }

    async findOne(id: number): Promise<ProductUnit> {
        const unit = await this.unitRepo.findOne({ where: { unit_id: id } });
        if (!unit) throw new NotFoundException(`Unit ${id} not found`);
        return unit;
    }

    async update(id: number, dto: UpdateProductUnitDto): Promise<ProductUnit> {
        const unit = await this.findOne(id);

        if (dto.unit_name && dto.unit_name !== unit.unit_name) {
            const exists = await this.unitRepo.findOne({ where: { unit_name: dto.unit_name } });
            if (exists) {
                throw new ConflictException(`Unit '${dto.unit_name}' already exists`);
            }
        }

        Object.assign(unit, dto);
        return this.unitRepo.save(unit);
    }

    async remove(id: number): Promise<void> {
        const unit = await this.findOne(id);
        await this.unitRepo.remove(unit);
    }
}
