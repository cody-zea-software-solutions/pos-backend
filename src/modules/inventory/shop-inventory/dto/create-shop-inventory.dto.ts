import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateShopInventoryDto {
  @IsInt()
  shop_id: number;

  @IsInt()
  product_id: number;

  @IsOptional()
  @IsInt()
  variation_id?: number;

  @IsOptional()
  @IsInt()
  batch_id?: number;

  @IsInt()
  @Min(0)
  available_quantity: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reserved_quantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minimum_stock_level?: number;

  @IsOptional()
  @IsInt()
  last_updated_by?: number;

  @IsOptional()
  @IsBoolean()
  is_consignment?: boolean;

  @IsOptional()
  @IsInt()
  consignor_id?: number;
}