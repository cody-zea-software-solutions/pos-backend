import {
  IsInt,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsNumber,
  Min,
  IsDate,
} from 'class-validator';
import { PurchaseOrderStatus } from '../purchase-order.entity';
import { Type } from 'class-transformer';

export class CreatePurchaseOrderDto {
  @IsString()
  po_number: string;

  @IsInt()
  shop_id: number;

  @IsInt()
  supplier_id: number;

  @IsDate()
  @Type(() => Date)
  order_date: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expected_delivery_date?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_gst_amount?: number;

  @IsOptional()
  @IsEnum(PurchaseOrderStatus)
  status?: PurchaseOrderStatus;

  @IsOptional()
  @IsString()
  terms_conditions?: string;

  @IsOptional()
  @IsInt()
  created_by_user?: number;

  @IsOptional()
  @IsInt()
  approved_by_user?: number;

  @IsOptional()
  @IsBoolean()
  is_gst_applicable?: boolean;
}