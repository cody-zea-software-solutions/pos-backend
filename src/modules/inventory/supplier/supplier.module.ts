import { forwardRef, Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { SupplierOutstandingsModule } from '../supplier-outstandings/supplier-outstandings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SupplierService],
  controllers: [SupplierController],
  exports: [SupplierService],
})
export class SupplierModule {}
