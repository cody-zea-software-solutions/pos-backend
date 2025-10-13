import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './refund.entity';
import { TransactionsModule } from '../../pos-transactions/transactions/transactions.module';
import { ShopModule } from '../../shop/shop.module';
import { CounterModule } from '../../counter/counter.module';
import { CustomerModule } from '../../loyalty-management/customer/customer.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Refund]), TransactionsModule, ShopModule, CounterModule, CustomerModule, UsersModule],
  providers: [RefundService],
  controllers: [RefundController],
  exports: [RefundService],
})
export class RefundModule {}
