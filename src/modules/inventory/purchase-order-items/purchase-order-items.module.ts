import { Module } from '@nestjs/common';
import { PurchaseOrderItemsService } from './purchase-order-items.service';
import { PurchaseOrderItemsController } from './purchase-order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { ProductModule } from 'src/modules/product-management/product/product.module';
import { ProductVariationModule } from 'src/modules/product-management/product-variation/product-variation.module';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderItem]), PurchaseOrdersModule, ProductModule, ProductVariationModule],
  providers: [PurchaseOrderItemsService],
  controllers: [PurchaseOrderItemsController],
  exports: [PurchaseOrderItemsService],
})
export class PurchaseOrderItemsModule {}
