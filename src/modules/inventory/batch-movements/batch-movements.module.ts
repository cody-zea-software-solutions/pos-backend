import { Module } from '@nestjs/common';
import { BatchMovementsService } from './batch-movements.service';
import { BatchMovementsController } from './batch-movements.controller';

@Module({
  providers: [BatchMovementsService],
  controllers: [BatchMovementsController]
})
export class BatchMovementsModule {}
