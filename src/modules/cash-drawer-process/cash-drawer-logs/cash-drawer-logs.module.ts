import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashDrawerLogs } from './cash-drawer-logs.entity';
import { CashDrawerLogsService } from './cash-drawer-logs.service';
import { CashDrawerLogsController } from './cash-drawer-logs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CashDrawerLogs])],
  controllers: [CashDrawerLogsController],
  providers: [CashDrawerLogsService],
})
export class CashDrawerLogsModule {}
