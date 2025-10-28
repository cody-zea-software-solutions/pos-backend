import { Module } from '@nestjs/common';
import { ShopInventoryService } from './shop-inventory.service';
import { ShopInventoryController } from './shop-inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopInventory } from './shop-inventory.entity';
import { ShopModule } from '../../shop/shop.module';
import { ProductModule } from '../../product-management/product/product.module';
import { ProductVariationModule } from '../../product-management/product-variation/product-variation.module';
import { BatchesModule } from '../batches/batches.module';
import { UsersModule } from '../../users/users.module';
import { ConsignorModule } from '../consignor/consignor.module';

@Module({
  imports: [TypeOrmModule.forFeature([ShopInventory]),
   ShopModule,
   ProductModule,
   ProductVariationModule,
   BatchesModule,
   UsersModule,
   ConsignorModule,
  ],
  providers: [ShopInventoryService],
  controllers: [ShopInventoryController],
  exports: [ShopInventoryService],
})
export class ShopInventoryModule {}
