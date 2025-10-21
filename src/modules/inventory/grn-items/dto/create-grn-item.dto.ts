import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  Min,
  IsDateString,
} from 'class-validator';
import { QualityStatus } from '../grn-item.entity';

export class CreateGrnItemDto {
  @IsInt()
  grn_id: number;

  @IsOptional()
  @IsInt()
  product_id?: number;

  @IsOptional()
  @IsInt()
  variation_id?: number;

  @IsInt()
  @Min(1)
  quantity_ordered: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity_received?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity_accepted?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity_rejected?: number;

  @IsNumber()
  @Min(0)
  unit_cost: number;

  @IsOptional()
  @IsNumber()
  total_cost?: number;

  @IsOptional()
  @IsNumber()
  gst_amount?: number;

  @IsOptional()
  @IsDateString()
  manufacture_date?: string;

  @IsOptional()
  @IsDateString()
  expiry_date?: string;

  @IsOptional()
  @IsEnum(QualityStatus)
  quality_status?: QualityStatus;

  @IsOptional()
  @IsString()
  rejection_reason?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  hsn_code?: string;

  @IsOptional()
  @IsNumber()
  gst_rate?: number;
}