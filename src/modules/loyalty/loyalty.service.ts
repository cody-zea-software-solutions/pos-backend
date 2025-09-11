import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyLevel } from './loyalty.entity';
import { CreateLoyaltyDto } from './dto/create-loyalty.dto';
import { UpdateLoyaltyDto } from './dto/update-loyalty.dto';

@Injectable()
export class LoyaltyService {
 constructor(
    @InjectRepository(LoyaltyLevel)
    private readonly loyaltyRepo: Repository<LoyaltyLevel>,
  ) {}

  create(dto: CreateLoyaltyDto) {
    const loyalty = this.loyaltyRepo.create(dto);
    return this.loyaltyRepo.save(loyalty);
  }

  findAll() {
    return this.loyaltyRepo.find();
  }

  findOne(id: number) {
    return this.loyaltyRepo.findOneBy({ level_id: id });
  }

  async update(id: number, dto: UpdateLoyaltyDto) {
    await this.loyaltyRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.loyaltyRepo.delete(id);
  }

}
