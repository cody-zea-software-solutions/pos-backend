import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateServiceResourceRequirementDto {
  @IsNumber()
  service_id: number;

  @IsNumber()
  resource_id: number;

  @IsNumber()
  quantity_required: number;

  @IsNumber()
  duration_minutes: number;

  @IsOptional()
  @IsBoolean()
  is_mandatory?: boolean;

  @IsOptional()
  @IsBoolean()
  is_consumable?: boolean;

  @IsOptional()
  @IsString()
  usage_notes?: string;
}
