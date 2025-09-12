import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyReward } from './loyalty-rewards.entity';
import { LoyaltyRewardsService } from './loyalty-rewards.service';
import { LoyaltyRewardsController } from './loyalty-rewards.controller';

@Module({imports: [TypeOrmModule.forFeature([LoyaltyReward])],
  providers: [LoyaltyRewardsService],
  controllers: [LoyaltyRewardsController],
})

export class LoyaltyRewardsModule {}
