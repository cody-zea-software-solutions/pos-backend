import { Type } from 'class-transformer';
import {
  IsNumber,
  IsDateString,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class CreateShiftDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  shop_id: number;

  @IsNumber()
  counter_id: number;

  @IsDate()
  @Type(() => Date)
  shift_start: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  shift_end?: Date;

  @IsOptional()
  @IsNumber()
  opening_cash?: number;

  @IsOptional()
  @IsNumber()
  closing_cash?: number;

  @IsOptional()
  @IsNumber()
  expected_cash?: number;

  @IsOptional()
  @IsNumber()
  cash_difference?: number;

  @IsOptional()
  @IsNumber()
  total_transactions?: number;

  @IsOptional()
  @IsNumber()
  total_sales?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  total_rollbacks?: number;

  @IsOptional()
  @IsNumber()
  rollback_count?: number;
}