import {
  IsInt,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDateString,
  Min,
  IsDate,
} from 'class-validator';
import { SupplierOutstandingStatus } from '../supplier-outstanding.entity';
import { Type } from 'class-transformer';

export class CreateSupplierOutstandingDto {
  @IsInt()
  shop_id: number;

  @IsInt()
  supplier_id: number;

  @IsOptional()
  @IsInt()
  grn_id?: number;

  @IsNumber()
  @Min(0)
  total_amount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  paid_amount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  balance_amount?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  due_date?: Date;

  @IsOptional()
  @IsEnum(SupplierOutstandingStatus)
  status?: SupplierOutstandingStatus;
}