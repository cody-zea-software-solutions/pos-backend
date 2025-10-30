import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promotion } from './promotion.entity';
import { UsersModule } from '../users/users.module';
import { CounterModule } from '../counter/counter.module';
import { ShopModule } from '../shop/shop.module';
import { LoyaltyLevelsModule } from '../loyalty-management/loyalty-levels/loyalty-levels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Promotion]), UsersModule, CounterModule, ShopModule, LoyaltyLevelsModule],
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService],
})
export class PromotionModule {}
