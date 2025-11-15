import { IsString, IsOptional, IsBoolean, IsNumber, IsDecimal } from 'class-validator';

export class CreateServiceCategoryDto {
  @IsNumber()
  group_id: number;

  @IsString()
  category_name: string;

  @IsString()
  category_code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  parent_service_category_id?: number;

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

  @IsOptional()
  @IsString()
  category_color?: string;

  @IsOptional()
  @IsString()
  category_icon?: string;
}
