import { Module } from '@nestjs/common';
import { CounterController } from './counter.controller';
import { CounterService } from './counter.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Counter } from './counter.entity';
import { ShopModule } from '../shop/shop.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Counter]), ShopModule, UsersModule],
  controllers: [CounterController],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}
