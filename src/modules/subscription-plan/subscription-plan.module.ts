import { Module } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { SubscriptionPlanController } from './subscription-plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { Business } from '../business/business.entity';
import { Shop } from '../shop/shop.entity';
import { User } from '../users/user.entity';
import { Product } from '../product-management/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscriptionPlan, Shop, User, Product])],
  providers: [SubscriptionPlanService],
  controllers: [SubscriptionPlanController],
  exports: [SubscriptionPlanService],
})
export class SubscriptionPlanModule {}
