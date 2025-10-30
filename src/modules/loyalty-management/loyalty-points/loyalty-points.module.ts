import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyPoints } from './loyalty-points.entity';
import { LoyaltyPointsController } from './loyalty-points.controller';
import { LoyaltyPointsService } from './loyalty-points.service';
import { CustomerModule } from '../customer/customer.module';
import { ShopModule } from 'src/modules/shop/shop.module';
import { CounterModule } from 'src/modules/counter/counter.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LoyaltyPoints]),
    CustomerModule, ShopModule, CounterModule, UsersModule,
  ],
  controllers: [LoyaltyPointsController],
  providers: [LoyaltyPointsService],
  exports: [LoyaltyPointsService],
})
export class LoyaltyPointsModule {}
