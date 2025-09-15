import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateProductCategoryDto {
  @IsString()
  category_code: string;

  @IsString()
  category_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  group_id: number;

  @IsOptional()
  @IsNumber()
  parent_category_id?: number;

  @IsOptional()
  @IsNumber()
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  default_hsn_code?: string;

  @IsOptional()
  @IsNumber()
  default_gst_rate?: number;
}