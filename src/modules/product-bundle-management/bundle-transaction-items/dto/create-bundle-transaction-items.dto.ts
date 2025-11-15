import { IsString, IsBoolean, IsEnum, IsOptional, IsNumber, IsDateString, isNumber, IsInt } from 'class-validator';

export class CreateBundleTransactionItemsDto {
  
  @IsInt()
  bundle_item_id:number;

  @IsInt()
  bundle_id:number;

  @IsInt()
  service_id:number;

  @IsNumber()
  variation_id: number//
  
  @IsNumber()
  appointment_id: number//

  @IsEnum(['PRODUCT', 'SERVICE'])//
  item_type: string;

  @IsOptional()
  @IsNumber()
  quantity_included?: number;//

  @IsOptional()
  @IsNumber()
  quantity_delivered?: number;//

  @IsOptional()
  @IsNumber()
  item_price?: number;//

  @IsEnum(['PENDING', 'DELIVERED', 'SUBSTITUTED', 'CANCELLED'])
  fulfillment_status: string;//

  @IsOptional()
  @IsString()
  substitution_details?: string;//

  @IsOptional()
  delivered_at?: Date;//
}
