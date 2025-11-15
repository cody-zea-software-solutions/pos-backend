import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BundleTransaction } from './bundle-transactions.entity';
import { ProductBundle } from '../product-bundles/product-bundle.entity';
import { BundleTransactionService } from './bundle-transactions.service';
import { BundleTransactionController } from './bundle-transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BundleTransaction, ProductBundle]),
  ],
  controllers: [BundleTransactionController],
  providers: [BundleTransactionService],
  exports: [BundleTransactionService],
})
export class BundleTransactionModule {}
