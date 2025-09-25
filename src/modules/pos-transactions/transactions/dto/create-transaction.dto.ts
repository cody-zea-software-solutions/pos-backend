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

  @IsNumber()
  customer_id: number;

  @IsDate()
  @Type(() => Date)
  transaction_date: Date;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  tax_amount: number;

  @IsNumber()
  discount_amount: number;

  @IsNumber()
  total_amount: number;

  @IsNumber()
  paid_amount: number;

  @IsNumber()
  change_amount: number;

  @IsString()
  payment_status: string;

  @IsString()
  transaction_type: string;

  @IsNumber()
  processed_by_user: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsBoolean()
  is_loyalty_applied: boolean;

  @IsNumber()
  loyalty_points_earned: number;

  @IsNumber()
  loyalty_points_redeemed: number;

  @IsOptional()
  @IsString()
  receipt_number?: string;

  @IsBoolean()
  has_consignment_items: boolean;

  @IsNumber()
  consignment_commission: number;

  @IsBoolean()
  is_gst_applicable: boolean;

  @IsNumber()
  total_cgst: number;

  @IsNumber()
  total_sgst: number;

  @IsNumber()
  total_igst: number;

  @IsNumber()
  total_cess: number;

  @IsOptional()
  @IsString()
  invoice_type?: string;

  @IsBoolean()
  is_b2b_transaction: boolean;
}