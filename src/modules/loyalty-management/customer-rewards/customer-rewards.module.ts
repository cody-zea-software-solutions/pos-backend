import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerRewards } from './customer-rewards.entity';
import { CustomerRewardsService } from './customer-rewards.service';
import { CustomerRewardsController } from './customer-rewards.controller';
@Module({

    imports: [TypeOrmModule.forFeature([CustomerRewards])],
  controllers: [CustomerRewardsController],
  providers: [CustomerRewardsService],
})
export class CustomerRewardsModule {}
