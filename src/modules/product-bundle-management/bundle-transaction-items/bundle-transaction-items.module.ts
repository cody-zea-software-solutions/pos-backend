import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BundleTransactionItemsService } from './bundle-transaction-items.service';
import { BundleTransactionItemsController } from './bundle-transaction-items.controller';

import { BundleTransactionItems } from './bundle-transaction-items.entity';
import { BundleTransaction } from '../bundle-transactions/bundle-transactions.entity';
import { BundleItem } from '../bundle-items/bundle-item.entity';
import { ProductBundle } from '../product-bundles/product-bundle.entity';
import { Service } from '../../service-management/services/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BundleTransactionItems,  
      BundleTransaction,
      BundleItem,
      ProductBundle,
      Service,
    ]),
  ],
  providers: [BundleTransactionItemsService],
  controllers: [BundleTransactionItemsController],
  exports: [BundleTransactionItemsService],
})
export class BundleTransactionItemsModule {}
