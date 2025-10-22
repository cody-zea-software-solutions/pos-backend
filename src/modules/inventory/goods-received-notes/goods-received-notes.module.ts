import { forwardRef, Module } from '@nestjs/common';
import { GoodsReceivedNotesService } from './goods-received-notes.service';
import { GoodsReceivedNotesController } from './goods-received-notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsReceivedNote } from './goods-received-note.entity';
import { ShopModule } from '../../shop/shop.module';
import { SupplierModule } from '../supplier/supplier.module';
import { PurchaseOrdersModule } from '../purchase-orders/purchase-orders.module';
import { UsersModule } from '../../users/users.module';
import { SupplierOutstandingsModule } from '../supplier-outstandings/supplier-outstandings.module';

@Module({
  imports: [TypeOrmModule.forFeature([GoodsReceivedNote]), ShopModule, SupplierModule, PurchaseOrdersModule, UsersModule, forwardRef(() => SupplierOutstandingsModule),],
  providers: [GoodsReceivedNotesService],
  controllers: [GoodsReceivedNotesController],
  exports: [GoodsReceivedNotesService],
})
export class GoodsReceivedNotesModule {}
