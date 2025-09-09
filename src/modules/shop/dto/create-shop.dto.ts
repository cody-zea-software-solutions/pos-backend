import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  IsEnum,
  IsInt,
} from 'class-validator';

export class CreateShopDto {
  @IsInt()
  business_id: number;

  @IsString()
  shop_name: string;

  @IsString()
  shop_code: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  gst_number?: string;

  @IsOptional()
  @IsString()
  opening_time?: string;

  @IsOptional()
  @IsString()
  closing_time?: string;

  @IsOptional()
  @IsNumber()
  tax_rate?: number;

  @IsOptional()
  @IsString()
  currency_code?: string;

  @IsOptional()
  @IsString()
  branding_config?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsBoolean()
  enable_gst_billing?: boolean;

  @IsEnum(['TAXABLE', 'EXEMPT', 'ZERO_RATED'])
  default_gst_treatment: string;
}