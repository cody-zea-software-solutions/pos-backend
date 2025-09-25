import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ItemCondition, RestockAction } from '../refund-item.entity';

export class CreateRefundItemDto {
  @IsNumber()
  refund_id: number;

  @IsOptional()
  original_item_id?: number;

  @IsOptional()
  product_id?: number;

  @IsOptional()
  variation_id?: number;

  @IsOptional()
  batch_id?: number;

  @IsNumber()
  quantity_refunded: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  refund_amount: number;

  @IsOptional()
  gst_refund_amount?: number;

  @IsEnum(ItemCondition)
  condition: ItemCondition;

  @IsEnum(RestockAction)
  restock_action: RestockAction;

  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  is_consignment?: boolean;

  @IsOptional()
  consignor_id?: number;

  @IsOptional()
  consignment_adjustment?: number;
}