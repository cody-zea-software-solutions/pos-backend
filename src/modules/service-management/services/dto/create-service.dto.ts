import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GstTreatment, ServiceType } from '../service.entity';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  service_name: string;

  @IsString()
  @IsNotEmpty()
  service_code: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsNumber()
  subcategory_id?: number;

  @IsNumber()
  base_price: number;

  @IsNumber()
  cost_price: number;

  @IsOptional()
  @IsNumber()
  duration_minutes?: number;

  @IsEnum(ServiceType)
  service_type: ServiceType;

  @IsOptional()
  @IsBoolean()
  requires_appointment?: boolean;

  @IsOptional()
  @IsBoolean()
  requires_staff_assignment?: boolean;

  @IsOptional()
  @IsNumber()
  max_concurrent_bookings?: number;

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
  @IsBoolean()
  enable_multi_branch_pricing?: boolean;

  @IsOptional()
  @IsNumber()
  default_pricing_group_id?: number;

  @IsOptional()
  @IsBoolean()
  requires_pre_payment?: boolean;

  @IsOptional()
  @IsNumber()
  advance_payment_percent?: number;

  @IsOptional()
  @IsString()
  service_instructions?: string;

  @IsOptional()
  @IsString()
  cancellation_policy?: string;

  @IsOptional()
  @IsNumber()
  cancellation_hours_before?: number;

  @IsOptional()
  @IsNumber()
  cancellation_fee_percent?: number;
}