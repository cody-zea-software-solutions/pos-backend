import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGroup } from './product-group.entity';
import { Repository } from 'typeorm';
import { CreateProductGroupDto } from './dto/create-product-group.dto';
import { UpdateProductGroupDto } from './dto/update-product-group.dto';

@Injectable()
export class ProductGroupService {
    constructor(
        @InjectRepository(ProductGroup)
        private readonly productGroupRepo: Repository<ProductGroup>,
    ) { }

    async create(dto: CreateProductGroupDto): Promise<ProductGroup> {

        // Check for uniqueness of group_code
        const existingGroup = await this.productGroupRepo.findOne({
                where: { group_code: dto.group_code },
              });
              
              if (existingGroup) {
                throw new ConflictException('Group code should be unique. this code already exists.');
              }

        const group = this.productGroupRepo.create(dto);
        return this.productGroupRepo.save(group);
    }

    async findAll(): Promise<ProductGroup[]> {
        return this.productGroupRepo.find();
    }

    async findOne(id: number): Promise<ProductGroup> {
        const group = await this.productGroupRepo.findOne({
            where: { group_id: id },
        });
        if (!group) {
            throw new NotFoundException(`Product Group with ID ${id} not found`);
        }
        return group;
    }

    async update(id: number, dto: UpdateProductGroupDto): Promise<ProductGroup> {
        const group = await this.findOne(id);
        Object.assign(group, dto);
        return this.productGroupRepo.save(group);
    }

    async remove(id: number): Promise<void> {
        const group = await this.findOne(id);
        await this.productGroupRepo.remove(group);
    }
}
