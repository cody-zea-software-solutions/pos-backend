import { IsString, IsNumber, IsOptional, IsDecimal } from 'class-validator';

export class CreateGstReturnDto {
  @IsNumber()
  shop_id: number;

  @IsString()
  return_type: string;

  @IsString()
  period_month: string;

  @IsString()
  period_year: string;

  @IsOptional()
  filing_date?: Date;

  @IsString()
  status: string;

  @IsNumber()
  total_taxable_sales: number;

  @IsNumber()
  total_cgst_collected: number;

  @IsNumber()
  total_sgst_collected: number;

  @IsNumber()
  total_igst_collected: number;

  @IsNumber()
  total_cess_collected: number;

  @IsNumber()
  total_taxable_purchases: number;

  @IsNumber()
  total_cgst_paid: number;

  @IsNumber()
  total_sgst_paid: number;

  @IsNumber()
  total_igst_paid: number;

  @IsNumber()
  total_cess_paid: number;

  @IsNumber()
  net_tax_liability: number;

  @IsOptional()
  filing_response?: string;

  @IsNumber()
  filed_by_user: number;
}
