import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { ShopModule } from '../../shop/shop.module';
import { Shop } from '../../shop/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { LoyaltyLevel } from '../loyalty-levels/loyalty-levels.entity';
import { CounterModule } from '../../counter/counter.module';
import { Counter } from '../../counter/counter.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Customer,LoyaltyLevel,Shop,Counter]),ShopModule,CounterModule],
  providers: [CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
