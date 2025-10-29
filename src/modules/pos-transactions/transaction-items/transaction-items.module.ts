import { Module } from '@nestjs/common';
import { TransactionItemsService } from './transaction-items.service';
import { TransactionItemsController } from './transaction-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionItem } from './transaction-item.entity';
import { ProductVariationModule } from '../../product-management/product-variation/product-variation.module';
import { ProductModule } from '../../product-management/product/product.module';
import { ConsignorModule } from '../../inventory/consignor/consignor.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { ShopInventoryModule } from '../../inventory/shop-inventory/shop-inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionItem]), ProductVariationModule, ProductModule, ConsignorModule, TransactionsModule, ShopInventoryModule,],
  providers: [TransactionItemsService],
  controllers: [TransactionItemsController],
  exports: [TransactionItemsService],
})
export class TransactionItemsModule {}
