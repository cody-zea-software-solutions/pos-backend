import { IsInt, IsDecimal, IsString, IsBoolean, IsOptional, IsDateString } from 'class-validator';

export class CreateCashDrawerRollbackDto {
  @IsInt()
  counter_id: number;

  @IsInt()
  shift_id: number;

  @IsDecimal()
  rollback_amount: number;

  @IsDecimal()
  balance_before_rollback: number;

  @IsDecimal()
  balance_after_rollback: number;

  @IsString()
  rollback_reason: string;

  @IsDateString()
  rollback_time: string;

  @IsInt()
  performed_by_user: number;

  @IsInt()
  authorized_by_user: number;

  @IsString()
  reference_transaction: string;

  @IsOptional()
  @IsBoolean()
  is_approved?: boolean;

  @IsOptional()
  @IsString()
  approval_notes?: string;
}
