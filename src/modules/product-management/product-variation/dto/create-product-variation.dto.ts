import { IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductVariationDto {
  @IsInt()
  product_id: number;

  @IsString()
  @IsNotEmpty()
  variation_name: string;

  @IsString()
  @IsNotEmpty()
  variation_code: string;

  @IsOptional()
  @IsString()
  variation_type?: string;

  @IsOptional()
  @IsString()
  variation_value?: string;

  @IsOptional()
  @IsNumber()
  price_adjustment?: number;

  @IsOptional()
  @IsNumber()
  cost_adjustment?: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsBoolean()
  auto_generate_barcode?: boolean;

  @IsOptional()
  @IsInt()
  stock_quantity?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  hsn_code?: string;

  @IsOptional()
  @IsNumber()
  gst_rate?: number;

  @IsOptional()
  @IsBoolean()
  inherit_parent_gst?: boolean;
}