import { IsString, IsBoolean, IsEnum, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateServiceResourceDto {
  @IsString()
  resource_name: string;

  @IsString()
  resource_code: string;

  @IsEnum(['EQUIPMENT', 'ROOM', 'TOOL', 'CONSUMABLE'])
  resource_type: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  shop_id: number;

  @IsOptional()
  @IsBoolean()
  is_shared_resource?: boolean;

  @IsOptional()
  @IsNumber()
  max_concurrent_usage?: number;

  @IsOptional()
  @IsString()
  maintenance_schedule?: string;

  @IsOptional()
  @IsDateString()
  last_maintenance?: string;

  @IsOptional()
  @IsDateString()
  next_maintenance_due?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  hourly_cost?: number;

  @IsOptional()
  @IsString()
  operating_instructions?: string;
}
