import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
    constructor(
        @InjectRepository(Discount)
        private readonly discountRepo: Repository<Discount>,
    ) { }

    async create(dto: CreateDiscountDto): Promise<Discount> {
        const exists = await this.discountRepo.findOne({ where: { discount_code: dto.discount_code } });
        if (exists) {
            throw new ConflictException(`Discount code '${dto.discount_code}' already exists`);
        }
        const discount = this.discountRepo.create(dto);
        return this.discountRepo.save(discount);
    }

    async findAll(): Promise<Discount[]> {
        return this.discountRepo.find();
    }

    async findOne(id: number): Promise<Discount> {
        const discount = await this.discountRepo.findOne({ where: { discount_id: id } });
        if (!discount) {
            throw new NotFoundException(`Discount ${id} not found`);
        }
        return discount;
    }

    async update(id: number, dto: UpdateDiscountDto): Promise<Discount> {
        const discount = await this.findOne(id);

        if (dto.discount_code && dto.discount_code !== discount.discount_code) {
            const exists = await this.discountRepo.findOne({ where: { discount_code: dto.discount_code } });
            if (exists) {
                throw new ConflictException(`Discount code '${dto.discount_code}' already exists`);
            }
        }

        Object.assign(discount, dto);
        return this.discountRepo.save(discount);
    }

    async remove(id: number): Promise<void> {
        const discount = await this.findOne(id);
        await this.discountRepo.remove(discount);
    }
}
