import { IsInt, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, IsString } from 'class-validator';

export class CreateServiceTransactionDto {
  @IsInt()
  transaction_id: number;

  @IsInt()
  service_id: number;

  @IsInt()
  appointment_id: number;

  @IsInt()
  staff_user_id: number;

  @IsOptional()
  service_start_time?: Date;

  @IsOptional()
  service_end_time?: Date;

  @IsOptional()
  @IsInt()
  actual_duration_minutes?: number;

  @IsOptional()
  @IsNumber()
  quoted_price?: number;

  @IsOptional()
  @IsNumber()
  actual_price?: number;

  @IsOptional()
  @IsNumber()
  staff_commission?: number;

  @IsOptional()
  @IsEnum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  service_status?: string;

  @IsOptional()
  @IsString()
  service_notes?: string;

  @IsOptional()
  @IsString()
  customer_feedback?: string;

  @IsOptional()
  @IsInt()
  customer_rating?: number;

  @IsOptional()
  @IsBoolean()
  requires_follow_up?: boolean;

  @IsOptional()
  follow_up_date?: Date;

  @IsOptional()
  @IsString()
  follow_up_notes?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;
}
