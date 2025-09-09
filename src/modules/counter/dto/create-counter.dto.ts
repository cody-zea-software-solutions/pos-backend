import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  IsDecimal,
} from 'class-validator';

export class CreateCounterDto {
  @IsNumber()
  shop: number;

  @IsString()
  counter_name: string;

  @IsString()
  counter_code: string;

  @IsString()
  counter_type: string;

  @IsOptional()
  @IsBoolean()
  has_cash_drawer?: boolean;

  @IsOptional()
  @IsString()
  printer_config?: string;

  @IsOptional()
  @IsString()
  hardware_config?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  current_user?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces:2 })
    @Transform(({ value }) => {
      if (value === null || value === undefined) return 0;
      if (typeof value === 'string') return parseFloat(value);
      return value;
    })
  opening_cash_balance?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces:2 })
  @Transform(({ value }) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  current_cash_balance?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces:2 })
  @Transform(({ value }) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'string') return parseFloat(value);
    return value;
  })
  rollback_balance?: number;

  @IsOptional()
  last_rollback?: Date;

  @IsOptional()
  @IsNumber()
  rollback_by_user?: number;

  @IsOptional()
  @IsBoolean()
  enable_gst_printing?: boolean;
}