import { IsNumber, IsString } from 'class-validator';

export class CreateGstItemDetailDto {
  @IsNumber()
  gst_transaction_id: number;

  @IsNumber()
  transaction_item_id: number;

  @IsNumber()
  product_id: number;

  @IsString()
  hsn_code: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unit_price: number;

  @IsNumber()
  discount_amount: number;

  @IsNumber()
  taxable_value: number;

  @IsNumber()
  cgst_rate: number;

  @IsNumber()
  sgst_rate: number;

  @IsNumber()
  igst_rate: number;

  @IsNumber()
  cess_rate: number;

  @IsNumber()
  cgst_amount: number;

  @IsNumber()
  sgst_amount: number;

  @IsNumber()
  igst_amount: number;

  @IsNumber()
  cess_amount: number;

  @IsNumber()
  total_tax_amount: number;
}
