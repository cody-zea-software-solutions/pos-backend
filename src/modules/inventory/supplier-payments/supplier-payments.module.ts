import { Module } from '@nestjs/common';
import { SupplierPaymentsService } from './supplier-payments.service';
import { SupplierPaymentsController } from './supplier-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierPayment } from './supplier-payment.entity';
import { ShopModule } from 'src/modules/shop/shop.module';
import { SupplierModule } from '../supplier/supplier.module';
import { UsersModule } from 'src/modules/users/users.module';
import { GoodsReceivedNote } from '../goods-received-notes/goods-received-note.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SupplierPayment, GoodsReceivedNote]), ShopModule, SupplierModule, UsersModule],
  providers: [SupplierPaymentsService],
  controllers: [SupplierPaymentsController],
  exports: [SupplierPaymentsService],
})
export class SupplierPaymentsModule {}
