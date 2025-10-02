import {
  IsEnum,
  IsInt,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { BundleItemType } from '../bundle-item.entity';

export class CreateBundleItemDto {
  @IsInt()
  bundle_id: number;

  @IsOptional()
  @IsInt()
  product_id?: number;

  @IsOptional()
  @IsInt()
  variation_id?: number;

  @IsOptional()
  @IsInt()
  service_id?: number;

  @IsEnum(BundleItemType)
  item_type: BundleItemType;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  minimum_quantity?: number;

  @IsOptional()
  @IsInt()
  maximum_quantity?: number;

  @IsOptional()
  @IsBoolean()
  is_mandatory?: boolean;

  @IsOptional()
  @IsBoolean()
  allow_substitution?: boolean;

  @IsOptional()
  @IsNumber()
  individual_price?: number;

  @IsOptional()
  @IsNumber()
  bundle_price?: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @IsInt()
  sort_order?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  substitution_rules?: string;

  @IsOptional()
  @IsString()
  item_notes?: string;
}