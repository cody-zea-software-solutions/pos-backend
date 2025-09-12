import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateLoyaltyPointsDto {
  @IsInt()
  customer_id: number;

  @IsInt()
  shop_id: number;

  @IsInt()
  counter_id: number;

  @IsInt()
  created_by_user: number;

  @IsInt()
  points_earned: number;

  @IsOptional()
  @IsInt()
  points_redeemed?: number;

  @IsString()
  transaction_type: string;

  @IsString()
  transaction_ref: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  expiry_date?:string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
