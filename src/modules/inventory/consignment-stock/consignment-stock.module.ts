import { Module } from '@nestjs/common';
import { ConsignmentStockService } from './consignment-stock.service';
import { ConsignmentStockController } from './consignment-stock.controller';

@Module({
  providers: [ConsignmentStockService],
  controllers: [ConsignmentStockController]
})
export class ConsignmentStockModule {}
