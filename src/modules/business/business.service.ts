import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from './business.entity';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
    constructor(
        @InjectRepository(Business)
        private businessRepo: Repository<Business>,
    ) { }

    async create(dto: CreateBusinessDto) {
        const existingBusiness = await this.businessRepo.findOne({
        where: { business_name: dto.business_name },
      });
      
      if (existingBusiness) {
        throw new ConflictException('Business name already exists');
      }
        const business = this.businessRepo.create(dto);
        return this.businessRepo.save(business);
    }

    async findAll() {
        return this.businessRepo.find({
            relations: ['shops'],
        });
    }

    async findOne(id: number) {
        const business = await this.businessRepo.findOne({ where: { business_id: id }, relations: ['shops'], });
        if (!business) {
            throw new NotFoundException(`Business #${id} not found`);
        }
        return business;
    }

    async update(id: number, dto: UpdateBusinessDto) {
        const business = await this.findOne(id);
        Object.assign(business, dto);
        return this.businessRepo.save(business);
    }

    async remove(id: number) {
        const business = await this.findOne(id);
        return this.businessRepo.remove(business);
    }
}
