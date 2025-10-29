import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashDrawerTransaction } from './cash-drawer-transaction.entity';
import { CashDrawerTransactionService } from './cash-drawer-transaction.service';
import { CashDrawerTransactionController } from './cash-drawer-transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CashDrawerTransaction])],
  controllers: [CashDrawerTransactionController],
  providers: [CashDrawerTransactionService],
})
export class CashDrawerTransactionModule {}
