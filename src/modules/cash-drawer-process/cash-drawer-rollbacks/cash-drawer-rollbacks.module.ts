import { Module } from '@nestjs/common';
import { CashDrawerRollbacksController } from './cash-drawer-rollbacks.controller';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashDrawerRollback } from './cash-drawer-rollbacks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CashDrawerRollback])],
  controllers: [CashDrawerRollbacksController],
  providers: [CashDrawerRollbacksService],
  exports: [CashDrawerRollbacksService],
})
export class CashDrawerRollbacksModule {}
