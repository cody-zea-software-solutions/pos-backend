import { Module } from '@nestjs/common';
import { ConsignmentSettlementsService } from './consignment-settlements.service';
import { ConsignmentSettlementsController } from './consignment-settlements.controller';

@Module({
  providers: [ConsignmentSettlementsService],
  controllers: [ConsignmentSettlementsController]
})
export class ConsignmentSettlementsModule {}
