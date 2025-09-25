import { IsInt, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateTransactionItemDto {
  @IsInt()
  transaction_id: number;

  @IsOptional()
  @IsInt()
  product_id?: number;

  @IsOptional()
  @IsInt()
  variation_id?: number;

  @IsOptional()
  @IsInt()
  batch_id?: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsOptional()
  @IsNumber()
  discount_amount?: number;

  @IsOptional()
  @IsNumber()
  tax_rate?: number;

  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @IsNumber()
  line_total: number;

  @IsOptional()
  @IsString()
  item_type?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  is_consignment?: boolean;

  @IsOptional()
  @IsInt()
  consignor_id?: number;

  @IsOptional()
  @IsNumber()
  consignment_commission?: number;

  @IsOptional()
  @IsString()
  hsn_code?: string;

  @IsOptional()
  @IsNumber()
  gst_rate?: number;

  @IsOptional()
  @IsNumber()
  cgst_amount?: number;

  @IsOptional()
  @IsNumber()
  sgst_amount?: number;

  @IsOptional()
  @IsNumber()
  igst_amount?: number;

  @IsOptional()
  @IsNumber()
  cess_amount?: number;

  @IsOptional()
  @IsInt()
  pricing_group_id?: number;

  @IsOptional()
  @IsString()
  price_source?: string;
}