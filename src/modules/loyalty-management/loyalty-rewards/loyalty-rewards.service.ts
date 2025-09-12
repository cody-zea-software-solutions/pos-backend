import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyReward } from './loyalty-rewards.entity';
import { CreateLoyaltyRewardsDto } from './dto/create-loyalty-rewards.dto';
import { UpdateLoyaltyRewardsDto } from './dto/update-loyalty-rewards.dto';
@Injectable()
export class LoyaltyRewardsService {
      constructor(
    @InjectRepository(LoyaltyReward)
    private readonly rewardRepo: Repository<LoyaltyReward>,
  ) {}

  create(dto: CreateLoyaltyRewardsDto) {
    const reward = this.rewardRepo.create(dto);
    return this.rewardRepo.save(reward);
  }

  findAll() {
    return this.rewardRepo.find();
  }

  findOne(id: number) {
    return this.rewardRepo.findOneBy({ reward_id: id });
  }

  async update(id: number, dto: UpdateLoyaltyRewardsDto) {
    await this.rewardRepo.update(id, dto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.rewardRepo.delete(id);
  }
}
