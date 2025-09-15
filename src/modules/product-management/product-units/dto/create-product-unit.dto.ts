import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum, IsNumber } from 'class-validator';

export class CreateProductUnitDto {
  @IsString()
  @IsNotEmpty()
  unit_name: string;

  @IsString()
  @IsOptional()
  unit_symbol?: string;

  @IsEnum(['WEIGHT', 'VOLUME', 'COUNT'])
  unit_type: string;

  @IsNumber()
  @IsOptional()
  base_unit_conversion?: number;

  @IsBoolean()
  @IsOptional()
  is_base_unit?: boolean;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}