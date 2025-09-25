import { IsNotEmpty, IsNumber, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { RefundReason, RefundType, RefundMethod, RefundStatus } from '../refund.entity';

export class CreateRefundDto {
  @IsNotEmpty()
  refund_number: string;

  @IsNumber()
  original_transaction_id: number;

  @IsOptional()
  shop_id?: number;

  @IsOptional()
  counter_id?: number;

  @IsOptional()
  customer_id?: number;

  @IsDateString()
  refund_date: string;

  @IsNumber()
  refund_amount: number;

  @IsOptional()
  gst_refund_amount?: number;

  @IsEnum(RefundReason)
  refund_reason: RefundReason;

  @IsEnum(RefundType)
  refund_type: RefundType;

  @IsEnum(RefundMethod)
  refund_method: RefundMethod;

  @IsOptional()
  processed_by_user?: number;

  @IsOptional()
  authorized_by_user?: number;

  @IsOptional()
  status?: RefundStatus;

  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  affects_loyalty_points?: boolean;

  @IsOptional()
  loyalty_points_deducted?: number;

  @IsOptional()
  requires_gst_adjustment?: boolean;
}