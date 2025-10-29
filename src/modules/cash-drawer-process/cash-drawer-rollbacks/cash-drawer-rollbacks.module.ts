import { Module } from '@nestjs/common';
import { CashDrawerRollbacksController } from './cash-drawer-rollbacks.controller';
import { CashDrawerRollbacksService } from './cash-drawer-rollbacks.service';

@Module({
  controllers: [CashDrawerRollbacksController],
  providers: [CashDrawerRollbacksService]
})
export class CashDrawerRollbacksModule {}
