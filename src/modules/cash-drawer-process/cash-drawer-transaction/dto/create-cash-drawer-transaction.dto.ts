import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '../cash-drawer-transaction-type.enum';

export class CreateCashDrawerTransactionDto {
  @IsNumber()
  counter_id: number;

  @IsNumber()
  shift_id: number;

  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @IsNumber()
  amount: number;

  @IsNumber()
  balance_before: number;

  @IsNumber()
  balance_after: number;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsNumber()
  performed_by_user: number;

  @IsNumber()
  authorized_by_user: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
