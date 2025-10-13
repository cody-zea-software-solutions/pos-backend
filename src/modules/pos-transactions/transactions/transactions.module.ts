import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ShopModule } from '../../shop/shop.module';
import { CounterModule } from '../../counter/counter.module';
import { UsersModule } from '../../users/users.module';
import { CustomerModule } from '../../loyalty-management/customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), ShopModule, CounterModule, UsersModule, CustomerModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
