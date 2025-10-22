import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './batches.entity';
import { ProductModule } from 'src/modules/product-management/product/product.module';
import { ProductVariationModule } from 'src/modules/product-management/product-variation/product-variation.module';
import { SupplierModule } from '../supplier/supplier.module';
import { UsersModule } from 'src/modules/users/users.module';
import { ConsignorModule } from '../consignor/consignor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Batch]), ProductModule, ProductVariationModule, SupplierModule, UsersModule, ConsignorModule],
  providers: [BatchesService],
  controllers: [BatchesController],
  exports: [BatchesService],
})
export class BatchesModule {}
