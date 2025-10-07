import { IsString, IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  plan_name: string;

  @IsString()
  plan_code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  max_products: number;

  @IsInt()
  max_branches: number;

  @IsInt()
  max_users: number;

  @IsOptional()
  @IsBoolean()
  has_loyalty_features: boolean;

  @IsOptional()
  @IsBoolean()
  has_inventory_management: boolean;

  @IsOptional()
  @IsBoolean()
  has_reporting_analytics: boolean;

  @IsOptional()
  @IsBoolean()
  has_multi_branch_pricing: boolean;

  @IsOptional()
  @IsBoolean()
  has_gst_management: boolean;

  @IsOptional()
  @IsBoolean()
  has_batch_tracking: boolean;

  @IsOptional()
  @IsString()
  feature_list?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}