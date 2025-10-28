import { Module } from '@nestjs/common';
import { TransactionItemsService } from './transaction-items.service';
import { TransactionItemsController } from './transaction-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionItem } from './transaction-item.entity';
import { ProductVariationModule } from 'src/modules/product-management/product-variation/product-variation.module';
import { ProductModule } from 'src/modules/product-management/product/product.module';
import { ConsignorModule } from 'src/modules/inventory/consignor/consignor.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ShopInventoryModule } from 'src/modules/inventory/shop-inventory/shop-inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItem]), ProductVariationModule, ProductModule, ConsignorModule, TransactionsModule, ShopInventoryModule,],
  providers: [TransactionItemsService],
  controllers: [TransactionItemsController],
  exports: [TransactionItemsService],
})
export class TransactionItemsModule {}
