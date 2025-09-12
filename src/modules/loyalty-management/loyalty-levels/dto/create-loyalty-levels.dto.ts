import { IsString, IsInt, IsDecimal,IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateLoyaltyLevelsDto {
  @IsString()
  level_name: string;

  @IsInt()
  min_points_required: number;

  @IsInt()
  max_points_limit: number;

  @IsNumber()
  discount_percentage: number;

  @IsOptional()
  @IsString()
  benefits_description?: string;

  @IsOptional()
  @IsString()
  level_color?: string;

  @IsOptional()
  @IsString()
  level_icon?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
