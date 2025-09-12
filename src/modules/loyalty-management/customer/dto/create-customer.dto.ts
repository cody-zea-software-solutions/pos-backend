import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Gender, CustomerType } from '../customer.entity';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  qr_code: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsOptional()
  @IsDateString()
  birth_date?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender = Gender.OTHER;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postal_code?: string;

  @IsOptional()
  @IsString()
  gst_number?: string;

  @IsOptional()
  @IsEnum(CustomerType)
  customer_type?: CustomerType = CustomerType.INDIVIDUAL;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsNumber()
  total_points?: number;

  @IsOptional()
  @IsNumber()
  current_level?: number;

  @IsOptional()
  @IsDateString()
  last_scan?: string;

  @IsOptional()
  @IsString()
  preferred_shop?: string;

  @IsOptional()
  @IsString()
  preferred_counter?: string;

  @IsOptional()
  @IsNumber()
  total_visits?: number;

  @IsOptional()
  total_spent?: number;
}
