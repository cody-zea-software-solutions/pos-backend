import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GstTransaction } from './gst-transactions.entity';
import { GstTransactionsService } from './gst-transactions.service';
import { GstTransactionsController } from './gst-transactions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GstTransaction])],
  controllers: [GstTransactionsController],
  providers: [GstTransactionsService],
  exports: [GstTransactionsService],
})
export class GstTransactionsModule {}
