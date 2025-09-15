import { Module } from '@nestjs/common';
import { ProductUnitsController } from './product-units.controller';
import { ProductUnitsService } from './product-units.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductUnit } from './product-unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductUnit])],
  controllers: [ProductUnitsController],
  providers: [ProductUnitsService],
  exports: [ProductUnitsService],
})
export class ProductUnitsModule {}
