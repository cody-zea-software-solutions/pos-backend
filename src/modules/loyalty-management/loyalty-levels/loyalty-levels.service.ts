import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyLevel } from './loyalty-levels.entity';
import { CreateLoyaltyLevelsDto } from './dto/create-loyalty-levels.dto';
import { UpdateLoyaltyLevelsDto } from './dto/update-loyalty-levels.dto';
@Injectable()
export class LoyaltyLevelsService {

     constructor(
        @InjectRepository(LoyaltyLevel)
        private readonly loyaltyRepo: Repository<LoyaltyLevel>,
      ) {}
    
      create(dto: CreateLoyaltyLevelsDto) {
        const loyalty = this.loyaltyRepo.create(dto);
        return this.loyaltyRepo.save(loyalty);
      }
    
      findAll() {
        return this.loyaltyRepo.find();
      }
    
      findOne(id: number) {
        return this.loyaltyRepo.findOneBy({ level_id: id });
      }
    
      async update(id: number, dto: UpdateLoyaltyLevelsDto) {
        await this.loyaltyRepo.update(id, dto);
        return this.findOne(id);
      }
    
      remove(id: number) {
        return this.loyaltyRepo.delete(id);
      }
    
}
