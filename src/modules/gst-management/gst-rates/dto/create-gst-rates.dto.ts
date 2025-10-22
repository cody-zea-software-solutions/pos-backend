import { IsEnum, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { GstCategory } from '../gst-rates.entity';

export class CreateGstRateDto {
  @IsNotEmpty()
  hsn_code: string;

  @IsEnum(GstCategory)
  gst_category: GstCategory;

  @IsNumber()
  cgst_rate: number;

  @IsNumber()
  sgst_rate: number;

  @IsNumber()
  igst_rate: number;

  @IsNumber()
  cess_rate: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  effective_from?: Date;

  @IsOptional()
  effective_to?: Date;

  @IsOptional()
  is_active?: boolean;
}
