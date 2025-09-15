import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRewards } from './customer-rewards.entity';
import { CreateCustomerRewardsDto } from './dto/create-rewards.dto';
import { UpdateCustomerRewardsDto } from './dto/update-rewards.dto';

@Injectable()
export class CustomerRewardsService {
constructor(
    @InjectRepository(CustomerRewards)
    private readonly customerRewardsRepository: Repository<CustomerRewards>,
  ) {}

  create(dto: CreateCustomerRewardsDto) {
    const reward = this.customerRewardsRepository.create({
      ...dto,
      customer: { customer_id: dto.customer_id },
      reward: { reward_id: dto.reward_id },
      shop: { shop_id: dto.shop_id },
      counter: { counter_id: dto.counter_id },
      processed_by_user: { user_id: dto.processed_by_user },
    });
    return this.customerRewardsRepository.save(reward);
  }

  findAll() {
    return this.customerRewardsRepository.find();
  }

  findOne(id: number) {
    return this.customerRewardsRepository.findOne({ where: { customer_reward_id: id } });
  }

  async update(id: number, dto: UpdateCustomerRewardsDto) {
  const reward = await this.customerRewardsRepository.findOne({ where: { customer_reward_id: id } });
  if (!reward) {
    throw new Error(`CustomerReward with ID ${id} not found`);
  }

  if (dto.customer_id) reward.customer = { customer_id: dto.customer_id } as any;
  if (dto.reward_id) reward.reward = { reward_id: dto.reward_id } as any;
  if (dto.shop_id) reward.shop = { shop_id: dto.shop_id } as any;
  if (dto.counter_id) reward.counter = { counter_id: dto.counter_id } as any;
  if (dto.processed_by_user) reward.processed_by_user = { user_id: dto.processed_by_user } as any;

  Object.assign(reward, dto); // copy other simple fields

  return this.customerRewardsRepository.save(reward);
}
  remove(id: number) {
    return this.customerRewardsRepository.delete(id);
  }

}
