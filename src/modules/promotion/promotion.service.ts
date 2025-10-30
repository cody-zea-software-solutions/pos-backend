import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { Repository } from 'typeorm';
import { ShopService } from '../shop/shop.service';
import { CounterService } from '../counter/counter.service';
import { UsersService } from '../users/users.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { LoyaltyLevelsService } from '../loyalty-management/loyalty-levels/loyalty-levels.service';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(Promotion)
        private readonly promoRepo: Repository<Promotion>,
        private readonly shopService: ShopService,
        private readonly counterService: CounterService,
        private readonly userService: UsersService,
        private readonly loyaltyLevelService: LoyaltyLevelsService,
    ) { }

    async create(dto: CreatePromotionDto): Promise<Promotion> {
        const shop = dto.target_shop_id
            ? await this.shopService.findOne(dto.target_shop_id)
            : null;

        const counter = dto.target_counter_id
            ? await this.counterService.findOne(dto.target_counter_id)
            : null;

        const loyaltyLevel = dto.target_level_id
            ? await this.loyaltyLevelService.findOne(dto.target_level_id)
            : null;

        const user = await this.userService.findOne(dto.created_by_user);

        const { target_shop_id, target_counter_id, created_by_user, target_level_id, ...data } = dto;

        const promotion = this.promoRepo.create(data);

        if (shop) promotion.shop = shop;
        if (counter) promotion.counter = counter;
        if (loyaltyLevel) promotion.loyalty_level = loyaltyLevel;
        promotion.created_by = user;

        return this.promoRepo.save(promotion);
    }

    async findAll(): Promise<Promotion[]> {
        return this.promoRepo.find({
            relations: ['shop', 'counter', 'created_by', 'loyalty_level'],
        });
    }

    async findOne(id: number): Promise<Promotion> {
        const promotion = await this.promoRepo.findOne({
            where: { promotion_id: id },
            relations: ['shop', 'counter', 'created_by', 'loyalty_level'],
        });
        if (!promotion) {
            throw new NotFoundException(`Promotion ${id} not found`);
        }
        return promotion;
    }

    async update(id: number, dto: UpdatePromotionDto): Promise<Promotion> {
        const promotion = await this.findOne(id);

        const shop = dto.target_shop_id
            ? await this.shopService.findOne(dto.target_shop_id)
            : null;

        const counter = dto.target_counter_id
            ? await this.counterService.findOne(dto.target_counter_id)
            : null;

        const user = dto.created_by_user
            ? await this.userService.findOne(dto.created_by_user)
            : null;

        const loyaltyLevel = dto.target_level_id
            ? await this.loyaltyLevelService.findOne(dto.target_level_id)
            : null;

        const { target_shop_id, target_counter_id, created_by_user, target_level_id, ...data } = dto;

        Object.assign(promotion, data);

        if (shop) promotion.shop = shop;
        if (counter) promotion.counter = counter;
        if (user) promotion.created_by = user;
        if (loyaltyLevel) promotion.loyalty_level = loyaltyLevel;

        return this.promoRepo.save(promotion);
    }

    async remove(id: number): Promise<void> {
        const promotion = await this.findOne(id);
        await this.promoRepo.remove(promotion);
    }
}
