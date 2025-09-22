import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEmail,
  Min,
} from 'class-validator';

export class CreateConsignorDto {
  @IsString()
  @IsNotEmpty()
  consignor_name: string;

  @IsString()
  @IsNotEmpty()
  consignor_code: string;

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
  commission_rate?: number;

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