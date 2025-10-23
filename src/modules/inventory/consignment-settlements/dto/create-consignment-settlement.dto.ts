import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, IsDateString, Min, IsDate } from 'class-validator';

export class CreateConsignmentSettlementDto {
  @IsInt()
  consignor_id: number;

  @IsInt()
  shop_id: number;

  @IsDate()
  @Type(() => Date)
  settlement_period_start: Date;

  @IsDate()
  @Type(() => Date)
  settlement_period_end: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  settlement_date?: Date;

  @IsNumber()
  @Min(0)
  total_sales_amount: number;

  @IsNumber()
  @Min(0)
  total_commission: number;

  @IsNumber()
  @Min(0)
  total_payable: number;

  @IsString()
  @IsOptional()
  payment_status?: string;

  @IsString()
  @IsOptional()
  payment_reference?: string;

  @IsInt()
  processed_by_user: number;

  @IsString()
  @IsOptional()
  notes?: string;
}