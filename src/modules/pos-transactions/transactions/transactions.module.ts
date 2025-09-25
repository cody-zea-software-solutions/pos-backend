import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { ShopModule } from 'src/modules/shop/shop.module';
import { CounterModule } from 'src/modules/counter/counter.module';
import { UsersModule } from 'src/modules/users/users.module';
import { CustomerModule } from 'src/modules/loyalty-management/customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), ShopModule, CounterModule, UsersModule, CustomerModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
