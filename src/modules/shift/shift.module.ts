import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shift.entity';
import { UsersModule } from '../users/users.module';
import { ShopModule } from '../shop/shop.module';
import { CounterModule } from '../counter/counter.module';
import { Counter } from '../counter/counter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Counter]), UsersModule, ShopModule, CounterModule,],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService],
})
export class ShiftModule {}
