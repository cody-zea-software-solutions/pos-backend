import { Module } from '@nestjs/common';
import { ConsignmentStockService } from './consignment-stock.service';
import { ConsignmentStockController } from './consignment-stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsignmentStock } from './consignment-stock.entity';
import { ProductModule } from '../../product-management/product/product.module';
import { ProductVariationModule } from '../../product-management/product-variation/product-variation.module';
import { ConsignorModule } from '../consignor/consignor.module';
import { ShopModule } from '../../shop/shop.module';

@Module({
  imports: [TypeOrmModule.forFeature([ConsignmentStock]), ProductModule, ProductVariationModule, ConsignorModule, ShopModule],
  providers: [ConsignmentStockService],
  controllers: [ConsignmentStockController],
  exports: [ConsignmentStockService],
})
export class ConsignmentStockModule {}
