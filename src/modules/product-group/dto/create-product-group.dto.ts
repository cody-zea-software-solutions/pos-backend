import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
  IsDecimal,
} from 'class-validator';

export class CreateProductGroupDto {
  @IsString()
  group_code: string;

  @IsString()
  group_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  group_color?: string;

  @IsOptional()
  @IsString()
  group_icon?: string;

  @IsOptional()
  @IsString()
  default_hsn_code?: string;

  @IsOptional()
  @IsNumber()
  default_gst_rate?: number;
}