import { Type } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, IsDate } from 'class-validator';

export class CreateDiscountDto {
  @IsString()
  discount_name: string;

  @IsString()
  discount_code: string;

  @IsString()
  discount_type: string;

  @IsNumber()
  discount_value: number;

  @IsOptional()
  @IsNumber()
  minimum_purchase?: number;

  @IsOptional()
  @IsNumber()
  maximum_discount?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  valid_from?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  valid_until?: Date;

  @IsOptional()
  @IsString()
  applicable_to?: string;

  @IsOptional()
  target_id?: number;

  @IsOptional()
  @IsNumber()
  usage_limit_per_customer?: number;

  @IsOptional()
  @IsNumber()
  total_usage_limit?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  terms_conditions?: string;

  @IsOptional()
  @IsBoolean()
  applies_to_variations?: boolean;

  @IsOptional()
  @IsBoolean()
  applies_to_consignment?: boolean;

  @IsOptional()
  @IsBoolean()
  is_gst_inclusive?: boolean;
}