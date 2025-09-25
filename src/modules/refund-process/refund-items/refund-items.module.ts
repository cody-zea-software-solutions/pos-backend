import { Module } from '@nestjs/common';
import { RefundItemsService } from './refund-items.service';
import { RefundItemsController } from './refund-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundItem } from './refund-item.entity';
import { RefundModule } from '../refund/refund.module';
import { TransactionsModule } from 'src/modules/pos-transactions/transactions/transactions.module';
import { ProductModule } from 'src/modules/product-management/product/product.module';
import { ProductVariationModule } from 'src/modules/product-management/product-variation/product-variation.module';
import { ConsignorModule } from 'src/modules/inventory/consignor/consignor.module';
import { TransactionItemsModule } from 'src/modules/pos-transactions/transaction-items/transaction-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefundItem]), RefundModule, TransactionItemsModule, ProductModule, ProductVariationModule, ConsignorModule],
  providers: [RefundItemsService],
  controllers: [RefundItemsController],
  exports: [RefundItemsService],
})
export class RefundItemsModule {}
