import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceTransaction } from './service-transactions.entity';
import { ServiceTransactionService } from './service-transactions.service';
import { ServiceTransactionController } from './service-transactions.controller';
import { Service } from '../services/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceTransaction, Service])],
  controllers: [ServiceTransactionController],
  providers: [ServiceTransactionService],
})
export class ServiceTransactionModule {}
