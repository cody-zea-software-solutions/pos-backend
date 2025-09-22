import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsUrl,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  product_code: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsBoolean()
  auto_generate_barcode?: boolean;

  @IsOptional()
  @IsString()
  generated_barcode_prefix?: string;

  @IsOptional()
  @IsNumber()
  group_id?: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsNumber()
  subcategory_id?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  product_type?: string;

  @IsNumber()
  @Min(0)
  base_price: number;

  @IsNumber()
  @Min(0)
  cost_price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wholesale_price?: number;

  @IsOptional()
  @IsNumber()
  unit_id?: number;

  @IsOptional()
  @IsString()
  unit_of_measure?: string;

  @IsOptional()
  @IsBoolean()
  is_batch_tracked?: boolean;

  @IsOptional()
  @IsBoolean()
  has_expiry?: boolean;

  @IsOptional()
  @IsNumber()
  shelf_life_days?: number;

  @IsOptional()
  @IsString()
  hsn_code?: string;

  @IsOptional()
  @IsNumber()
  gst_rate?: number;

  @IsOptional()
  @IsBoolean()
  is_gst_applicable?: boolean;

  @IsOptional()
  @IsString()
  gst_treatment?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsUrl()
  image_url?: string;

  @IsOptional()
  @IsNumber()
  reorder_level?: number;

  @IsOptional()
  @IsNumber()
  max_stock_level?: number;

  @IsOptional()
  @IsBoolean()
  has_variations?: boolean;

  @IsOptional()
  @IsBoolean()
  is_consignment?: boolean;

  @IsOptional()
  @IsNumber()
  consignor_id?: number;

  @IsOptional()
  @IsNumber()
  consignment_rate?: number;

  @IsOptional()
  @IsBoolean()
  enable_multi_branch_pricing?: boolean;
}