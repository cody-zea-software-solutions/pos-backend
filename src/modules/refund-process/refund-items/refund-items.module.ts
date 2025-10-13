import { Module } from '@nestjs/common';
import { RefundItemsService } from './refund-items.service';
import { RefundItemsController } from './refund-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundItem } from './refund-item.entity';
import { RefundModule } from '../refund/refund.module';
import { TransactionsModule } from '../../pos-transactions/transactions/transactions.module';
import { ProductModule } from '../../product-management/product/product.module';
import { ProductVariationModule } from '../../product-management/product-variation/product-variation.module';
import { ConsignorModule } from '../../inventory/consignor/consignor.module';
import { TransactionItemsModule } from '../../pos-transactions/transaction-items/transaction-items.module';

@Module({
  imports: [TypeOrmModule.forFeature([RefundItem]), RefundModule, TransactionItemsModule, ProductModule, ProductVariationModule, ConsignorModule],
  providers: [RefundItemsService],
  controllers: [RefundItemsController],
  exports: [RefundItemsService],
})
export class RefundItemsModule {}
