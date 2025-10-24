import { Module } from '@nestjs/common';
import { InventoryReportsService } from './inventory-reports.service';
import { InventoryReportsController } from './inventory-reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopInventory } from '../shop-inventory/shop-inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopInventory])],
  providers: [InventoryReportsService],
  controllers: [InventoryReportsController]
})
export class InventoryReportsModule {}
