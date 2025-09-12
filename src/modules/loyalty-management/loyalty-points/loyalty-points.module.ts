import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { Customer } from '../customer/customer.entity';
import { Shop } from '../../shop/shop.entity';
import { Counter } from '../../counter/counter.entity';
import { User } from '../../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoyaltyPoints, Customer, Shop, Counter, User]),
  ],
  controllers: [LoyaltyPointsController],
  providers: [LoyaltyPointsService],
  exports: [LoyaltyPointsService],
})
export class LoyaltyPointsModule {}
