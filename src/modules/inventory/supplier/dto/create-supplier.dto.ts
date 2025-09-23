import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEmail,
  Min,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  supplier_name: string;

  @IsString()
  supplier_code: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  contact_person?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  credit_limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  payment_terms_days?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  gst_number?: string;

  @IsOptional()
  @IsString()
  gst_registration_type?: string;
}