import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { GrnStatus, GrnPaymentStatus } from '../goods-received-note.entity';
import { Type } from 'class-transformer';

export class CreateGoodsReceivedNoteDto {
  @IsString()
  grn_number: string;

  @IsNumber()
  shop_id: number;

  @IsNumber()
  supplier_id: number;

  @IsOptional()
  @IsNumber()
  purchase_order_id?: number;

  @IsOptional()
  @IsNumber()
  received_by_user?: number;

  @IsOptional()
  @IsNumber()
  verified_by_user?: number;

  @IsOptional()
  @IsNumber()
  posted_by_user?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  grn_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  received_time?: Date;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  total_gst_amount?: number;

  @IsOptional()
  @IsEnum(GrnStatus)
  status?: GrnStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsString()
  delivery_note_reference?: string;

  @IsOptional()
  @IsString()
  vehicle_number?: string;

  @IsOptional()
  @IsString()
  driver_name?: string;

  @IsOptional()
  @IsBoolean()
  is_gst_applicable?: boolean;

  @IsOptional()
  @IsEnum(GrnPaymentStatus)
  payment_status?: GrnPaymentStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  due_date?: Date;

  @IsOptional()
  @IsNumber()
  total_outstanding_amount?: number;
}