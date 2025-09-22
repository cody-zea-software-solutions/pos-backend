import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consignor } from './consignor.entity';
import { Repository } from 'typeorm';
import { CreateConsignorDto } from './dto/create-consignor.dto';
import { UpdateConsignorDto } from './dto/update-consignor.dto';

@Injectable()
export class ConsignorService {
    constructor(
        @InjectRepository(Consignor)
        private readonly consignorRepo: Repository<Consignor>,
    ) { }

    async create(dto: CreateConsignorDto): Promise<Consignor> {
        const exists = await this.consignorRepo.findOne({
            where: { consignor_code: dto.consignor_code },
        });
        if (exists) {
            throw new ConflictException(
                `Consignor code '${dto.consignor_code}' already exists`,
            );
        }

        const consignor = this.consignorRepo.create(dto);
        return this.consignorRepo.save(consignor);
    }

    async findAll(): Promise<Consignor[]> {
        return this.consignorRepo.find();
    }

    async findOne(id: number): Promise<Consignor> {
        const consignor = await this.consignorRepo.findOne({
            where: { consignor_id: id },
        });
        if (!consignor) {
            throw new NotFoundException(`Consignor ${id} not found`);
        }
        return consignor;
    }

    async update(id: number, dto: UpdateConsignorDto): Promise<Consignor> {
        const consignor = await this.findOne(id);

        if (
            dto.consignor_code &&
            dto.consignor_code !== consignor.consignor_code
        ) {
            const exists = await this.consignorRepo.findOne({
                where: { consignor_code: dto.consignor_code },
            });
            if (exists) {
                throw new ConflictException(
                    `Consignor code '${dto.consignor_code}' already exists`,
                );
            }
        }

        Object.assign(consignor, dto);
        return this.consignorRepo.save(consignor);
    }

    async remove(id: number): Promise<void> {
        const consignor = await this.findOne(id);
        await this.consignorRepo.remove(consignor);
    }
}
