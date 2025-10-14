import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  IsDate,
} from 'class-validator';
import { SupplierPaymentMethod, SupplierPaymentStatus } from '../supplier-payment.entity';
import { Type } from 'class-transformer';

export class CreateSupplierPaymentDto {
  @IsNotEmpty()
  @IsInt()
  shop_id: number;

  @IsNotEmpty()
  @IsInt()
  supplier_id: number;

  @IsOptional()
  @IsInt()
  grn_id?: number;

  @IsDate()
  @Type(() => Date)
  payment_date: Date;

  @IsNumber()
  payment_amount: number;

  @IsEnum(SupplierPaymentMethod)
  payment_method: SupplierPaymentMethod;

  @IsOptional()
  @IsString()
  reference_number?: string;

  @IsOptional()
  @IsString()
  payment_notes?: string;

  @IsOptional()
  @IsEnum(SupplierPaymentStatus)
  status?: SupplierPaymentStatus;

  @IsOptional()
  created_by_user?: number;

  @IsOptional()
  paid_by_user?: number;

  @IsOptional()
  @IsString()
  bank_account_number?: string;

  @IsOptional()
  @IsString()
  transaction_id?: string;
}