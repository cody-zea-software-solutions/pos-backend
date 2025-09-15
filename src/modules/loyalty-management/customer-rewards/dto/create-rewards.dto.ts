import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateCustomerRewardsDto {
  @IsInt()
  customer_id: number;

  @IsInt()
  reward_id: number;

  @IsOptional()
  @IsDateString()
  redeemed_date?: string;

  @IsOptional()
  @IsDateString()
  used_date?: string;

  @IsInt()
  shop_id: number;

  @IsInt()
  counter_id: number;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  transaction_ref?: string;

  @IsInt()
  processed_by_user: number;
}
