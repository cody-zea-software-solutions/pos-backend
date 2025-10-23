import { IsEnum, IsNumber, IsOptional, IsString, IsBoolean, IsDateString } from 'class-validator';
import { TransactionType, GstTreatment, InvoiceType } from '../gst-transactions.entity';

export class CreateGstTransactionDto {
  @IsNumber()
  transaction_id: number;

  @IsEnum(TransactionType)
  transaction_type: TransactionType;

  @IsEnum(GstTreatment)
  gst_treatment: GstTreatment;

  @IsNumber()
  taxable_amount: number;

  @IsNumber()
  cgst_amount: number;

  @IsNumber()
  sgst_amount: number;

  @IsNumber()
  igst_amount: number;

  @IsNumber()
  cess_amount: number;

  @IsNumber()
  total_gst_amount: number;

  @IsOptional()
  @IsString()
  customer_gst_number?: string;

  @IsOptional()
  @IsString()
  customer_state?: string;

  @IsOptional()
  @IsString()
  supplier_gst_number?: string;

  @IsOptional()
  @IsString()
  supplier_state?: string;

  @IsBoolean()
  is_interstate: boolean;

  @IsBoolean()
  is_reverse_charge: boolean;

  @IsString()
  transaction_date: String;

  @IsEnum(InvoiceType)
  invoice_type: InvoiceType;
}
