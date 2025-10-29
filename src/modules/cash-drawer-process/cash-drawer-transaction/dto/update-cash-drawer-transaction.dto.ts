import { PartialType } from '@nestjs/mapped-types';
import { CreateCashDrawerTransactionDto } from './create-cash-drawer-transaction.dto';

export class UpdateCashDrawerTransactionDto extends PartialType(CreateCashDrawerTransactionDto) {}
