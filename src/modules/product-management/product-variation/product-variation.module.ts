import { Module } from '@nestjs/common';
import { ProductVariationService } from './product-variation.service';
import { ProductVariationController } from './product-variation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariation } from './product-variation.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariation]), ProductModule],
  providers: [ProductVariationService],
  controllers: [ProductVariationController],
  exports: [ProductVariationService],
})
export class ProductVariationModule {}
