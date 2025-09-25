import { Module } from '@nestjs/common';
import { RefundService } from './refund.service';
import { RefundController } from './refund.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './refund.entity';
import { TransactionsModule } from 'src/modules/pos-transactions/transactions/transactions.module';
import { ShopModule } from 'src/modules/shop/shop.module';
import { CounterModule } from 'src/modules/counter/counter.module';
import { CustomerModule } from 'src/modules/loyalty-management/customer/customer.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Refund]), TransactionsModule, ShopModule, CounterModule, CustomerModule, UsersModule],
  providers: [RefundService],
  controllers: [RefundController],
  exports: [RefundService],
})
export class RefundModule {}
