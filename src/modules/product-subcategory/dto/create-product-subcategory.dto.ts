import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class CreateProductSubcategoryDto {
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  subcategory_name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  subcategory_code: string;

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
  default_hsn_code?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  default_gst_rate?: number;
}