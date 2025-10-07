import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './shop.entity';
import { Repository } from 'typeorm';
import { Business } from '../business/business.entity';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { SubscriptionPlanService } from '../subscription-plan/subscription-plan.service';

@Injectable()
export class ShopService {
    constructor(
        @InjectRepository(Shop)
        private shopRepo: Repository<Shop>,
        @InjectRepository(Business)
        private businessRepo: Repository<Business>,
        private readonly subscriptionPlanService: SubscriptionPlanService,
    ) { }

    async create(dto: CreateShopDto) {

        // Validate plan limits first
        await this.subscriptionPlanService.validateLimit('shop');

        const business = await this.businessRepo.findOne({
            where: { business_id: dto.business_id },
        });
        if (!business) {
            throw new NotFoundException(`Business #${dto.business_id} not found`);
        }

        const shop = this.shopRepo.create({
            ...dto,
            business,
        });
        return this.shopRepo.save(shop);
    }

    findAll() {
        return this.shopRepo.find({ relations: ['business'] });
    }

    async findOne(id: number) {
        const shop = await this.shopRepo.findOne({
            where: { shop_id: id },
            relations: ['business'],
        });
        if (!shop) {
            throw new NotFoundException(`Shop #${id} not found`);
        }
        return shop;
    }

    async update(id: number, dto: UpdateShopDto) {
        const shop = await this.findOne(id);

        if (dto.business_id) {
            const business = await this.businessRepo.findOne({
                where: { business_id: dto.business_id },
            });
            if (!business) {
                throw new NotFoundException(`Business #${dto.business_id} not found`);
            }
            shop.business = business;
        }

        Object.assign(shop, dto);
        return this.shopRepo.save(shop);
    }

    async remove(id: number) {
        const shop = await this.findOne(id);
        return this.shopRepo.remove(shop);
    }
}
