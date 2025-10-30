import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ShopModule } from '../../shop/shop.module';
import { CounterModule } from '../../counter/counter.module';
import { UsersModule } from '../../users/users.module';
import { CustomerModule } from '../../loyalty-management/customer/customer.module';
import { LoyaltyLevelsModule } from 'src/modules/loyalty-management/loyalty-levels/loyalty-levels.module';
import { LoyaltyPointsModule } from 'src/modules/loyalty-management/loyalty-points/loyalty-points.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), ShopModule, CounterModule, UsersModule, CustomerModule, LoyaltyLevelsModule, LoyaltyPointsModule,],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
