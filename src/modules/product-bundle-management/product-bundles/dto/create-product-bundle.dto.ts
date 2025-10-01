import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  Min,
  IsDate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BundleStatus, BundleType, GstTreatment, PricingStrategy } from '../bundle.enums';

export class CreateProductBundleDto {
  @IsString()
  bundle_name: string;

  @IsString()
  bundle_code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(BundleType)
  bundle_type: BundleType;

  @IsNumber()
  @Min(0)
  bundle_price: number;

  @IsNumber()
  @Min(0)
  bundle_cost: number;

  @IsNumber()
  discount_amount: number;

  @IsNumber()
  discount_percentage: number;

  @IsEnum(PricingStrategy)
  pricing_strategy: PricingStrategy;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  valid_from?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  valid_until?: Date;

  @IsOptional()
  @IsNumber()
  minimum_items_required?: number;

  @IsOptional()
  @IsNumber()
  maximum_items_allowed?: number;

  @IsOptional()
  @IsBoolean()
  allow_item_substitution?: boolean;

  @IsOptional()
  @IsBoolean()
  allow_quantity_modification?: boolean;

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
  @IsEnum(GstTreatment)
  gst_treatment?: GstTreatment;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsBoolean()
  enable_multi_branch_pricing?: boolean;

  @IsOptional()
  @IsNumber()
  default_pricing_group_id?: number;

  @IsOptional()
  @IsString()
  terms_conditions?: string;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @IsOptional()
  @IsBoolean()
  track_bundle_inventory?: boolean;

  @IsOptional()
  @IsNumber()
  reorder_level?: number;

  @IsOptional()
  @IsEnum(BundleStatus)
  bundle_status?: BundleStatus;
}