import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePurchaseOrderItemDto {
  @IsInt()
  po_id: number;

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
  @IsNumber()
  unit_price?: number;

  @IsOptional()
  @IsNumber()
  total_price?: number;

  @IsOptional()
  @IsNumber()
  gst_amount?: number;

  @IsOptional()
  @IsNumber()
  gst_rate?: number;

  @IsOptional()
  @IsString()
  hsn_code?: string;

  @IsOptional()
  @IsString()
  specifications?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}