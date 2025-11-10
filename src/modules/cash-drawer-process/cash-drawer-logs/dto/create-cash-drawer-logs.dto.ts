import { IsBoolean, IsNumber,IsDecimal, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateCashDrawerLogsDto {
  @IsInt()
  shift_id: number;

  @IsInt()
  counter_id: number;

  @IsString()
  action: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  reference_id?: string;

  @IsOptional()
  @IsBoolean()
  requires_approval?: boolean;
  
  @IsInt()
  performed_by_user: number;

  @IsOptional()
  @IsInt()
  approved_by_user: number;
}
