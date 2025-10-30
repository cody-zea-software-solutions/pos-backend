import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './discount.entity';
import { ProductModule } from '../product-management/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([Discount]), ProductModule],
  providers: [DiscountService],
  controllers: [DiscountController],
  exports: [DiscountService],
})
export class DiscountModule {}
