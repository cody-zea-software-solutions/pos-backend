import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsDate,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  transaction_number: string;

  @IsNumber()
  shop_id: number;

  @IsNumber()
  counter_id: number;

  @IsOptional()
  @IsNumber()
  customer_id?: number;

  @IsDate()
  @Type(() => Date)
  transaction_date: Date;

  @IsNumber()
  subtotal: number;

  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsNumber()
  total_amount: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsNumber()
  change_amount?: number;

  @IsOptional()
  @IsString()
  payment_status?: string;

  @IsOptional()
  @IsString()
  transaction_type?: string;

  @IsNumber()
  processed_by_user: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  is_loyalty_applied?: boolean;

  @IsOptional()
  @IsNumber()
  loyalty_points_redeemed?: number;

  @IsOptional()
  @IsNumber()
  loyalty_points_earned?: number;

  @IsOptional()
  @IsString()
  receipt_number?: string;

  @IsOptional()
  @IsBoolean()
  has_consignment_items?: boolean;

  @IsOptional()
  @IsNumber()
  consignment_commission?: number;

  @IsOptional()
  @IsBoolean()
  is_gst_applicable?: boolean;

  @IsOptional()
  @IsNumber()
  total_cgst?: number;

  @IsOptional()
  @IsNumber()
  total_sgst?: number;

  @IsOptional()
  @IsNumber()
  total_igst?: number;

  @IsOptional()
  @IsNumber()
  total_cess?: number;

  @IsOptional()
  @IsString()
  invoice_type?: string;

  @IsOptional()
  @IsBoolean()
  is_b2b_transaction?: boolean;
}