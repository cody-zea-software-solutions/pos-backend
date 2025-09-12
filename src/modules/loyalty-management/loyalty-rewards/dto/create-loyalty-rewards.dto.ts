import { IsString, IsInt, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateLoyaltyRewardsDto {
  @IsString()
  reward_name: string;

  @IsString()
  reward_type: string;

  @IsInt()
  points_required: number;

  @IsNumber()
  value_amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  valid_from?: Date;

  @IsOptional()
  valid_until?: Date;

  @IsOptional()
  @IsInt()
  usage_limit_per_customer?: number;

  @IsOptional()
  @IsInt()
  total_usage_limit?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  reward_code?: string;

  @IsOptional()
  @IsString()
  terms_conditions?: string;
}
