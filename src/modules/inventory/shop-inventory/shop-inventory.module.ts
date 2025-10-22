import { Module } from '@nestjs/common';
import { ShopInventoryService } from './shop-inventory.service';
import { ShopInventoryController } from './shop-inventory.controller';

@Module({
  providers: [ShopInventoryService],
  controllers: [ShopInventoryController]
})
export class ShopInventoryModule {}
