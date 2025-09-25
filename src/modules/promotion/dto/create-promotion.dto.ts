import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  promotion_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  promotion_type: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end_date?: Date;

  @IsOptional()
  @IsString()
  target_audience?: string;

  @IsOptional()
  @IsNumber()
  target_shop_id?: number;

  @IsOptional()
  @IsNumber()
  target_counter_id?: number;

  @IsOptional()
  @IsNumber()
  target_level_id?: number;

  @IsOptional()
  @IsString()
  promotion_rules?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsNumber()
  created_by_user: number;

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