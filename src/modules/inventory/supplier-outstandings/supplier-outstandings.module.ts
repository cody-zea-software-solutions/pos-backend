import { forwardRef, Module } from '@nestjs/common';
import { SupplierOutstandingsService } from './supplier-outstandings.service';
import { SupplierOutstandingsController } from './supplier-outstandings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierOutstanding } from './supplier-outstanding.entity';
import { ShopModule } from '../../shop/shop.module';
import { SupplierModule } from '../supplier/supplier.module';
import { GoodsReceivedNotesModule } from '../goods-received-notes/goods-received-notes.module';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierOutstanding]), SupplierModule, ShopModule, forwardRef(() => GoodsReceivedNotesModule),],
  providers: [SupplierOutstandingsService],
  controllers: [SupplierOutstandingsController],
  exports: [SupplierOutstandingsService],
})
export class SupplierOutstandingsModule {}
