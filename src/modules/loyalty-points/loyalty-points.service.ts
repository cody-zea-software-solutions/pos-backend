import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { Customer } from '../customer/customer.entity';
import { Shop } from '../shop/shop.entity';
import { Counter } from '../counter/counter.entity';
import { User } from '../users/user.entity';

import { CreateLoyaltyPointsDto } from './dto/create-loyalty-points.dto';
import { UpdateLoyaltyPointsDto } from './dto/update-loyalty-points.dto';
@Injectable()
export class LoyaltyPointsService {

constructor(
    @InjectRepository(LoyaltyPoints)
    private readonly loyaltyPointsRepo: Repository<LoyaltyPoints>,
  ) {}

  async create(dto: CreateLoyaltyPointsDto): Promise<LoyaltyPoints> {
  const loyaltyPoints = this.loyaltyPointsRepo.create({
    ...dto,
    customer: { customer_id: dto.customer_id } as Customer,
    shop: { shop_id: dto.shop_id } as Shop,
    counter: { counter_id: dto.counter_id } as Counter,
    createdBy: { user_id: dto.created_by_user } as User,
  });

  return await this.loyaltyPointsRepo.save(loyaltyPoints);
}
  async findAll(): Promise<LoyaltyPoints[]> {
    return this.loyaltyPointsRepo.find();
  }

  async findOne(id: number): Promise<LoyaltyPoints> {
    const loyaltyPoints = await this.loyaltyPointsRepo.findOne({ where: { point_id: id } });
    if (!loyaltyPoints) throw new NotFoundException(`Loyalty points record ${id} not found`);
    return loyaltyPoints;
  }

  async update(id: number, dto: UpdateLoyaltyPointsDto): Promise<LoyaltyPoints> {
    const loyaltyPoints = await this.findOne(id);
    Object.assign(loyaltyPoints, dto);
    return this.loyaltyPointsRepo.save(loyaltyPoints);
  }

  async remove(id: number): Promise<void> {
    const loyaltyPoints = await this.findOne(id);
    await this.loyaltyPointsRepo.remove(loyaltyPoints);
  }

}
