import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateConsignmentStockDto {
  @IsInt()
  product_id: number;

  @IsOptional()
  @IsInt()
  variation_id?: number;

  @IsInt()
  consignor_id: number;

  @IsInt()
  shop_id: number;

  @IsPositive()
  quantity_received: number;

  @IsOptional()
  @IsPositive()
  quantity_available?: number;

  @IsOptional()
  @IsPositive()
  quantity_returned?: number;

  @IsOptional()
  @IsPositive()
  quantity_sold?: number;

  @IsNumber()
  consignor_price: number;

  @IsNumber()
  @IsOptional()
  commission_amount?: number;

  @IsNumber()
  selling_price: number;

  @IsOptional()
  @IsString()
  status?: string; 

  @IsOptional()
  @IsString()
  notes?: string;
}